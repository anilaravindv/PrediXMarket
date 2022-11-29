use crate::errors::MarketError;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::native_token::LAMPORTS_PER_SOL;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum Outcome {
    Yes,
    No,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum MarketState {
    Open,
    Resolved { outcome: Outcome },
}

#[account]
pub struct Market {
    pub creator: Pubkey,
    pub state: MarketState,
    pub created_at: i64,
    pub expires_at: i64,
    pub name: String,
    pub about: String,
    pub category: String,
    pub image_url: String,
    pub fee_percentage: f64,
    pub fees_pool_weight: u64,
    pub balance: u64,
    pub liquidity: u64,
    pub volume: u64,
    pub available_shares: u64,
    pub available_yes_shares: u64,
    pub available_no_shares: u64,
    pub total_yes_shares: u64,
    pub total_no_shares: u64,
    pub resolution_source: String,
    pub resolver: String,
    pub expected_value: String,
    pub resolution_operator: String,
}

const DISCRIMINATOR_LENGTH: usize = 8;
const PUBLIC_KEY_LENGTH: usize = 32;
const TIMESTAMP_LENGTH: usize = 8;
const ENUM_LENGTH: usize = 1;
const U64_LENGTH: usize = 8;
// Stores the size of the u64
const F64_LENGTH: usize = 8;
// Stores the size of the f64
const MAX_NAME_LENGTH: usize = 200 * 4;
// 200 chars max
const MAX_ABOUT_LENGTH: usize = 300 * 4;
// 300 chars max
const MAX_CATEGORY_LENGTH: usize = 50 * 4;
// 50 chars max
const MAX_IMAGE_URL_LENGTH: usize = 200 * 4;
// 200 chars max
const MAX_RESOLUTION_SOURCE_LENGTH: usize = 250 * 4;
// 250 chars max
const MAX_RESOLVER_LENGTH: usize = 50 * 4;
// 50 chars max
const STRING_LENGTH_PREFIX: usize = 4;
// Stores the size of the string
const MAX_EXPECTED_VALUE_LENGTH: usize = 50 * 4;
// 50 chars max
const MAX_RESOLUTION_OPERATOR_LENGTH: usize = 5 * 4; // 5 chars max

impl Market {
    pub const LEN: usize = DISCRIMINATOR_LENGTH
        + PUBLIC_KEY_LENGTH // Creator
        + ENUM_LENGTH + ENUM_LENGTH // Market state + size of (Outcome)
        + TIMESTAMP_LENGTH // Created at
        + TIMESTAMP_LENGTH // Expires at
        + STRING_LENGTH_PREFIX + MAX_NAME_LENGTH // Name
        + STRING_LENGTH_PREFIX + MAX_ABOUT_LENGTH // About
        + STRING_LENGTH_PREFIX + MAX_CATEGORY_LENGTH // Category
        + STRING_LENGTH_PREFIX + MAX_IMAGE_URL_LENGTH // Image URL
        + F64_LENGTH // Fee percentage
        + U64_LENGTH // Market fees pool weight
        + U64_LENGTH // Balance
        + U64_LENGTH // Liquidity
        + U64_LENGTH // Volume
        + U64_LENGTH // Available shares
        + U64_LENGTH // Available yes shares
        + U64_LENGTH // Available no shares
        + U64_LENGTH // Total yes shares
        + U64_LENGTH // Total no shares
        + STRING_LENGTH_PREFIX + MAX_RESOLUTION_SOURCE_LENGTH // Resolution source
        + STRING_LENGTH_PREFIX + MAX_RESOLVER_LENGTH // Resolver
        + STRING_LENGTH_PREFIX + MAX_EXPECTED_VALUE_LENGTH // Expected value
        + STRING_LENGTH_PREFIX + MAX_RESOLUTION_OPERATOR_LENGTH // Resolution operator
        + U64_LENGTH * 8; // Market fee amount

    pub fn init(
        &mut self,
        creator: &Signer,
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
        require!(name.chars().count() <= 200, MarketError::NameTooLong);
        require!(about.chars().count() <= 300, MarketError::AboutTooLong);
        require!(category.chars().count() <= 50, MarketError::CategoryTooLong);
        require!(
            image_url.chars().count() <= 200,
            MarketError::ImageUrlTooLong
        );
        require!(
            resolution_source.chars().count() <= 250,
            MarketError::ResolutionSourceTooLong
        );
        require!(resolver.chars().count() <= 50, MarketError::ResolverTooLong);
        require!(
            expected_value.chars().count() <= 50,
            MarketError::ExpectedValueTooLong
        );
        require!(
            resolution_operator.chars().count() <= 5,
            MarketError::ResolutionOperatorTooLong
        );

        let clock: Clock = Clock::get().unwrap();

        self.creator = *creator.key;
        self.state = MarketState::Open;
        self.created_at = clock.unix_timestamp;
        self.expires_at = expires_at;
        self.name = name;
        self.about = about;
        self.category = category;
        self.image_url = image_url;
        self.fee_percentage = fee_percentage;
        self.fees_pool_weight = 0;
        self.balance = 0;
        self.liquidity = 0;
        self.volume = 0;
        self.available_shares = 0;
        self.available_yes_shares = 0;
        self.available_no_shares = 0;
        self.total_yes_shares = 0;
        self.total_no_shares = 0;
        self.resolution_source = resolution_source;
        self.resolver = resolver;
        self.expected_value = expected_value;
        self.resolution_operator = resolution_operator;

        Ok(())
    }

    pub fn add_shares_to_market(&mut self, shares: u64) {
        self.available_yes_shares += shares;
        self.total_yes_shares += shares;

        self.available_no_shares += shares;
        self.total_no_shares += shares;

        self.available_shares += shares * 2;

        self.balance += shares;
    }

    pub fn remove_shares_from_market(&mut self, shares: u64) {
        self.available_yes_shares -= shares;
        self.total_yes_shares -= shares;

        self.available_no_shares -= shares;
        self.total_no_shares -= shares;

        self.available_shares -= shares * 2;

        self.balance -= shares;
    }

    pub fn get_liquidity_price(&self) -> u64 {
        match &self.state {
            MarketState::Resolved {
                outcome: resolved_outcome,
            } => {
                // resolved market, price is either 0 or 1
                // final liquidity price = outcome shares / liquidity shares
                let resolved_available_outcome_shares = if *resolved_outcome == Outcome::Yes {
                    self.available_yes_shares
                } else {
                    self.available_no_shares
                };

                ((resolved_available_outcome_shares as f64 / self.liquidity as f64)
                    * LAMPORTS_PER_SOL as f64) as u64
            }
            _ => {
                // liquidity price = # liquidity shares / # outcome shares * # outcomes
                ((self.liquidity as f64 / self.available_shares as f64)
                    * 2.0
                    * LAMPORTS_PER_SOL as f64) as u64
            }
        }
    }

    pub fn get_market_outcome_price(&self, outcome: Outcome) -> u64 {
        match &self.state {
            MarketState::Resolved {
                outcome: resolved_outcome,
            } => {
                if *resolved_outcome == outcome {
                    LAMPORTS_PER_SOL
                } else {
                    0
                }
            }
            _ => {
                let resolved_available_outcome_shares = if outcome == Outcome::Yes {
                    self.available_yes_shares
                } else {
                    self.available_no_shares
                };

                (((self.available_shares - resolved_available_outcome_shares) as f64
                    / self.available_shares as f64)
                    * LAMPORTS_PER_SOL as f64) as u64
            }
        }
    }

    pub fn get_final_outcome(&self) -> Result<Outcome> {
        match &self.state {
            MarketState::Resolved { outcome } => {
                let o = match outcome {
                    Outcome::Yes => Outcome::Yes,
                    Outcome::No => Outcome::No,
                };

                Ok(o)
            }
            _ => Err(MarketError::MarketNotResolved.into()),
        }
    }

    pub fn is_expired(&self) -> bool {
        let clock: Clock = Clock::get().unwrap();
        self.expires_at <= clock.unix_timestamp
    }

    pub fn increase_volume(&mut self, amount: u64) {
        self.volume += amount;
    }
}
