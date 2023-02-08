use crate::errors::{MarketError, ShareError};
use crate::events::emit_market_liquidity_price_event;
use crate::instructions::helpers::{rebalance_fees_pool, transfer_outcome_shares_from_pool};
use crate::state::{
    market::{Market, MarketState},
    share::Share,
};
use anchor_lang::prelude::*;
use std::cmp::min;

#[derive(Accounts)]
pub struct RemoveLiquidityShares<'info> {
    #[account(mut, has_one = authority @ ShareError::NotOwnedByAuthority, has_one = market @ ShareError::NotOwnedByMarket)]
    pub share: Account<'info, Share>,
    #[account(mut)]
    pub market: Account<'info, Market>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn remove_liquidity(ctx: Context<RemoveLiquidityShares>, amount: u64) -> Result<()> {
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

    let shares = amount;
    require!(
        share.liquidity_shares >= shares,
        ShareError::InsufficientLiquidityShares
    );

    rebalance_fees_pool(market, share, shares, "remove".to_string());

    let min_available_outcome_shares = min(market.available_yes_shares, market.available_no_shares);
    let pool_weight = min(u64::MAX, min_available_outcome_shares);

    let liquidity_amount = shares * pool_weight / market.liquidity;

    let yes_send_amounts = {
        let a = (shares as u128 * market.available_yes_shares as u128 / market.liquidity as u128)
            as u64;
        a - liquidity_amount
    };

    let no_send_amounts = {
        let a =
            (shares as u128 * market.available_no_shares as u128 / market.liquidity as u128) as u64;
        a - liquidity_amount
    };

    market.remove_shares_from_market(liquidity_amount);
    market.liquidity -= shares;

    share.remove_liquidity_shares(market, shares)?;

    transfer_outcome_shares_from_pool(market, share, yes_send_amounts, no_send_amounts);

    **market.to_account_info().try_borrow_mut_lamports()? -= liquidity_amount;
    **authority.to_account_info().try_borrow_mut_lamports()? += liquidity_amount;

    emit_market_liquidity_price_event(market);

    Ok(())
}
