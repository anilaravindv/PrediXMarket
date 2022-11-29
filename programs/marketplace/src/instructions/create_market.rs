use crate::auth::check_is_admin;
use crate::events::{
    emit_market_created_event, emit_market_liquidity_price_event, emit_market_outcome_price_events,
};
use crate::state::market::Market;
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct CreateMarket<'info> {
    #[account(init, payer = creator, space = Market::LEN)]
    pub market: Account<'info, Market>,
    #[account(mut)]
    pub creator: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[access_control(check_is_admin(&ctx.accounts.creator.key))]
pub fn create_market(
    ctx: Context<CreateMarket>,
    name: String,
    about: String,
    category: String,
    image_url: String,
    fee_percentage: f64,
    resolution_source: String,
    resolver: String,
    expires_at: i64,
    expected_value: String,
    resolution_operator: String,
) -> Result<()> {
    let market: &mut Account<Market> = &mut ctx.accounts.market;
    let creator: &Signer = &ctx.accounts.creator;

    market.init(
        creator,
        name,
        about,
        category,
        image_url,
        fee_percentage,
        resolution_source,
        resolver,
        expires_at,
        expected_value,
        resolution_operator,
    )?;

    emit_market_created_event(market, creator);
    emit_market_liquidity_price_event(market);
    emit_market_outcome_price_events(market);

    Ok(())
}
