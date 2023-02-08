use crate::errors::{MarketError, ShareError};
use crate::events::{emit_market_liquidity_price_event, emit_market_outcome_price_events};
use crate::instructions::helpers::transfer_outcome_shares_to_pool;
use crate::state::{
    market::{Market, MarketState, Outcome},
    share::Share,
};
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct SellOutcomeShares<'info> {
    #[account(mut, has_one = authority @ ShareError::NotOwnedByAuthority, has_one = market @ ShareError::NotOwnedByMarket)]
    pub share: Account<'info, Share>,
    #[account(mut)]
    pub market: Account<'info, Market>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn sell_outcome_shares(
    ctx: Context<SellOutcomeShares>,
    outcome: Outcome,
    amount: u64,
    max_outcome_shares_to_sell: u64,
) -> Result<()> {
    let share: &mut Account<Share> = &mut ctx.accounts.share;
    let market: &mut Account<Market> = &mut ctx.accounts.market;
    let authority: &Signer = &ctx.accounts.authority;

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

    let shares = calc_sell_amount(market, &outcome, amount)?;

    require!(
        shares >= max_outcome_shares_to_sell,
        MarketError::MaxSellAmountExceeded
    );
    require!(shares > 0, MarketError::SharesToSellIsZero);
    {
        let available_outcome_shares = if outcome == Outcome::Yes {
            share.yes_shares
        } else {
            share.no_shares
        };
        require!(
            available_outcome_shares >= shares,
            ShareError::InsufficientOutcomeShares
        );
    }

    transfer_outcome_shares_to_pool(market, share, outcome, shares);

    // adding fee to transaction value
    let fee_amount = (amount as f64 * market.fee_percentage / 100.0) as u64;
    market.fees_pool_weight += fee_amount;
    let value_plus_fees = amount + fee_amount;

    require!(
        market.balance >= value_plus_fees,
        MarketError::InsufficientBalance
    );

    market.remove_shares_from_market(value_plus_fees);

    **market.to_account_info().try_borrow_mut_lamports()? -= amount;
    **authority.to_account_info().try_borrow_mut_lamports()? += amount;

    emit_market_outcome_price_events(market);
    emit_market_liquidity_price_event(market);

    Ok(())
}

fn calc_sell_amount(market: &mut Account<Market>, outcome: &Outcome, amount: u64) -> Result<u64> {
    let amount_plus_fees = (amount as f64 * (1.0 + market.fee_percentage / 100.0)) as u64;
    let sell_token_pool_balance = if *outcome == Outcome::Yes {
        market.available_yes_shares
    } else {
        market.available_no_shares
    };
    let mut ending_outcome_balance = sell_token_pool_balance;

    let other = if *outcome == Outcome::Yes {
        market.available_no_shares
    } else {
        market.available_yes_shares
    };

    ending_outcome_balance = ending_outcome_balance * other / (other - amount_plus_fees);

    require!(
        ending_outcome_balance > 0,
        MarketError::EndingOutcomeBalanceMustBeNonZero
    );

    Ok(amount_plus_fees + (ending_outcome_balance) - sell_token_pool_balance)
}
