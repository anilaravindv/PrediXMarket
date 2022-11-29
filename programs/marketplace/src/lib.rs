use crate::instructions::{
    add_liquidity::*, buy_outcome_shares::*, claim_liquidity::*, claim_liquidity_fees::*,
    claim_winnings::*, close_market::*, create_market::*, init_share::*, is_admin::*,
    remove_liquidity::*, sell_outcome_shares::*,
};
use crate::state::market::{Market, Outcome};
use anchor_lang::prelude::*;

pub mod auth;
pub mod errors;
pub mod events;
pub mod instructions;
pub mod state;

declare_id!("6q8b3wNNYLTfaLdSdfiBhZqJsokxg6ovXLkcesmHddnw");

#[program]
pub mod marketplace {
    use super::*;

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
        instructions::create_market(
            ctx,
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
        )
    }

    pub fn init_share(ctx: Context<InitShare>) -> Result<()> {
        instructions::init_share(ctx)
    }

    pub fn add_liquidity(ctx: Context<AddLiquidityShares>, amount: u64) -> Result<()> {
        instructions::add_liquidity(ctx, amount)
    }

    pub fn remove_liquidity(ctx: Context<RemoveLiquidityShares>, amount: u64) -> Result<()> {
        instructions::remove_liquidity(ctx, amount)
    }

    pub fn buy_outcome_shares(
        ctx: Context<BuyOutcomeShares>,
        outcome: Outcome,
        amount: u64,
        min_outcome_shares_to_buy: u64,
    ) -> Result<()> {
        instructions::buy_outcome_shares(ctx, outcome, amount, min_outcome_shares_to_buy)
    }

    pub fn sell_outcome_shares(
        ctx: Context<SellOutcomeShares>,
        outcome: Outcome,
        amount: u64,
        max_outcome_shares_to_sell: u64,
    ) -> Result<()> {
        instructions::sell_outcome_shares(ctx, outcome, amount, max_outcome_shares_to_sell)
    }

    pub fn close_market_with_pyth(ctx: Context<CloseMarketWithPyth>) -> Result<()> {
        instructions::close_market_with_pyth(ctx)
    }

    pub fn close_market_with_answer(
        ctx: Context<CloseMarketWithAnswer>,
        outcome: Outcome,
    ) -> Result<()> {
        instructions::close_market_with_answer(ctx, outcome)
    }

    pub fn claim_winnings(ctx: Context<ClaimWinnings>) -> Result<()> {
        instructions::claim_winnings(ctx)
    }

    pub fn claim_liquidity(ctx: Context<ClaimLiquidity>) -> Result<()> {
        instructions::claim_liquidity(ctx)
    }

    pub fn claim_liquidity_fees(ctx: Context<ClaimLiquidityFees>) -> Result<()> {
        instructions::claim_liquidity_fees(ctx)
    }

    pub fn is_admin(ctx: Context<CheckUserIsAdmin>, user_pub_key: String) -> Result<bool> {
        instructions::is_admin(ctx, user_pub_key)
    }
}
