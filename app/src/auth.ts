const ADMINS = [
    "48pFpG2grc2Vco7XuBNqoDPG4GK9XC4bePUJofBUNB5B",
    "DzduU1Fy3wxw1XTsg2wjqhZXxRszMJr1pYJZsXzXwq6s",
    "EUnBEbVjrJbvcEzS51ak5RBHBJ45TRHX4pmH8jPmSXcB"
];

export function isAdmin(userPublicKey: string): boolean {
    return ADMINS.includes(userPublicKey)
}