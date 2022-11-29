use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct CheckUserIsAdmin {}

pub fn is_admin(_ctx: Context<CheckUserIsAdmin>, user_pub_key: String) -> Result<bool> {
    let an_admin = crate::auth::is_admin(user_pub_key.as_str());
    Ok(an_admin)
}
