use crate::auth::check_is_admin;
use crate::errors::MarketError;
use crate::events::{
    emit_market_liquidity_price_event, emit_market_outcome_price_events, emit_market_resolved_event,
};
use crate::state::market::{Market, MarketState, Outcome};
use anchor_lang::prelude::*;
use pyth_sdk_solana::Price;
use pyth_sdk_solana::{load_price_feed_from_account_info, PriceFeed};
use std::str::FromStr;

#[derive(Accounts)]
pub struct CloseMarketWithPyth<'info> {
    #[account(mut)]
    pub market: Account<'info, Market>,
    #[account()]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
    /// CHECK: price_account
    pub price_account: AccountInfo<'info>,
}

#[access_control(check_is_admin(&ctx.accounts.user.key))]
pub fn close_market_with_pyth(ctx: Context<CloseMarketWithPyth>) -> Result<()> {
    let market: &mut Account<Market> = &mut ctx.accounts.market;
    let user: &Signer = &ctx.accounts.user;
    let price_account_info = &ctx.accounts.price_account;

    require!(
        market.state == MarketState::Open,
        MarketError::MarketNotOpen
    );

    require!(
        market.resolver == "pyth",
        MarketError::MismatchMarketResolver
    );

    let res_src = Pubkey::from_str(market.resolution_source.as_str());
    let valid_res_src = res_src.is_ok();

    require!(valid_res_src, MarketError::MismatchMarketPythPriceAccount);

    let res_src = res_src.unwrap();
    require_keys_eq!(
        res_src,
        price_account_info.key(),
        MarketError::MismatchMarketPythPriceAccount
    );

    let price_feed: PriceFeed = load_price_feed_from_account_info(price_account_info).unwrap();
    let current_price: Price = price_feed.get_current_price().unwrap();

    let res_value = market.expected_value.parse();
    require!(res_value.is_ok(), MarketError::MismatchMarketExpectedValue);

    let res_value: f64 = res_value.unwrap();

    let lower = 10_f64.powi(-8) * (current_price.price - current_price.conf as i64) as f64;
    let upper = 10_f64.powi(-8) * (current_price.price + current_price.conf as i64) as f64;

    let mut final_outcome = Outcome::No;
    if market.resolution_operator.eq("eq") {
        if res_value >= lower && res_value <= upper {
            final_outcome = Outcome::Yes;
        }
    } else if market.resolution_operator.eq("lt") {
        if res_value > upper {
            final_outcome = Outcome::Yes;
        }
    } else if market.resolution_operator.eq("gt") {
        if res_value < lower {
            final_outcome = Outcome::Yes;
        }
    }

    market.state = MarketState::Resolved {
        outcome: final_outcome,
    };

    emit_market_resolved_event(market, user);
    emit_market_liquidity_price_event(market);
    emit_market_outcome_price_events(market);

    Ok(())
}

#[derive(Accounts)]
pub struct CloseMarketWithAnswer<'info> {
    #[account(mut)]
    pub market: Account<'info, Market>,
    #[account()]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[access_control(check_is_admin(&ctx.accounts.user.key))]
pub fn close_market_with_answer(
    ctx: Context<CloseMarketWithAnswer>,
    outcome: Outcome,
) -> Result<()> {
    let market: &mut Account<Market> = &mut ctx.accounts.market;
    let user: &Signer = &ctx.accounts.user;

    require!(
        market.state == MarketState::Open,
        MarketError::MarketNotOpen
    );

    market.state = MarketState::Resolved { outcome };

    emit_market_resolved_event(market, user);
    emit_market_liquidity_price_event(market);
    emit_market_outcome_price_events(market);

    Ok(())
}
