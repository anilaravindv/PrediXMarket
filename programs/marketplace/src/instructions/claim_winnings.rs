use crate::errors::{MarketError, ShareError};
use crate::state::market::MarketState;
use crate::state::{
    market::{Market, Outcome},
    share::Share,
};
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct ClaimWinnings<'info> {
    #[account(mut)]
    pub market: Account<'info, Market>,
    #[account(mut, has_one = authority)]
    pub share: Account<'info, Share>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn claim_winnings(ctx: Context<ClaimWinnings>) -> Result<()> {
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

    let resolved_outcome = market.get_final_outcome()?;

    let resolved_outcome_shares = if resolved_outcome == Outcome::Yes {
        share.yes_shares
    } else {
        share.no_shares
    };

    require!(
        resolved_outcome_shares > 0,
        ShareError::NoResolvedOutcomeShares
    );

    let is_claimed = if resolved_outcome == Outcome::Yes {
        share.yes_shares_claimed
    } else {
        share.no_shares_claimed
    };

    require!(!is_claimed, ShareError::AlreadyClaimedOutcomeWinnings);

    // 1 share => price = 1
    let winnings = resolved_outcome_shares;

    require!(market.balance >= winnings, MarketError::InsufficientBalance);

    market.balance -= winnings;

    if resolved_outcome == Outcome::Yes {
        share.yes_shares_claimed = true;
    } else {
        share.no_shares_claimed = true;
    };

    **market.to_account_info().try_borrow_mut_lamports()? -= winnings;
    **authority.to_account_info().try_borrow_mut_lamports()? += winnings;

    Ok(())
}
