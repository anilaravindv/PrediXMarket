use crate::errors::MarketError;
use crate::state::market::MarketState;
use crate::Market;
use anchor_lang::prelude::*;

#[account]
pub struct Share {
    pub market: Pubkey,
    pub authority: Pubkey,

    pub liquidity_claimed: bool,
    pub yes_shares_claimed: bool,
    pub no_shares_claimed: bool,

    pub liquidity_shares: u64,
    pub claimed_liquidity_fees: u64,
    pub yes_shares: u64,
    pub no_shares: u64,
}

const DISCRIMINATOR_LENGTH: usize = 8;
const PUBLIC_KEY_LENGTH: usize = 32;
const U64_LENGTH: usize = 8;
const BOOL_LENGTH: usize = 1;

impl Share {
    pub const LEN: usize = DISCRIMINATOR_LENGTH
        + PUBLIC_KEY_LENGTH // Market
        + PUBLIC_KEY_LENGTH // Authority
        + BOOL_LENGTH // Liquidity claimed
        + BOOL_LENGTH // Yes shares claimed
        + BOOL_LENGTH // No shares claimed
        + U64_LENGTH // Liquidity shares
        + U64_LENGTH // Claimed liquidity fees
        + U64_LENGTH // Yes shares
        + U64_LENGTH; // No shares

    pub fn init(&mut self, market: &mut Account<Market>, authority_pub_key: Pubkey) -> Result<()> {
        require!(
            market.state == MarketState::Open,
            MarketError::MarketNotOpen
        );

        self.market = market.key();
        self.authority = authority_pub_key;

        self.liquidity_claimed = false;
        self.yes_shares_claimed = false;
        self.no_shares_claimed = false;

        self.liquidity_shares = 0;
        self.claimed_liquidity_fees = 0;
        self.yes_shares = 0;
        self.no_shares = 0;

        Ok(())
    }

    pub fn add_liquidity_shares(&mut self, market: &Market, shares: u64) -> Result<()> {
        require!(
            market.state == MarketState::Open,
            MarketError::MarketNotOpen
        );

        self.liquidity_shares += shares;

        Ok(())
    }

    pub fn remove_liquidity_shares(&mut self, market: &Market, shares: u64) -> Result<()> {
        require!(
            market.state == MarketState::Open,
            MarketError::MarketNotOpen
        );

        self.liquidity_shares -= shares;

        Ok(())
    }
}
