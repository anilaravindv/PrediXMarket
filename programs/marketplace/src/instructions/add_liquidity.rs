use crate::errors::{MarketError, ShareError};
use crate::events::emit_market_liquidity_price_event;
use crate::instructions::helpers::{rebalance_fees_pool, transfer_outcome_shares_from_pool};
use crate::state::{
    market::{Market, MarketState},
    share::Share,
};
use anchor_lang::prelude::*;
use std::cmp::max;

#[derive(Accounts)]
pub struct AddLiquidityShares<'info> {
    #[account(mut, has_one = authority @ ShareError::NotOwnedByAuthority, has_one = market @ ShareError::NotOwnedByMarket)]
    pub share: Account<'info, Share>,
    #[account(mut)]
    pub market: Account<'info, Market>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn add_liquidity(ctx: Context<AddLiquidityShares>, amount: u64) -> Result<()> {
    let share: &mut Account<Share> = &mut ctx.accounts.share;
    let market: &mut Account<Market> = &mut ctx.accounts.market;
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

    let liquidity_amount;
    let mut yes_send_back_amount = 0;
    let mut no_send_back_amount = 0;

    if market.liquidity > 0 {
        let max_available_outcome_shares =
            max(market.available_yes_shares, market.available_no_shares);
        let pool_weight = max(0, max_available_outcome_shares);

        liquidity_amount = amount * market.liquidity / pool_weight;

        yes_send_back_amount = {
            let remaining = amount * market.available_yes_shares / pool_weight;
            amount - remaining
        };

        no_send_back_amount = {
            let remaining = amount * market.available_no_shares / pool_weight;
            amount - remaining
        };

        rebalance_fees_pool(market, share, liquidity_amount, "add".to_string());
    } else {
        liquidity_amount = amount;
    }

    market.liquidity += liquidity_amount;
    market.increase_volume(amount);
    market.add_shares_to_market(amount);
    share.add_liquidity_shares(market, liquidity_amount)?;

    transfer_outcome_shares_from_pool(market, share, yes_send_back_amount, no_send_back_amount);

    let cpi_context = CpiContext::new(
        system_program.to_account_info(),
        anchor_lang::system_program::Transfer {
            from: authority.to_account_info(),
            to: market.to_account_info(),
        },
    );

    anchor_lang::system_program::transfer(cpi_context, amount)?;

    emit_market_liquidity_price_event(market);

    Ok(())
}
