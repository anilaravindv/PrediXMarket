use crate::errors::{MarketError, ShareError};
use crate::state::market::{Market, MarketState};
use crate::state::share::Share;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::native_token::LAMPORTS_PER_SOL;

#[derive(Accounts)]
pub struct ClaimLiquidity<'info> {
    #[account(mut)]
    pub market: Account<'info, Market>,
    #[account(mut, has_one = authority)]
    pub share: Account<'info, Share>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn claim_liquidity(ctx: Context<ClaimLiquidity>) -> Result<()> {
    let market: &mut Account<Market> = &mut ctx.accounts.market;
    let share: &mut Account<Share> = &mut ctx.accounts.share;
    let authority: &Signer = &ctx.accounts.authority;

    require!(
        matches!(market.state, MarketState::Resolved { outcome: _ }),
        MarketError::MarketNotResolved
    );

    require_keys_eq!(
        market.key(),
        share.market.key(),
        ShareError::NotOwnedByMarket
    );

    require!(share.liquidity_shares > 0, ShareError::NoLiquidityShares);

    require!(
        !share.liquidity_claimed,
        ShareError::AlreadyClaimedLiquidityWinnings
    );

    // winnings = total resolved outcome pool shares * pool share (%)
    let liquidity_price = market.get_liquidity_price();
    let winnings =
        (liquidity_price as f64 * (share.liquidity_shares as f64 / LAMPORTS_PER_SOL as f64)) as u64;

    require!(market.balance >= winnings, MarketError::InsufficientBalance);

    market.balance -= winnings;
    share.liquidity_claimed = true;

    **market.to_account_info().try_borrow_mut_lamports()? -= winnings;
    **authority.to_account_info().try_borrow_mut_lamports()? += winnings;

    Ok(())
}
