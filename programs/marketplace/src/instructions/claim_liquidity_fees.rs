use crate::errors::ShareError;
use crate::state::{market::Market, share::Share};
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct ClaimLiquidityFees<'info> {
    #[account(mut)]
    pub market: Account<'info, Market>,
    #[account(mut, has_one = authority)]
    pub share: Account<'info, Share>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn claim_liquidity_fees(ctx: Context<ClaimLiquidityFees>) -> Result<()> {
    let market: &mut Account<Market> = &mut ctx.accounts.market;
    let share: &mut Account<Share> = &mut ctx.accounts.share;
    let authority: &Signer = &ctx.accounts.authority;

    require_keys_eq!(
        market.key(),
        share.market.key(),
        ShareError::NotOwnedByMarket
    );

    require!(share.liquidity_shares > 0, ShareError::NoLiquidityShares);

    let claimable_fees = get_user_claimable_fees(market.as_ref(), share.as_ref());

    if claimable_fees > 0 {
        share.claimed_liquidity_fees += claimable_fees;

        **market.to_account_info().try_borrow_mut_lamports()? -= claimable_fees;
        **authority.to_account_info().try_borrow_mut_lamports()? += claimable_fees;
    }

    Ok(())
}

fn get_user_claimable_fees(market: &Market, share: &Share) -> u64 {
    let raw_amount = (market.fees_pool_weight * share.liquidity_shares) / market.liquidity;

    // No fees left to claim
    if share.claimed_liquidity_fees > raw_amount {
        return 0;
    };

    raw_amount - share.claimed_liquidity_fees
}
