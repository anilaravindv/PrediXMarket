use anchor_lang::prelude::*;

#[error_code]
pub enum MarketError {
    #[msg("Forbidden operation")]
    ForbiddenOperation,

    #[msg("Market not open")]
    MarketNotOpen,

    #[msg("Market not resolved")]
    MarketNotResolved,

    #[msg("Market expired")]
    MarketExpired,

    #[msg("The provided market name should be 200 characters long maximum")]
    NameTooLong,

    #[msg("The provided market about text should be 300 characters long maximum")]
    AboutTooLong,

    #[msg("The provided market category should be 50 characters long maximum")]
    CategoryTooLong,

    #[msg("The provided market about text should be 200 characters long maximum")]
    ImageUrlTooLong,

    #[msg("The provided market resolution source should be 250 characters long maximum")]
    ResolutionSourceTooLong,

    #[msg("The provided market resolver should be 50 characters long maximum")]
    ResolverTooLong,

    #[msg("The provided market expected value should be 50 characters long maximum")]
    ExpectedValueTooLong,

    #[msg("The provided market resolution operator should be 5 characters long maximum")]
    ResolutionOperatorTooLong,

    #[msg("Given amount not sufficient for the operation")]
    InsufficientAmount,

    #[msg("The provided market does not have sufficient balance")]
    InsufficientBalance,

    #[msg("Market does not have sufficient available outcome share balance")]
    InsufficientAvailableOutcomeShares,

    #[msg("Minimum buy amount not reached")]
    MinBuyAmountNotReached,

    #[msg("Maximum sell amount exceeded")]
    MaxSellAmountExceeded,

    #[msg("Shares to ell is zero")]
    SharesToSellIsZero,

    #[msg("Ending outcome must have non-zero balances")]
    EndingOutcomeBalanceMustBeNonZero,

    #[msg("Provided resolver does not match with market resolver")]
    MismatchMarketResolver,

    #[msg("Provided pyth account does not match with market pyth price account")]
    MismatchMarketPythPriceAccount,

    #[msg("Invalid market expected value")]
    MismatchMarketExpectedValue,
}

#[error_code]
pub enum ShareError {
    #[msg("The authority does not own the share")]
    NotOwnedByAuthority,

    #[msg("The market does not own the share")]
    NotOwnedByMarket,

    #[msg("The user does not have sufficient liquidity shares")]
    InsufficientLiquidityShares,

    #[msg("The user does not have sufficient outcome shares")]
    InsufficientOutcomeShares,

    #[msg("The user does not hold liquidity shares")]
    NoLiquidityShares,

    #[msg("The user already claimed winnings")]
    AlreadyClaimedLiquidityWinnings,

    #[msg("The user does not hold resolved outcome shares")]
    NoResolvedOutcomeShares,

    #[msg("The user already claimed resolved outcome winnings")]
    AlreadyClaimedOutcomeWinnings,
}
