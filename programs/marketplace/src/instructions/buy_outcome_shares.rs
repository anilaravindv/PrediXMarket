use crate::errors::{MarketError, ShareError};
use crate::events::{emit_market_liquidity_price_event, emit_market_outcome_price_events};
use crate::instructions::helpers::transfer_outcome_shares_from_pool;
use crate::state::{
    market::{Market, MarketState, Outcome},
    share::Share,
};
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct BuyOutcomeShares<'info> {
    #[account(mut, has_one = authority @ ShareError::NotOwnedByAuthority, has_one = market @ ShareError::NotOwnedByMarket)]
    pub share: Account<'info, Share>,
    #[account(mut)]
    pub market: Account<'info, Market>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn buy_outcome_shares(
    ctx: Context<BuyOutcomeShares>,
    outcome: Outcome,
    amount: u64,
    min_outcome_shares_to_buy: u64,
) -> Result<()> {
    let market: &mut Account<Market> = &mut ctx.accounts.market;
    let share: &mut Account<Share> = &mut ctx.accounts.share;
    let authority: &Signer = &ctx.accounts.authority;
    let system_program: &Program<System> = &ctx.accounts.system_program;

    require!(
        market.state == MarketState::Open,
        MarketError::MarketNotOpen
    );

    require_keys_eq!(
        market.key(),
        share.market.key(),
        ShareError::NotOwnedByMarket
    );

    require!(!market.is_expired(), MarketError::MarketExpired);

    require!(amount > 0, MarketError::InsufficientAmount);

    let shares = calc_buy_amount(market, &outcome, amount)?;
    require!(
        shares >= min_outcome_shares_to_buy,
        MarketError::MinBuyAmountNotReached
    );

    let fee_amount = (amount as f64 * market.fee_percentage / 100.0) as u64;
    market.fees_pool_weight += fee_amount;
    let value_minus_fees = amount - fee_amount;

    market.increase_volume(amount);
    market.add_shares_to_market(value_minus_fees);

    {
        let available_outcome_shares = if outcome == Outcome::Yes {
            market.available_yes_shares
        } else {
            market.available_no_shares
        };
        require!(
            available_outcome_shares >= shares,
            MarketError::InsufficientAvailableOutcomeShares
        );
    }

    let yes_shares = if outcome == Outcome::Yes { shares } else { 0 };
    let no_shares = if outcome == Outcome::No { shares } else { 0 };

    transfer_outcome_shares_from_pool(market, share, yes_shares, no_shares);

    let cpi_context = CpiContext::new(
        system_program.to_account_info(),
        anchor_lang::system_program::Transfer {
            from: authority.to_account_info(),
            to: market.to_account_info(),
        },
    );

    anchor_lang::system_program::transfer(cpi_context, amount)?;

    emit_market_outcome_price_events(market);
    emit_market_liquidity_price_event(market);

    Ok(())
}

fn calc_buy_amount(market: &mut Account<Market>, outcome: &Outcome, amount: u64) -> Result<u64> {
    let amount_minus_fees = amount - (amount as f64 * market.fee_percentage / 100.0) as u64;
    let buy_token_pool_balance = if *outcome == Outcome::Yes {
        market.available_yes_shares
    } else {
        market.available_no_shares
    };

    let mut ending_outcome_balance = buy_token_pool_balance;

    let other = if *outcome == Outcome::Yes {
        market.available_no_shares
    } else {
        market.available_yes_shares
    };

    ending_outcome_balance = ending_outcome_balance * other / (other + amount_minus_fees);

    require!(
        ending_outcome_balance > 0,
        MarketError::EndingOutcomeBalanceMustBeNonZero
    );

    Ok(buy_token_pool_balance + amount_minus_fees - ending_outcome_balance)
}
