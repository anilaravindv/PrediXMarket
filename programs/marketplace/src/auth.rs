use crate::errors::MarketError;
use anchor_lang::prelude::*;

const ADMINS: [&str; 2] = [
    "DzduU1Fy3wxw1XTsg2wjqhZXxRszMJr1pYJZsXzXwq6s",
    "48pFpG2grc2Vco7XuBNqoDPG4GK9XC4bePUJofBUNB5B",
];

pub fn is_admin(user: &str) -> bool {
    ADMINS.iter().any(|v| v == &user)
}

pub fn check_is_admin(user: &Pubkey) -> Result<()> {
    let pubkey = user.to_string();
    let is_admin = is_admin(pubkey.as_str());

    if is_admin {
        Ok(())
    } else {
        err!(MarketError::ForbiddenOperation)
    }
}
