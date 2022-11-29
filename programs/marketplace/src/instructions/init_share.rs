use crate::errors::MarketError;
use crate::state::{market::MarketState, share::Share};
use crate::Market;
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct InitShare<'info> {
    #[account(init, payer = authority, space = Share::LEN)]
    pub share: Account<'info, Share>,
    #[account(mut)]
    pub market: Account<'info, Market>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn init_share(ctx: Context<InitShare>) -> Result<()> {
    let share: &mut Account<Share> = &mut ctx.accounts.share;
    let market: &mut Account<Market> = &mut ctx.accounts.market;
    let authority: &Signer = &ctx.accounts.authority;

    require!(
        market.state == MarketState::Open,
        MarketError::MarketNotOpen
    );

    require!(!market.is_expired(), MarketError::MarketExpired);

    share.init(market, authority.key())
}
