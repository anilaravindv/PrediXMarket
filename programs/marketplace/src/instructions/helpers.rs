use crate::state::{
    market::{Market, Outcome},
    share::Share,
};
use anchor_lang::prelude::*;

pub fn transfer_outcome_shares_from_pool(
    market: &mut Account<Market>,
    share: &mut Account<Share>,
    yes_shares: u64,
    no_shares: u64,
) {
    if yes_shares > 0 {
        share.yes_shares += yes_shares;
        market.available_yes_shares -= yes_shares;
        market.available_shares -= yes_shares;
    }
    if no_shares > 0 {
        share.no_shares += no_shares;
        market.available_no_shares -= no_shares;
        market.available_shares -= no_shares;
    }
}

pub fn transfer_outcome_shares_to_pool(
    market: &mut Account<Market>,
    share: &mut Account<Share>,
    outcome: Outcome,
    shares: u64,
) {
    if outcome == Outcome::Yes {
        share.yes_shares -= shares;
        market.available_yes_shares += shares;
        market.available_shares += shares;
    } else {
        share.no_shares -= shares;
        market.available_no_shares += shares;
        market.available_shares += shares;
    }
}

pub fn rebalance_fees_pool(
    market: &mut Market,
    share: &mut Share,
    liquidity_shares: u64,
    action: String,
) {
    let pool_weight = liquidity_shares * market.fees_pool_weight / market.liquidity;

    match action.as_str() {
        "add" => {
            market.fees_pool_weight += pool_weight;
            share.claimed_liquidity_fees += pool_weight;
        }
        "remove" => {
            market.fees_pool_weight -= pool_weight;
            share.claimed_liquidity_fees -= pool_weight;
        }
        _ => {}
    }
}
