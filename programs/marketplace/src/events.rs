use crate::state::market::Market;
use crate::Outcome;
use anchor_lang::prelude::*;

#[event]
pub struct MarketCreated {
    #[index]
    pub market: Pubkey,
    #[index]
    pub user: Pubkey,
    #[index]
    pub timestamp: i64,
}

#[event]
pub struct MarketResolved {
    #[index]
    pub market: Pubkey,
    #[index]
    pub user: Pubkey,
    #[index]
    pub timestamp: i64,
}

#[event]
pub struct MarketLiquidity {
    #[index]
    pub market: Pubkey,
    pub liquidity: u64,
    pub liquidity_price: u64,
    #[index]
    pub timestamp: i64,
}

#[event]
pub struct MarketOutcomePrice {
    #[index]
    pub market: Pubkey,
    pub yes_outcome_price: u64,
    pub no_outcome_price: u64,
    #[index]
    pub timestamp: i64,
}

pub fn emit_market_created_event(market: &Account<Market>, user: &Signer) {
    let clock: Clock = Clock::get().unwrap();

    emit!(MarketCreated {
        market: market.key(),
        user: user.key(),
        timestamp: clock.unix_timestamp,
    });
}

pub fn emit_market_resolved_event(market: &Account<Market>, user: &Signer) {
    let clock: Clock = Clock::get().unwrap();

    emit!(MarketResolved {
        market: market.key(),
        user: user.key(),
        timestamp: clock.unix_timestamp,
    });
}

pub fn emit_market_liquidity_price_event(market: &Account<Market>) {
    let liquidity_price = market.get_liquidity_price();
    let clock: Clock = Clock::get().unwrap();

    emit!(MarketLiquidity {
        market: market.key(),
        liquidity: market.liquidity,
        liquidity_price,
        timestamp: clock.unix_timestamp,
    });
}

pub fn emit_market_outcome_price_events(market: &Account<Market>) {
    let clock: Clock = Clock::get().unwrap();

    let yes_outcome_price = market.get_market_outcome_price(Outcome::Yes);
    let no_outcome_price = market.get_market_outcome_price(Outcome::No);

    emit!(MarketOutcomePrice {
        market: market.key(),
        yes_outcome_price,
        no_outcome_price,
        timestamp: clock.unix_timestamp,
    });
}
