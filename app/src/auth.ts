const ADMINS = [
    "DzduU1Fy3wxw1XTsg2wjqhZXxRszMJr1pYJZsXzXwq6s",
    "48pFpG2grc2Vco7XuBNqoDPG4GK9XC4bePUJofBUNB5B",
    "DVSPhh5rKWibgjzDF8Pc9mpy4jNzaDSNtcpvUEeRyAJ1",
    "55tDezFWrx1eviChHJjSRX8Wrm69GxHVZ32UtrY1mQFV",
    "HiP614ECwBmNaLFJuaa7YWD2mciLaePnQci2Pkg5AAGr"
];

export function isAdmin(userPublicKey: string): boolean {
    return ADMINS.includes(userPublicKey)
}