import * as anchor from "@project-serum/anchor";
import {Program} from "@project-serum/anchor";
import {Marketplace} from "../target/types/marketplace";
import {expect} from "chai";
import {LAMPORTS_PER_SOL} from "@solana/web3.js";
import {BN} from "bn.js";
import {DateTime, Interval} from "luxon";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

describe("marketplace", () => {
    // Configure the client to use the local cluster.
    anchor.setProvider(anchor.AnchorProvider.env());

    const program = anchor.workspace.Marketplace as Program<Marketplace>;
    const programProvider = program.provider as anchor.AnchorProvider;

    let market1Keypair;
    let share1Keypair;

    context('Marketplace admin ops', async () => {

        it('should check whether user is admin', async () => {
            const user = programProvider.wallet;

            const isAdmin = await program.methods
                .isAdmin(user.publicKey.toBase58())
                .view();

            expect(isAdmin).to.be.true;
        });

        it('should detect non admin user', async () => {
            const user = anchor.web3.Keypair.generate();

            let isAdmin = await program.methods
                .isAdmin(user.publicKey.toBase58())
                .view();

            expect(isAdmin).to.be.false;
        });

    });

    context('Market Creation', async () => {
        it('should create a market', async () => {
            market1Keypair = anchor.web3.Keypair.generate();
            const creator = programProvider.wallet;

            const expiresAt = DateTime.now().plus({days: 1});

            await program.methods
                .createMarket(
                    "market 1",
                    "about the market",
                    "market category",
                    "https://picsum.photos/id/1002/200/300.jpg",
                    0.0,
                    "resolution source",
                    "resolver",
                    new BN(expiresAt.toUnixInteger()),
                    "expected",
                    "=")
                .accounts({
                    creator: creator.publicKey,
                    market: market1Keypair.publicKey,
                })
                .signers([market1Keypair])
                .rpc();

            let marketState = await program.account.market.fetch(market1Keypair.publicKey);

            expect(marketState.creator.toBase58()).to.equal(creator.publicKey.toBase58())
            expect(marketState.state).to.eql({open: {}});

            let createdAround = Interval.fromDateTimes(DateTime.now().minus({minutes: 3}), DateTime.now());
            let createdAt = DateTime.fromSeconds(marketState.createdAt.toNumber());
            expect(createdAround.contains(createdAt)).to.be.true;

            expect(marketState.expiresAt.toNumber()).to.equal(expiresAt.toUnixInteger());
            expect(marketState.name).to.equal("market 1");
            expect(marketState.about).to.equal("about the market");
            expect(marketState.category).to.equal("market category");
            expect(marketState.imageUrl).to.equal("https://picsum.photos/id/1002/200/300.jpg");
            expect(marketState.resolutionSource).to.equal("resolution source");
            expect(marketState.resolver).to.equal("resolver");
            expect(marketState.expectedValue).to.equal("expected");
            expect(marketState.resolutionOperator).to.equal("=");
            expect(marketState.feePercentage).to.equal(0.0);
            expect(marketState.feesPoolWeight.toNumber()).to.equal(new BN(0).toNumber());
            expect(marketState.balance.toNumber()).to.equal(new BN(0).toNumber());
            expect(marketState.liquidity.toNumber()).to.equal(new BN(0).toNumber());
            expect(marketState.volume.toNumber()).to.equal(new BN(0).toNumber());
            expect(marketState.availableShares.toNumber()).to.equal(new BN(0).toNumber());
            expect(marketState.availableYesShares.toNumber()).to.equal(new BN(0).toNumber());
            expect(marketState.totalYesShares.toNumber()).to.equal(new BN(0).toNumber());
            expect(marketState.availableNoShares.toNumber()).to.equal(new BN(0).toNumber());
            expect(marketState.totalNoShares.toNumber()).to.equal(new BN(0).toNumber());
        });

        it('should init share for user', async () => {
            share1Keypair = anchor.web3.Keypair.generate();
            const user = programProvider.wallet;

            await program.methods
                .initShare()
                .accounts({
                    share: share1Keypair.publicKey,
                    market: market1Keypair.publicKey,
                    authority: user.publicKey,
                })
                .signers([share1Keypair])
                .rpc();

            let shareState = await program.account.share.fetch(share1Keypair.publicKey);
            expect(shareState.market.toBase58()).to.equal(market1Keypair.publicKey.toBase58());
            expect(shareState.authority.toBase58()).to.equal(user.publicKey.toBase58());
            expect(shareState.liquidityClaimed).to.be.false;
            expect(shareState.yesSharesClaimed).to.be.false;
            expect(shareState.noSharesClaimed).to.be.false;
            expect(shareState.liquidityShares.toNumber()).to.equal(0);
            expect(shareState.claimedLiquidityFees.toNumber()).to.equal(new BN(0).toNumber());
            expect(shareState.yesShares.toNumber()).to.equal(0);
            expect(shareState.noShares.toNumber()).to.equal(0);
        });

        it('should add liquidity for newly created market', async () => {
            const user = programProvider.wallet;

            await program.methods
                .addLiquidity(new BN(0.01 * LAMPORTS_PER_SOL))
                .accounts({
                    authority: user.publicKey,
                    share: share1Keypair.publicKey,
                    market: market1Keypair.publicKey,
                })
                .signers([])
                .rpc();

            let marketState = await program.account.market.fetch(market1Keypair.publicKey);
            expect(marketState.feesPoolWeight.toNumber()).to.equal(new BN(0).toNumber());
            expect(marketState.balance.toNumber()).to.equal(new BN(0.01 * LAMPORTS_PER_SOL).toNumber());
            expect(marketState.liquidity.toNumber()).to.equal(new BN(0.01 * LAMPORTS_PER_SOL).toNumber());
            expect(marketState.volume.toNumber()).to.equal(new BN(0.01 * LAMPORTS_PER_SOL).toNumber());
            expect(marketState.availableShares.toNumber()).to.equal(new BN(0.02 * LAMPORTS_PER_SOL).toNumber());
            expect(marketState.availableYesShares.toNumber()).to.equal(new BN(0.01 * LAMPORTS_PER_SOL).toNumber());
            expect(marketState.totalYesShares.toNumber()).to.equal(new BN(0.01 * LAMPORTS_PER_SOL).toNumber());
            expect(marketState.availableNoShares.toNumber()).to.equal(new BN(0.01 * LAMPORTS_PER_SOL).toNumber());
            expect(marketState.totalNoShares.toNumber()).to.equal(new BN(0.01 * LAMPORTS_PER_SOL).toNumber());

            let shareState = await program.account.share.fetch(share1Keypair.publicKey);
            expect(shareState.market.toBase58()).to.equal(market1Keypair.publicKey.toBase58());
            expect(shareState.authority.toBase58()).to.equal(user.publicKey.toBase58());
            expect(shareState.liquidityClaimed).to.be.false;
            expect(shareState.yesSharesClaimed).to.be.false;
            expect(shareState.noSharesClaimed).to.be.false;
            expect(shareState.liquidityShares.toNumber()).to.equal(new BN(0.01 * LAMPORTS_PER_SOL).toNumber());
            expect(shareState.claimedLiquidityFees.toNumber()).to.equal(new BN(0).toNumber());
            expect(shareState.yesShares.toNumber()).to.equal(0);
            expect(shareState.noShares.toNumber()).to.equal(0);
        });

    });

    context('Market Interaction - Balanced Market (Same Outcome Odds)', async () => {
        it('should wait to avoid "This transaction has already been processed" error', async () => {
            await sleep(500);
        });

        it('should add liquidity without changing shares balance', async () => {
            const user = programProvider.wallet;

            await program.methods
                .addLiquidity(new BN(0.01 * LAMPORTS_PER_SOL))
                .accounts({
                    authority: user.publicKey,
                    share: share1Keypair.publicKey,
                    market: market1Keypair.publicKey,
                })
                .signers([])
                .rpc();

            let marketState = await program.account.market.fetch(market1Keypair.publicKey);
            expect(marketState.feesPoolWeight.toNumber()).to.equal(new BN(0).toNumber());
            expect(marketState.balance.toNumber()).to.equal(new BN(0.02 * LAMPORTS_PER_SOL).toNumber());
            expect(marketState.liquidity.toNumber()).to.equal(new BN(0.02 * LAMPORTS_PER_SOL).toNumber());
            expect(marketState.volume.toNumber()).to.equal(new BN(0.02 * LAMPORTS_PER_SOL).toNumber());
            expect(marketState.availableShares.toNumber()).to.equal(new BN(0.04 * LAMPORTS_PER_SOL).toNumber());
            expect(marketState.availableYesShares.toNumber()).to.equal(new BN(0.02 * LAMPORTS_PER_SOL).toNumber());
            expect(marketState.totalYesShares.toNumber()).to.equal(new BN(0.02 * LAMPORTS_PER_SOL).toNumber());
            expect(marketState.availableNoShares.toNumber()).to.equal(new BN(0.02 * LAMPORTS_PER_SOL).toNumber());
            expect(marketState.totalNoShares.toNumber()).to.equal(new BN(0.02 * LAMPORTS_PER_SOL).toNumber());

            let shareState = await program.account.share.fetch(share1Keypair.publicKey);
            expect(shareState.market.toBase58()).to.equal(market1Keypair.publicKey.toBase58());
            expect(shareState.authority.toBase58()).to.equal(user.publicKey.toBase58());
            expect(shareState.liquidityClaimed).to.be.false;
            expect(shareState.yesSharesClaimed).to.be.false;
            expect(shareState.noSharesClaimed).to.be.false;
            expect(shareState.liquidityShares.toNumber()).to.equal(new BN(0.02 * LAMPORTS_PER_SOL).toNumber());
            expect(shareState.claimedLiquidityFees.toNumber()).to.equal(new BN(0).toNumber());
            expect(shareState.yesShares.toNumber()).to.equal(0);
            expect(shareState.noShares.toNumber()).to.equal(0);
        });

        it('should remove liquidity without changing shares balance', async () => {
            const user = programProvider.wallet;

            await program.methods
                .removeLiquidity(new BN(0.01 * LAMPORTS_PER_SOL))
                .accounts({
                    authority: user.publicKey,
                    share: share1Keypair.publicKey,
                    market: market1Keypair.publicKey,
                })
                .signers([])
                .rpc();

            let marketState = await program.account.market.fetch(market1Keypair.publicKey);
            expect(marketState.feesPoolWeight.toNumber()).to.equal(new BN(0).toNumber());
            expect(marketState.balance.toNumber()).to.equal(new BN(0.01 * LAMPORTS_PER_SOL).toNumber());
            expect(marketState.liquidity.toNumber()).to.equal(new BN(0.01 * LAMPORTS_PER_SOL).toNumber());
            expect(marketState.volume.toNumber()).to.equal(new BN(0.02 * LAMPORTS_PER_SOL).toNumber());
            expect(marketState.availableShares.toNumber()).to.equal(new BN(0.02 * LAMPORTS_PER_SOL).toNumber());
            expect(marketState.availableYesShares.toNumber()).to.equal(new BN(0.01 * LAMPORTS_PER_SOL).toNumber());
            expect(marketState.totalYesShares.toNumber()).to.equal(new BN(0.01 * LAMPORTS_PER_SOL).toNumber());
            expect(marketState.availableNoShares.toNumber()).to.equal(new BN(0.01 * LAMPORTS_PER_SOL).toNumber());
            expect(marketState.totalNoShares.toNumber()).to.equal(new BN(0.01 * LAMPORTS_PER_SOL).toNumber());

            let shareState = await program.account.share.fetch(share1Keypair.publicKey);
            expect(shareState.market.toBase58()).to.equal(market1Keypair.publicKey.toBase58());
            expect(shareState.authority.toBase58()).to.equal(user.publicKey.toBase58());
            expect(shareState.liquidityClaimed).to.be.false;
            expect(shareState.yesSharesClaimed).to.be.false;
            expect(shareState.noSharesClaimed).to.be.false;
            expect(shareState.liquidityShares.toNumber()).to.equal(new BN(0.01 * LAMPORTS_PER_SOL).toNumber());
            expect(shareState.claimedLiquidityFees.toNumber()).to.equal(new BN(0).toNumber());
            expect(shareState.yesShares.toNumber()).to.equal(0);
            expect(shareState.noShares.toNumber()).to.equal(0);
        });
    });

    context('Market Interaction - Unbalanced Market (Different Outcome Odds)', async () => {
        it('should buy yes outcome shares', async () => {
            const user = programProvider.wallet;

            await program.methods
                .buyOutcomeShares({yes: {}}, new BN(0.01 * LAMPORTS_PER_SOL), new BN(0.015 * LAMPORTS_PER_SOL))
                .accounts({
                    authority: user.publicKey,
                    share: share1Keypair.publicKey,
                    market: market1Keypair.publicKey,
                })
                .signers([])
                .rpc();

            let marketState = await program.account.market.fetch(market1Keypair.publicKey);
            expect(marketState.feesPoolWeight.toNumber()).to.equal(new BN(0).toNumber());
            expect(marketState.balance.toNumber()).to.equal(new BN(0.02 * LAMPORTS_PER_SOL).toNumber());
            expect(marketState.liquidity.toNumber()).to.equal(new BN(0.01 * LAMPORTS_PER_SOL).toNumber());
            expect(marketState.volume.toNumber()).to.equal(new BN(0.03 * LAMPORTS_PER_SOL).toNumber());
            expect(marketState.availableShares.toNumber()).to.equal(new BN(0.025 * LAMPORTS_PER_SOL).toNumber());
            expect(marketState.availableYesShares.toNumber()).to.equal(new BN(0.005 * LAMPORTS_PER_SOL).toNumber());
            expect(marketState.totalYesShares.toNumber()).to.equal(new BN(0.02 * LAMPORTS_PER_SOL).toNumber());
            expect(marketState.availableNoShares.toNumber()).to.equal(new BN(0.02 * LAMPORTS_PER_SOL).toNumber());
            expect(marketState.totalNoShares.toNumber()).to.equal(new BN(0.02 * LAMPORTS_PER_SOL).toNumber());

            let shareState = await program.account.share.fetch(share1Keypair.publicKey);
            expect(shareState.market.toBase58()).to.equal(market1Keypair.publicKey.toBase58());
            expect(shareState.authority.toBase58()).to.equal(user.publicKey.toBase58());
            expect(shareState.liquidityClaimed).to.be.false;
            expect(shareState.yesSharesClaimed).to.be.false;
            expect(shareState.noSharesClaimed).to.be.false;
            expect(shareState.liquidityShares.toNumber()).to.equal(new BN(0.01 * LAMPORTS_PER_SOL).toNumber());
            expect(shareState.claimedLiquidityFees.toNumber()).to.equal(new BN(0).toNumber());
            expect(shareState.yesShares.toNumber()).to.equal(new BN(0.015 * LAMPORTS_PER_SOL).toNumber());
            expect(shareState.noShares.toNumber()).to.equal(0);
        });

        it('should add liquidity', async () => {
            const user = programProvider.wallet;

            await program.methods
                .addLiquidity(new BN(0.01 * LAMPORTS_PER_SOL))
                .accounts({
                    authority: user.publicKey,
                    share: share1Keypair.publicKey,
                    market: market1Keypair.publicKey,
                })
                .signers([])
                .rpc();

            let marketState = await program.account.market.fetch(market1Keypair.publicKey);
            expect(marketState.feesPoolWeight.toNumber()).to.equal(new BN(0).toNumber());
            expect(marketState.balance.toNumber()).to.equal(new BN(0.03 * LAMPORTS_PER_SOL).toNumber());
            expect(marketState.liquidity.toNumber()).to.equal(new BN(0.015 * LAMPORTS_PER_SOL).toNumber());
            expect(marketState.volume.toNumber()).to.equal(new BN(0.04 * LAMPORTS_PER_SOL).toNumber());
            expect(marketState.availableShares.toNumber()).to.equal(new BN(0.0375 * LAMPORTS_PER_SOL).toNumber());
            expect(marketState.availableYesShares.toNumber()).to.equal(new BN(0.0075 * LAMPORTS_PER_SOL).toNumber());
            expect(marketState.totalYesShares.toNumber()).to.equal(new BN(0.03 * LAMPORTS_PER_SOL).toNumber());
            expect(marketState.availableNoShares.toNumber()).to.equal(new BN(0.03 * LAMPORTS_PER_SOL).toNumber());
            expect(marketState.totalNoShares.toNumber()).to.equal(new BN(0.03 * LAMPORTS_PER_SOL).toNumber());

            let shareState = await program.account.share.fetch(share1Keypair.publicKey);
            expect(shareState.market.toBase58()).to.equal(market1Keypair.publicKey.toBase58());
            expect(shareState.authority.toBase58()).to.equal(user.publicKey.toBase58());
            expect(shareState.liquidityClaimed).to.be.false;
            expect(shareState.yesSharesClaimed).to.be.false;
            expect(shareState.noSharesClaimed).to.be.false;
            expect(shareState.liquidityShares.toNumber()).to.equal(new BN(0.015 * LAMPORTS_PER_SOL).toNumber());
            expect(shareState.claimedLiquidityFees.toNumber()).to.equal(new BN(0).toNumber());
            expect(shareState.yesShares.toNumber()).to.equal(new BN(0.0225 * LAMPORTS_PER_SOL).toNumber());
            expect(shareState.noShares.toNumber()).to.equal(0);
        });

        it('should remove liquidity', async () => {
            const user = programProvider.wallet;

            await program.methods
                .removeLiquidity(new BN(0.005 * LAMPORTS_PER_SOL))
                .accounts({
                    authority: user.publicKey,
                    share: share1Keypair.publicKey,
                    market: market1Keypair.publicKey,
                })
                .signers([])
                .rpc();

            let marketState = await program.account.market.fetch(market1Keypair.publicKey);
            expect(marketState.feesPoolWeight.toNumber()).to.equal(new BN(0).toNumber());
            expect(marketState.balance.toNumber()).to.equal(new BN(0.0275 * LAMPORTS_PER_SOL).toNumber());
            expect(marketState.liquidity.toNumber()).to.equal(new BN(0.01 * LAMPORTS_PER_SOL).toNumber());
            expect(marketState.volume.toNumber()).to.equal(new BN(0.04 * LAMPORTS_PER_SOL).toNumber());
            expect(marketState.availableShares.toNumber()).to.equal(new BN(0.025 * LAMPORTS_PER_SOL).toNumber());
            expect(marketState.availableYesShares.toNumber()).to.equal(new BN(0.005 * LAMPORTS_PER_SOL).toNumber());
            expect(marketState.totalYesShares.toNumber()).to.equal(new BN(0.0275 * LAMPORTS_PER_SOL).toNumber());
            expect(marketState.availableNoShares.toNumber()).to.equal(new BN(0.02 * LAMPORTS_PER_SOL).toNumber());
            expect(marketState.totalNoShares.toNumber()).to.equal(new BN(0.0275 * LAMPORTS_PER_SOL).toNumber());

            let shareState = await program.account.share.fetch(share1Keypair.publicKey);
            expect(shareState.market.toBase58()).to.equal(market1Keypair.publicKey.toBase58());
            expect(shareState.authority.toBase58()).to.equal(user.publicKey.toBase58());
            expect(shareState.liquidityClaimed).to.be.false;
            expect(shareState.yesSharesClaimed).to.be.false;
            expect(shareState.noSharesClaimed).to.be.false;
            expect(shareState.liquidityShares.toNumber()).to.equal(new BN(0.01 * LAMPORTS_PER_SOL).toNumber());
            expect(shareState.claimedLiquidityFees.toNumber()).to.equal(new BN(0).toNumber());
            expect(shareState.yesShares.toNumber()).to.equal(new BN(0.0225 * LAMPORTS_PER_SOL).toNumber());
            expect(shareState.noShares.toNumber()).to.equal(new BN(0.0075 * LAMPORTS_PER_SOL).toNumber());
        });

        it('should sell yes outcome shares', async () => {
            const user = programProvider.wallet;

            await program.methods
                .sellOutcomeShares({yes: {}}, new BN(0.01 * LAMPORTS_PER_SOL), new BN(0.015 * LAMPORTS_PER_SOL))
                .accounts({
                    authority: user.publicKey,
                    share: share1Keypair.publicKey,
                    market: market1Keypair.publicKey,
                })
                .signers([])
                .rpc();

            let marketState = await program.account.market.fetch(market1Keypair.publicKey);
            expect(marketState.feesPoolWeight.toNumber()).to.equal(new BN(0).toNumber());
            expect(marketState.balance.toNumber()).to.equal(new BN(0.0175 * LAMPORTS_PER_SOL).toNumber());
            expect(marketState.liquidity.toNumber()).to.equal(new BN(0.01 * LAMPORTS_PER_SOL).toNumber());
            expect(marketState.volume.toNumber()).to.equal(new BN(0.04 * LAMPORTS_PER_SOL).toNumber());
            expect(marketState.availableShares.toNumber()).to.equal(new BN(0.02 * LAMPORTS_PER_SOL).toNumber());
            expect(marketState.availableYesShares.toNumber()).to.equal(new BN(0.01 * LAMPORTS_PER_SOL).toNumber());
            expect(marketState.totalYesShares.toNumber()).to.equal(new BN(0.0175 * LAMPORTS_PER_SOL).toNumber());
            expect(marketState.availableNoShares.toNumber()).to.equal(new BN(0.01 * LAMPORTS_PER_SOL).toNumber());
            expect(marketState.totalNoShares.toNumber()).to.equal(new BN(0.0175 * LAMPORTS_PER_SOL).toNumber());

            let shareState = await program.account.share.fetch(share1Keypair.publicKey);
            expect(shareState.market.toBase58()).to.equal(market1Keypair.publicKey.toBase58());
            expect(shareState.authority.toBase58()).to.equal(user.publicKey.toBase58());
            expect(shareState.liquidityClaimed).to.be.false;
            expect(shareState.yesSharesClaimed).to.be.false;
            expect(shareState.noSharesClaimed).to.be.false;
            expect(shareState.liquidityShares.toNumber()).to.equal(new BN(0.01 * LAMPORTS_PER_SOL).toNumber());
            expect(shareState.claimedLiquidityFees.toNumber()).to.equal(new BN(0).toNumber());
            expect(shareState.yesShares.toNumber()).to.equal(new BN(0.0075 * LAMPORTS_PER_SOL).toNumber());
            expect(shareState.noShares.toNumber()).to.equal(new BN(0.0075 * LAMPORTS_PER_SOL).toNumber());
        });
    });

    context('Claim fees', async () => {
        it('should claim liquidity fees before closing the market', async () => {
            const user = programProvider.wallet;

            await program.methods
                .claimLiquidityFees()
                .accounts({
                    authority: user.publicKey,
                    share: share1Keypair.publicKey,
                    market: market1Keypair.publicKey,
                })
                .signers([])
                .rpc();

            let shareState = await program.account.share.fetch(share1Keypair.publicKey);
            expect(shareState.market.toBase58()).to.equal(market1Keypair.publicKey.toBase58());
            expect(shareState.authority.toBase58()).to.equal(user.publicKey.toBase58());
            expect(shareState.liquidityClaimed).to.be.false;
            expect(shareState.yesSharesClaimed).to.be.false;
            expect(shareState.noSharesClaimed).to.be.false;
            expect(shareState.liquidityShares.toNumber()).to.equal(new BN(0.01 * LAMPORTS_PER_SOL).toNumber());
            expect(shareState.claimedLiquidityFees.toNumber()).to.equal(new BN(0).toNumber());
            expect(shareState.yesShares.toNumber()).to.equal(new BN(0.0075 * LAMPORTS_PER_SOL).toNumber());
            expect(shareState.noShares.toNumber()).to.equal(new BN(0.0075 * LAMPORTS_PER_SOL).toNumber());
        });
    });

    context('Claim winnings before closing the market', async () => {
        it('should not be able to claim winnings', async () => {
            const user = programProvider.wallet;

            try {
                await program.methods
                    .claimWinnings()
                    .accounts({
                        authority: user.publicKey,
                        share: share1Keypair.publicKey,
                        market: market1Keypair.publicKey,
                    })
                    .signers([])
                    .rpc();
            } catch (error) {
                expect(error.error.errorCode.code).to.equal('MarketNotResolved');
                return;
            }
        });

        it('should not be able to claim earnings from liquidity providing', async () => {
            const user = programProvider.wallet;

            try {
                await program.methods
                    .claimLiquidity()
                    .accounts({
                        authority: user.publicKey,
                        share: share1Keypair.publicKey,
                        market: market1Keypair.publicKey,
                    })
                    .signers([])
                    .rpc();
            } catch (error) {
                expect(error.error.errorCode.code).to.equal('MarketNotResolved');
                return;
            }
        });
    });

    context('Resolve Market', async () => {
        it('should resolve market', async () => {
            const user = programProvider.wallet;

            await program.methods
                .closeMarketWithAnswer({yes: {}})
                .accounts({
                    user: user.publicKey,
                    market: market1Keypair.publicKey,
                })
                .signers([])
                .rpc();

            let marketState = await program.account.market.fetch(market1Keypair.publicKey);
            expect(marketState.state).to.eql({
                resolved: {
                    outcome: {
                        yes: {}
                    }
                }
            });
            expect(marketState.feesPoolWeight.toNumber()).to.equal(new BN(0).toNumber());
            expect(marketState.balance.toNumber()).to.equal(new BN(0.0175 * LAMPORTS_PER_SOL).toNumber());
            expect(marketState.liquidity.toNumber()).to.equal(new BN(0.01 * LAMPORTS_PER_SOL).toNumber());
            expect(marketState.volume.toNumber()).to.equal(new BN(0.04 * LAMPORTS_PER_SOL).toNumber());
            expect(marketState.availableShares.toNumber()).to.equal(new BN(0.02 * LAMPORTS_PER_SOL).toNumber());
            expect(marketState.availableYesShares.toNumber()).to.equal(new BN(0.01 * LAMPORTS_PER_SOL).toNumber());
            expect(marketState.totalYesShares.toNumber()).to.equal(new BN(0.0175 * LAMPORTS_PER_SOL).toNumber());
            expect(marketState.availableNoShares.toNumber()).to.equal(new BN(0.01 * LAMPORTS_PER_SOL).toNumber());
            expect(marketState.totalNoShares.toNumber()).to.equal(new BN(0.0175 * LAMPORTS_PER_SOL).toNumber());
        });
    });

    context('Claim fees after closing the market and before claiming the liquidity', async () => {
        it('should claim liquidity fees', async () => {
            const user = programProvider.wallet;

            await program.methods
                .claimLiquidityFees()
                .accounts({
                    authority: user.publicKey,
                    share: share1Keypair.publicKey,
                    market: market1Keypair.publicKey,
                })
                .signers([])
                .rpc();

            let shareState = await program.account.share.fetch(share1Keypair.publicKey);
            expect(shareState.market.toBase58()).to.equal(market1Keypair.publicKey.toBase58());
            expect(shareState.authority.toBase58()).to.equal(user.publicKey.toBase58());
            expect(shareState.liquidityClaimed).to.be.false;
            expect(shareState.yesSharesClaimed).to.be.false;
            expect(shareState.noSharesClaimed).to.be.false;
            expect(shareState.liquidityShares.toNumber()).to.equal(new BN(0.01 * LAMPORTS_PER_SOL).toNumber());
            expect(shareState.claimedLiquidityFees.toNumber()).to.equal(new BN(0).toNumber());
            expect(shareState.yesShares.toNumber()).to.equal(new BN(0.0075 * LAMPORTS_PER_SOL).toNumber());
            expect(shareState.noShares.toNumber()).to.equal(new BN(0.0075 * LAMPORTS_PER_SOL).toNumber());
        });
    });

    context('Claim winnings after resolving the market', async () => {
        it('should claim winnings', async () => {
            const user = programProvider.wallet;

            await program.methods
                .claimWinnings()
                .accounts({
                    authority: user.publicKey,
                    share: share1Keypair.publicKey,
                    market: market1Keypair.publicKey,
                })
                .signers([])
                .rpc();

            let marketState = await program.account.market.fetch(market1Keypair.publicKey);
            expect(marketState.feesPoolWeight.toNumber()).to.equal(new BN(0).toNumber());
            expect(marketState.balance.toNumber()).to.equal(new BN(0.01 * LAMPORTS_PER_SOL).toNumber());
            expect(marketState.liquidity.toNumber()).to.equal(new BN(0.01 * LAMPORTS_PER_SOL).toNumber());
            expect(marketState.volume.toNumber()).to.equal(new BN(0.04 * LAMPORTS_PER_SOL).toNumber());
            expect(marketState.availableShares.toNumber()).to.equal(new BN(0.02 * LAMPORTS_PER_SOL).toNumber());
            expect(marketState.availableYesShares.toNumber()).to.equal(new BN(0.01 * LAMPORTS_PER_SOL).toNumber());
            expect(marketState.totalYesShares.toNumber()).to.equal(new BN(0.0175 * LAMPORTS_PER_SOL).toNumber());
            expect(marketState.availableNoShares.toNumber()).to.equal(new BN(0.01 * LAMPORTS_PER_SOL).toNumber());
            expect(marketState.totalNoShares.toNumber()).to.equal(new BN(0.0175 * LAMPORTS_PER_SOL).toNumber());

            let shareState = await program.account.share.fetch(share1Keypair.publicKey);
            expect(shareState.market.toBase58()).to.equal(market1Keypair.publicKey.toBase58());
            expect(shareState.authority.toBase58()).to.equal(user.publicKey.toBase58());
            expect(shareState.liquidityClaimed).to.be.false;
            expect(shareState.yesSharesClaimed).to.be.true;
            expect(shareState.noSharesClaimed).to.be.false;
            expect(shareState.liquidityShares.toNumber()).to.equal(new BN(0.01 * LAMPORTS_PER_SOL).toNumber());
            expect(shareState.claimedLiquidityFees.toNumber()).to.equal(new BN(0).toNumber());
            expect(shareState.yesShares.toNumber()).to.equal(new BN(0.0075 * LAMPORTS_PER_SOL).toNumber());
            expect(shareState.noShares.toNumber()).to.equal(new BN(0.0075 * LAMPORTS_PER_SOL).toNumber());
        });

        it('should claim earnings from liquidity', async () => {
            const user = programProvider.wallet;

            await program.methods
                .claimLiquidity()
                .accounts({
                    authority: user.publicKey,
                    share: share1Keypair.publicKey,
                    market: market1Keypair.publicKey,
                })
                .signers([])
                .rpc();

            let marketState = await program.account.market.fetch(market1Keypair.publicKey);
            expect(marketState.feesPoolWeight.toNumber()).to.equal(new BN(0).toNumber());
            expect(marketState.balance.toNumber()).to.equal(new BN(0).toNumber());
            expect(marketState.liquidity.toNumber()).to.equal(new BN(0.01 * LAMPORTS_PER_SOL).toNumber());
            expect(marketState.volume.toNumber()).to.equal(new BN(0.04 * LAMPORTS_PER_SOL).toNumber());
            expect(marketState.availableShares.toNumber()).to.equal(new BN(0.02 * LAMPORTS_PER_SOL).toNumber());
            expect(marketState.availableYesShares.toNumber()).to.equal(new BN(0.01 * LAMPORTS_PER_SOL).toNumber());
            expect(marketState.totalYesShares.toNumber()).to.equal(new BN(0.0175 * LAMPORTS_PER_SOL).toNumber());
            expect(marketState.availableNoShares.toNumber()).to.equal(new BN(0.01 * LAMPORTS_PER_SOL).toNumber());
            expect(marketState.totalNoShares.toNumber()).to.equal(new BN(0.0175 * LAMPORTS_PER_SOL).toNumber());

            let shareState = await program.account.share.fetch(share1Keypair.publicKey);
            expect(shareState.market.toBase58()).to.equal(market1Keypair.publicKey.toBase58());
            expect(shareState.authority.toBase58()).to.equal(user.publicKey.toBase58());
            expect(shareState.liquidityClaimed).to.be.true;
            expect(shareState.yesSharesClaimed).to.be.true; // because in previous test it claimed winnings
            expect(shareState.noSharesClaimed).to.be.false;
            expect(shareState.liquidityShares.toNumber()).to.equal(new BN(0.01 * LAMPORTS_PER_SOL).toNumber());
            expect(shareState.claimedLiquidityFees.toNumber()).to.equal(new BN(0).toNumber());
            expect(shareState.yesShares.toNumber()).to.equal(new BN(0.0075 * LAMPORTS_PER_SOL).toNumber());
            expect(shareState.noShares.toNumber()).to.equal(new BN(0.0075 * LAMPORTS_PER_SOL).toNumber());

        });
    });

    context('Claim fees after closing the market and after claiming the liquidity', async () => {
        it('should claim liquidity fees', async () => {
            const user = programProvider.wallet;

            await program.methods
                .claimLiquidityFees()
                .accounts({
                    authority: user.publicKey,
                    share: share1Keypair.publicKey,
                    market: market1Keypair.publicKey,
                })
                .signers([])
                .rpc();

            let shareState = await program.account.share.fetch(share1Keypair.publicKey);
            expect(shareState.market.toBase58()).to.equal(market1Keypair.publicKey.toBase58());
            expect(shareState.authority.toBase58()).to.equal(user.publicKey.toBase58());
            expect(shareState.liquidityClaimed).to.be.true;
            expect(shareState.yesSharesClaimed).to.be.true; // because in previous test it claimed winnings
            expect(shareState.noSharesClaimed).to.be.false;
            expect(shareState.liquidityShares.toNumber()).to.equal(new BN(0.01 * LAMPORTS_PER_SOL).toNumber());
            expect(shareState.claimedLiquidityFees.toNumber()).to.equal(new BN(0).toNumber());
            expect(shareState.yesShares.toNumber()).to.equal(new BN(0.0075 * LAMPORTS_PER_SOL).toNumber());
            expect(shareState.noShares.toNumber()).to.equal(new BN(0.0075 * LAMPORTS_PER_SOL).toNumber());
        });
    });

    context('Market Events', async () => {
        const eventMarketKeypair = anchor.web3.Keypair.generate();
        const eventShareKeypair = anchor.web3.Keypair.generate();
        const eventMarketCreator = programProvider.wallet;

        it('should catch resolve & price events when creating a market', async () => {
            const expiresAt = DateTime.now().plus({days: 1});

            let marketCreatedListener = null;
            let liquidityPriceListener = null;
            let outcomePriceListener = null;

            let [[rEvent, rSlot], [lEvent, lSlot], [oEvent, oSlot]] = await new Promise((resolve, _reject) => {
                const rPromise = new Promise((resolve, _reject) => {
                    marketCreatedListener = program.addEventListener("MarketCreated", (event, slot) => {
                        resolve([event, slot]);
                    });
                });

                const lPromise = new Promise((resolve, _reject) => {
                    liquidityPriceListener = program.addEventListener("MarketLiquidity", (event, slot) => {
                        resolve([event, slot]);
                    });
                });

                const oPromise = new Promise((resolve, _reject) => {
                    outcomePriceListener = program.addEventListener("MarketOutcomePrice", (event, slot) => {
                        resolve([event, slot]);
                    });
                });

                Promise.all([rPromise, lPromise, oPromise]).then((values) => {
                    resolve(values as [[any, number], [any, number], [any, number]]);
                });

                program.methods
                    .createMarket(
                        "event market",
                        "about the market",
                        "market category",
                        "https://picsum.photos/id/1002/200/300.jpg",
                        0.0,
                        "resolution source",
                        "resolver",
                        new BN(expiresAt.toUnixInteger()),
                        "expected",
                        "=")
                    .accounts({
                        creator: eventMarketCreator.publicKey,
                        market: eventMarketKeypair.publicKey,
                    })
                    .signers([eventMarketKeypair])
                    .rpc();
            });

            await program.removeEventListener(marketCreatedListener);
            await program.removeEventListener(liquidityPriceListener);
            await program.removeEventListener(outcomePriceListener);

            let emittedAround = Interval.fromDateTimes(DateTime.now().minus({minutes: 1}), DateTime.now());

            // Market resolve event
            expect(rSlot).to.be.above(0);
            expect(rEvent.market.toBase58()).to.equal(eventMarketKeypair.publicKey.toBase58());
            expect(rEvent.user.toBase58()).to.equal(eventMarketCreator.publicKey.toBase58());

            let rTimestamp = DateTime.fromSeconds(rEvent.timestamp.toNumber());
            expect(emittedAround.contains(rTimestamp)).to.be.true;

            // Liquidity price event
            expect(lSlot).to.be.above(0);
            expect(lEvent.market.toBase58()).to.equal(eventMarketKeypair.publicKey.toBase58());
            expect(lEvent.liquidity.toNumber()).to.equal(new BN(0 ).toNumber());
            expect(lEvent.liquidityPrice.toNumber()).to.equal(new BN(0).toNumber());

            let lTimestamp = DateTime.fromSeconds(lEvent.timestamp.toNumber());
            expect(emittedAround.contains(lTimestamp)).to.be.true;

            // Outcome price event
            expect(oSlot).to.be.above(0);
            expect(oEvent.market.toBase58()).to.equal(eventMarketKeypair.publicKey.toBase58());
            expect(oEvent.yesOutcomePrice.toNumber()).to.equal(new BN( 0).toNumber());
            expect(oEvent.noOutcomePrice.toNumber()).to.equal(new BN(0).toNumber());

            let oTimestamp = DateTime.fromSeconds(oEvent.timestamp.toNumber());
            expect(emittedAround.contains(oTimestamp)).to.be.true;
        });

        it('should init share for user', async () => {
            const user = programProvider.wallet;

            await program.methods
                .initShare()
                .accounts({
                    share: eventShareKeypair.publicKey,
                    market: eventMarketKeypair.publicKey,
                    authority: user.publicKey,
                })
                .signers([eventShareKeypair])
                .rpc();

            let shareState = await program.account.share.fetch(eventShareKeypair.publicKey);
            expect(shareState.market.toBase58()).to.equal(eventMarketKeypair.publicKey.toBase58());
        });

        it('should catch liquidity event when adding liquidity', async () => {
            let listener = null;
            const user = programProvider.wallet;

            let [event, slot] = await new Promise((resolve, _reject) => {
                listener = program.addEventListener("MarketLiquidity", (event, slot) => {
                    resolve([event, slot]);
                });

                program.methods
                    .addLiquidity(new BN(0.02 * LAMPORTS_PER_SOL))
                    .accounts({
                        authority: user.publicKey,
                        share: eventShareKeypair.publicKey,
                        market: eventMarketKeypair.publicKey,
                    })
                    .signers([])
                    .rpc();
            });
            await program.removeEventListener(listener);

            expect(slot).to.be.above(0);
            expect(event.market.toBase58()).to.equal(eventMarketKeypair.publicKey.toBase58());
            expect(event.liquidity.toNumber()).to.equal(new BN(0.02 * LAMPORTS_PER_SOL).toNumber());
            expect(event.liquidityPrice.toNumber()).to.equal(new BN(1 * LAMPORTS_PER_SOL).toNumber());

            let emittedAround = Interval.fromDateTimes(DateTime.now().minus({minutes: 1}), DateTime.now());
            let timestamp = DateTime.fromSeconds(event.timestamp.toNumber());
            expect(emittedAround.contains(timestamp)).to.be.true;
        });

        it('should catch liquidity event when removing liquidity', async () => {
            let listener = null;
            const user = programProvider.wallet;

            let [event, slot] = await new Promise((resolve, _reject) => {
                listener = program.addEventListener("MarketLiquidity", (event, slot) => {
                    resolve([event, slot]);
                });

                program.methods
                    .removeLiquidity(new BN(0.01 * LAMPORTS_PER_SOL))
                    .accounts({
                        authority: user.publicKey,
                        share: eventShareKeypair.publicKey,
                        market: eventMarketKeypair.publicKey,
                    })
                    .signers([])
                    .rpc();
            });
            await program.removeEventListener(listener);

            expect(slot).to.be.above(0);
            expect(event.market.toBase58()).to.equal(eventMarketKeypair.publicKey.toBase58());
            expect(event.liquidity.toNumber()).to.equal(new BN(0.01 * LAMPORTS_PER_SOL).toNumber());
            expect(event.liquidityPrice.toNumber()).to.equal(new BN(1 * LAMPORTS_PER_SOL).toNumber());

            let emittedAround = Interval.fromDateTimes(DateTime.now().minus({minutes: 1}), DateTime.now());
            let timestamp = DateTime.fromSeconds(event.timestamp.toNumber());
            expect(emittedAround.contains(timestamp)).to.be.true;
        });

        it('should catch price events when buying outcome shares', async () => {
            const user = programProvider.wallet;

            let liquidityPriceListener = null;
            let outcomePriceListener = null;

            let [[lEvent, lSlot], [oEvent, oSlot]] = await new Promise((resolve, _reject) => {
                const lPromise = new Promise((resolve, _reject) => {
                    liquidityPriceListener = program.addEventListener("MarketLiquidity", (event, slot) => {
                        resolve([event, slot]);
                    });
                });

                const oPromise = new Promise((resolve, _reject) => {
                    outcomePriceListener = program.addEventListener("MarketOutcomePrice", (event, slot) => {
                        resolve([event, slot]);
                    });
                });

                Promise.all([lPromise, oPromise]).then((values) => {
                    resolve(values as [[any, number], [any, number]]);
                });

                program.methods
                    .buyOutcomeShares({yes: {}}, new BN(0.01 * LAMPORTS_PER_SOL), new BN(0.015 * LAMPORTS_PER_SOL))
                    .accounts({
                        authority: user.publicKey,
                        share: eventShareKeypair.publicKey,
                        market: eventMarketKeypair.publicKey,
                    })
                    .signers([])
                    .rpc();
            });

            await program.removeEventListener(liquidityPriceListener);
            await program.removeEventListener(outcomePriceListener);

            let emittedAround = Interval.fromDateTimes(DateTime.now().minus({minutes: 1}), DateTime.now());

            // Liquidity price event
            expect(lSlot).to.be.above(0);
            expect(lEvent.market.toBase58()).to.equal(eventMarketKeypair.publicKey.toBase58());
            expect(lEvent.liquidity.toNumber()).to.equal(new BN(0.01 * LAMPORTS_PER_SOL).toNumber());
            expect(lEvent.liquidityPrice.toNumber()).to.equal(new BN(0.8 * LAMPORTS_PER_SOL).toNumber());

            let lTimestamp = DateTime.fromSeconds(lEvent.timestamp.toNumber());
            expect(emittedAround.contains(lTimestamp)).to.be.true;

            // Outcome price event
            expect(oSlot).to.be.above(0);
            expect(oEvent.market.toBase58()).to.equal(eventMarketKeypair.publicKey.toBase58());
            expect(oEvent.yesOutcomePrice.toNumber()).to.equal(new BN(0.8 * LAMPORTS_PER_SOL).toNumber());
            expect(oEvent.noOutcomePrice.toNumber()).to.equal(new BN(0.2 * LAMPORTS_PER_SOL).toNumber());

            let oTimestamp = DateTime.fromSeconds(oEvent.timestamp.toNumber());
            expect(emittedAround.contains(oTimestamp)).to.be.true;
        });

        it('should catch price events when selling outcome shares', async () => {
            const user = programProvider.wallet;

            let liquidityPriceListener = null;
            let outcomePriceListener = null;

            let [[lEvent, lSlot], [oEvent, oSlot]] = await new Promise((resolve, _reject) => {
                const lPromise = new Promise((resolve, _reject) => {
                    liquidityPriceListener = program.addEventListener("MarketLiquidity", (event, slot) => {
                        resolve([event, slot]);
                    });
                });

                const oPromise = new Promise((resolve, _reject) => {
                    outcomePriceListener = program.addEventListener("MarketOutcomePrice", (event, slot) => {
                        resolve([event, slot]);
                    });
                });

                Promise.all([lPromise, oPromise]).then((values) => {
                    resolve(values as [[any, number], [any, number]]);
                });

                program.methods
                    .sellOutcomeShares({yes: {}}, new BN(0.01 * LAMPORTS_PER_SOL), new BN(0.015 * LAMPORTS_PER_SOL))
                    .accounts({
                        authority: user.publicKey,
                        share: eventShareKeypair.publicKey,
                        market: eventMarketKeypair.publicKey,
                    })
                    .signers([])
                    .rpc();
            });

            await program.removeEventListener(liquidityPriceListener);
            await program.removeEventListener(outcomePriceListener);

            let emittedAround = Interval.fromDateTimes(DateTime.now().minus({minutes: 1}), DateTime.now());

            // Liquidity price event
            expect(lSlot).to.be.above(0);
            expect(lEvent.market.toBase58()).to.equal(eventMarketKeypair.publicKey.toBase58());
            expect(lEvent.liquidity.toNumber()).to.equal(new BN(0.01 * LAMPORTS_PER_SOL).toNumber());
            expect(lEvent.liquidityPrice.toNumber()).to.equal(new BN(1 * LAMPORTS_PER_SOL).toNumber());

            let lTimestamp = DateTime.fromSeconds(lEvent.timestamp.toNumber());
            expect(emittedAround.contains(lTimestamp)).to.be.true;

            // Outcome price event
            expect(oSlot).to.be.above(0);
            expect(oEvent.market.toBase58()).to.equal(eventMarketKeypair.publicKey.toBase58());
            expect(oEvent.yesOutcomePrice.toNumber()).to.equal(new BN(0.5 * LAMPORTS_PER_SOL).toNumber());
            expect(oEvent.noOutcomePrice.toNumber()).to.equal(new BN(0.5 * LAMPORTS_PER_SOL).toNumber());

            let oTimestamp = DateTime.fromSeconds(oEvent.timestamp.toNumber());
            expect(emittedAround.contains(oTimestamp)).to.be.true;
        });

        it('should catch resolve & price events when closing the market', async () => {
            const user = programProvider.wallet;

            let marketResolveListener = null;
            let liquidityPriceListener = null;
            let outcomePriceListener = null;

            let [[rEvent, rSlot], [lEvent, lSlot], [oEvent, oSlot]] = await new Promise((resolve, _reject) => {
                const rPromise = new Promise((resolve, _reject) => {
                    marketResolveListener = program.addEventListener("MarketResolved", (event, slot) => {
                        resolve([event, slot]);
                    });
                });

                const lPromise = new Promise((resolve, _reject) => {
                    liquidityPriceListener = program.addEventListener("MarketLiquidity", (event, slot) => {
                        resolve([event, slot]);
                    });
                });

                const oPromise = new Promise((resolve, _reject) => {
                    outcomePriceListener = program.addEventListener("MarketOutcomePrice", (event, slot) => {
                        resolve([event, slot]);
                    });
                });

                Promise.all([rPromise, lPromise, oPromise]).then((values) => {
                    resolve(values as [[any, number], [any, number], [any, number]]);
                });

                program.methods
                    .closeMarketWithAnswer({yes: {}})
                    .accounts({
                        market: eventMarketKeypair.publicKey,
                        user: user.publicKey,
                    })
                    .signers([])
                    .rpc();
            });

            await program.removeEventListener(marketResolveListener);
            await program.removeEventListener(liquidityPriceListener);
            await program.removeEventListener(outcomePriceListener);

            let emittedAround = Interval.fromDateTimes(DateTime.now().minus({minutes: 1}), DateTime.now());

            // Market resolve event
            expect(rSlot).to.be.above(0);
            expect(rEvent.market.toBase58()).to.equal(eventMarketKeypair.publicKey.toBase58());
            expect(rEvent.user.toBase58()).to.equal(user.publicKey.toBase58());

            let rTimestamp = DateTime.fromSeconds(rEvent.timestamp.toNumber());
            expect(emittedAround.contains(rTimestamp)).to.be.true;

            // Liquidity price event
            expect(lSlot).to.be.above(0);
            expect(lEvent.market.toBase58()).to.equal(eventMarketKeypair.publicKey.toBase58());
            expect(lEvent.liquidity.toNumber()).to.equal(new BN(0.01 * LAMPORTS_PER_SOL).toNumber());
            expect(lEvent.liquidityPrice.toNumber()).to.equal(new BN(1 * LAMPORTS_PER_SOL).toNumber());

            let lTimestamp = DateTime.fromSeconds(lEvent.timestamp.toNumber());
            expect(emittedAround.contains(lTimestamp)).to.be.true;

            // Outcome price event
            expect(oSlot).to.be.above(0);
            expect(oEvent.market.toBase58()).to.equal(eventMarketKeypair.publicKey.toBase58());
            expect(oEvent.yesOutcomePrice.toNumber()).to.equal(new BN( 1 * LAMPORTS_PER_SOL).toNumber());
            expect(oEvent.noOutcomePrice.toNumber()).to.equal(new BN(0 * LAMPORTS_PER_SOL).toNumber());

            let oTimestamp = DateTime.fromSeconds(oEvent.timestamp.toNumber());
            expect(emittedAround.contains(oTimestamp)).to.be.true;
        });

    });

    context('Market with 2% fee when amount 0.01', async () => {
        let twoPercentFeeMarketKeypair;
        let twoPercentFeeMarketShareKeypair;

        context('Market Creation', async () => {
            it('should create a market', async () => {
                twoPercentFeeMarketKeypair = anchor.web3.Keypair.generate();
                const creator = programProvider.wallet;

                const expiresAt = DateTime.now().plus({days: 1});

                await program.methods
                    .createMarket(
                        "market 1",
                        "about the market",
                        "market category",
                        "https://picsum.photos/id/1002/200/300.jpg",
                        2.0,
                        "resolution source",
                        "resolver",
                        new BN(expiresAt.toUnixInteger()),
                        "expected",
                        "=")
                    .accounts({
                        creator: creator.publicKey,
                        market: twoPercentFeeMarketKeypair.publicKey,
                    })
                    .signers([twoPercentFeeMarketKeypair])
                    .rpc();

                let marketState = await program.account.market.fetch(twoPercentFeeMarketKeypair.publicKey);

                expect(marketState.creator.toBase58()).to.equal(creator.publicKey.toBase58())
                expect(marketState.state).to.eql({open: {}});

                let createdAround = Interval.fromDateTimes(DateTime.now().minus({minutes: 3}), DateTime.now());
                let createdAt = DateTime.fromSeconds(marketState.createdAt.toNumber());
                expect(createdAround.contains(createdAt)).to.be.true;

                expect(marketState.expiresAt.toNumber()).to.equal(expiresAt.toUnixInteger());
                expect(marketState.name).to.equal("market 1");
                expect(marketState.about).to.equal("about the market");
                expect(marketState.category).to.equal("market category");
                expect(marketState.imageUrl).to.equal("https://picsum.photos/id/1002/200/300.jpg");
                expect(marketState.resolutionSource).to.equal("resolution source");
                expect(marketState.resolver).to.equal("resolver");
                expect(marketState.expectedValue).to.equal("expected");
                expect(marketState.resolutionOperator).to.equal("=");
                expect(marketState.feePercentage).to.equal(2.0);
                expect(marketState.feesPoolWeight.toNumber()).to.equal(new BN(0).toNumber());
                expect(marketState.balance.toNumber()).to.equal(new BN(0).toNumber());
                expect(marketState.liquidity.toNumber()).to.equal(new BN(0).toNumber());
                expect(marketState.volume.toNumber()).to.equal(new BN(0).toNumber());
                expect(marketState.availableShares.toNumber()).to.equal(new BN(0).toNumber());
                expect(marketState.availableYesShares.toNumber()).to.equal(new BN(0).toNumber());
                expect(marketState.totalYesShares.toNumber()).to.equal(new BN(0).toNumber());
                expect(marketState.availableNoShares.toNumber()).to.equal(new BN(0).toNumber());
                expect(marketState.totalNoShares.toNumber()).to.equal(new BN(0).toNumber());
            });

            it('should init share for user', async () => {
                twoPercentFeeMarketShareKeypair = anchor.web3.Keypair.generate();
                const user = programProvider.wallet;

                await program.methods
                    .initShare()
                    .accounts({
                        share: twoPercentFeeMarketShareKeypair.publicKey,
                        market: twoPercentFeeMarketKeypair.publicKey,
                        authority: user.publicKey,
                    })
                    .signers([twoPercentFeeMarketShareKeypair])
                    .rpc();

                let shareState = await program.account.share.fetch(twoPercentFeeMarketShareKeypair.publicKey);
                expect(shareState.market.toBase58()).to.equal(twoPercentFeeMarketKeypair.publicKey.toBase58());
                expect(shareState.authority.toBase58()).to.equal(user.publicKey.toBase58());
                expect(shareState.liquidityClaimed).to.be.false;
                expect(shareState.yesSharesClaimed).to.be.false;
                expect(shareState.noSharesClaimed).to.be.false;
                expect(shareState.liquidityShares.toNumber()).to.equal(0);
                expect(shareState.claimedLiquidityFees.toNumber()).to.equal(new BN(0).toNumber());
                expect(shareState.yesShares.toNumber()).to.equal(0);
                expect(shareState.noShares.toNumber()).to.equal(0);
            });

            it('should add liquidity for newly created market', async () => {
                const user = programProvider.wallet;

                await program.methods
                    .addLiquidity(new BN(0.01 * LAMPORTS_PER_SOL))
                    .accounts({
                        authority: user.publicKey,
                        share: twoPercentFeeMarketShareKeypair.publicKey,
                        market: twoPercentFeeMarketKeypair.publicKey,
                    })
                    .signers([])
                    .rpc();

                let marketState = await program.account.market.fetch(twoPercentFeeMarketKeypair.publicKey);
                expect(marketState.feesPoolWeight.toNumber()).to.equal(new BN(0).toNumber());
                expect(marketState.balance.toNumber()).to.equal(new BN(0.01 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.liquidity.toNumber()).to.equal(new BN(0.01 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.volume.toNumber()).to.equal(new BN(0.01 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.availableShares.toNumber()).to.equal(new BN(0.02 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.availableYesShares.toNumber()).to.equal(new BN(0.01 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.totalYesShares.toNumber()).to.equal(new BN(0.01 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.availableNoShares.toNumber()).to.equal(new BN(0.01 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.totalNoShares.toNumber()).to.equal(new BN(0.01 * LAMPORTS_PER_SOL).toNumber());

                let shareState = await program.account.share.fetch(twoPercentFeeMarketShareKeypair.publicKey);
                expect(shareState.market.toBase58()).to.equal(twoPercentFeeMarketKeypair.publicKey.toBase58());
                expect(shareState.authority.toBase58()).to.equal(user.publicKey.toBase58());
                expect(shareState.liquidityClaimed).to.be.false;
                expect(shareState.yesSharesClaimed).to.be.false;
                expect(shareState.noSharesClaimed).to.be.false;
                expect(shareState.liquidityShares.toNumber()).to.equal(new BN(0.01 * LAMPORTS_PER_SOL).toNumber());
                expect(shareState.claimedLiquidityFees.toNumber()).to.equal(new BN(0).toNumber());
                expect(shareState.yesShares.toNumber()).to.equal(0);
                expect(shareState.noShares.toNumber()).to.equal(0);
            });

        });

        context('Market Interaction - Balanced Market (Same Outcome Odds)', async () => {
            it('should wait to avoid "This transaction has already been processed" error', async () => {
                await sleep(500);
            });

            it('should add liquidity without changing shares balance', async () => {
                const user = programProvider.wallet;

                await program.methods
                    .addLiquidity(new BN(0.01 * LAMPORTS_PER_SOL))
                    .accounts({
                        authority: user.publicKey,
                        share: twoPercentFeeMarketShareKeypair.publicKey,
                        market: twoPercentFeeMarketKeypair.publicKey,
                    })
                    .signers([])
                    .rpc();

                let marketState = await program.account.market.fetch(twoPercentFeeMarketKeypair.publicKey);
                expect(marketState.feesPoolWeight.toNumber()).to.equal(new BN(0).toNumber());
                expect(marketState.balance.toNumber()).to.equal(new BN(0.02 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.liquidity.toNumber()).to.equal(new BN(0.02 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.volume.toNumber()).to.equal(new BN(0.02 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.availableShares.toNumber()).to.equal(new BN(0.04 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.availableYesShares.toNumber()).to.equal(new BN(0.02 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.totalYesShares.toNumber()).to.equal(new BN(0.02 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.availableNoShares.toNumber()).to.equal(new BN(0.02 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.totalNoShares.toNumber()).to.equal(new BN(0.02 * LAMPORTS_PER_SOL).toNumber());

                let shareState = await program.account.share.fetch(twoPercentFeeMarketShareKeypair.publicKey);
                expect(shareState.market.toBase58()).to.equal(twoPercentFeeMarketKeypair.publicKey.toBase58());
                expect(shareState.authority.toBase58()).to.equal(user.publicKey.toBase58());
                expect(shareState.liquidityClaimed).to.be.false;
                expect(shareState.yesSharesClaimed).to.be.false;
                expect(shareState.noSharesClaimed).to.be.false;
                expect(shareState.liquidityShares.toNumber()).to.equal(new BN(0.02 * LAMPORTS_PER_SOL).toNumber());
                expect(shareState.claimedLiquidityFees.toNumber()).to.equal(new BN(0).toNumber());
                expect(shareState.yesShares.toNumber()).to.equal(0);
                expect(shareState.noShares.toNumber()).to.equal(0);
            });

            it('should remove liquidity without changing shares balance', async () => {
                const user = programProvider.wallet;

                await program.methods
                    .removeLiquidity(new BN(0.01 * LAMPORTS_PER_SOL))
                    .accounts({
                        authority: user.publicKey,
                        share: twoPercentFeeMarketShareKeypair.publicKey,
                        market: twoPercentFeeMarketKeypair.publicKey,
                    })
                    .signers([])
                    .rpc();

                let marketState = await program.account.market.fetch(twoPercentFeeMarketKeypair.publicKey);
                expect(marketState.feesPoolWeight.toNumber()).to.equal(new BN(0).toNumber());
                expect(marketState.balance.toNumber()).to.equal(new BN(0.01 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.liquidity.toNumber()).to.equal(new BN(0.01 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.volume.toNumber()).to.equal(new BN(0.02 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.availableShares.toNumber()).to.equal(new BN(0.02 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.availableYesShares.toNumber()).to.equal(new BN(0.01 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.totalYesShares.toNumber()).to.equal(new BN(0.01 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.availableNoShares.toNumber()).to.equal(new BN(0.01 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.totalNoShares.toNumber()).to.equal(new BN(0.01 * LAMPORTS_PER_SOL).toNumber());

                let shareState = await program.account.share.fetch(twoPercentFeeMarketShareKeypair.publicKey);
                expect(shareState.market.toBase58()).to.equal(twoPercentFeeMarketKeypair.publicKey.toBase58());
                expect(shareState.authority.toBase58()).to.equal(user.publicKey.toBase58());
                expect(shareState.liquidityClaimed).to.be.false;
                expect(shareState.yesSharesClaimed).to.be.false;
                expect(shareState.noSharesClaimed).to.be.false;
                expect(shareState.liquidityShares.toNumber()).to.equal(new BN(0.01 * LAMPORTS_PER_SOL).toNumber());
                expect(shareState.claimedLiquidityFees.toNumber()).to.equal(new BN(0).toNumber());
                expect(shareState.yesShares.toNumber()).to.equal(0);
                expect(shareState.noShares.toNumber()).to.equal(0);
            });
        });

        context('Market Interaction - Unbalanced Market (Different Outcome Odds)', async () => {
            it('should buy yes outcome shares', async () => {
                const user = programProvider.wallet;

                await program.methods
                    .buyOutcomeShares({yes: {}}, new BN(0.01 * LAMPORTS_PER_SOL), new BN(0.014749494949494948 * LAMPORTS_PER_SOL))
                    .accounts({
                        authority: user.publicKey,
                        share: twoPercentFeeMarketShareKeypair.publicKey,
                        market: twoPercentFeeMarketKeypair.publicKey,
                    })
                    .signers([])
                    .rpc();

                let marketState = await program.account.market.fetch(twoPercentFeeMarketKeypair.publicKey);
                expect(marketState.feesPoolWeight.toNumber()).to.equal(new BN(0.0002 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.balance.toNumber()).to.equal(new BN(0.0198 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.liquidity.toNumber()).to.equal(new BN(0.01 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.volume.toNumber()).to.equal(new BN(0.03 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.availableShares.toNumber()).to.equal(new BN(0.024850505050505053 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.availableYesShares.toNumber()).to.equal(new BN(0.005050505050505051 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.totalYesShares.toNumber()).to.equal(new BN(0.0198 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.availableNoShares.toNumber()).to.equal(new BN(0.0198 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.totalNoShares.toNumber()).to.equal(new BN(0.0198 * LAMPORTS_PER_SOL).toNumber());

                let shareState = await program.account.share.fetch(twoPercentFeeMarketShareKeypair.publicKey);
                expect(shareState.market.toBase58()).to.equal(twoPercentFeeMarketKeypair.publicKey.toBase58());
                expect(shareState.authority.toBase58()).to.equal(user.publicKey.toBase58());
                expect(shareState.liquidityClaimed).to.be.false;
                expect(shareState.yesSharesClaimed).to.be.false;
                expect(shareState.noSharesClaimed).to.be.false;
                expect(shareState.liquidityShares.toNumber()).to.equal(new BN(0.01 * LAMPORTS_PER_SOL).toNumber());
                expect(shareState.claimedLiquidityFees.toNumber()).to.equal(new BN(0).toNumber());
                expect(shareState.yesShares.toNumber()).to.equal(new BN(0.014749495 * LAMPORTS_PER_SOL).toNumber());
                expect(shareState.noShares.toNumber()).to.equal(0);
            });

            it('should add liquidity', async () => {
                const user = programProvider.wallet;

                await program.methods
                    .addLiquidity(new BN(0.01 * LAMPORTS_PER_SOL))
                    .accounts({
                        authority: user.publicKey,
                        share: twoPercentFeeMarketShareKeypair.publicKey,
                        market: twoPercentFeeMarketKeypair.publicKey,
                    })
                    .signers([])
                    .rpc();

                let marketState = await program.account.market.fetch(twoPercentFeeMarketKeypair.publicKey);
                expect(marketState.feesPoolWeight.toNumber()).to.equal(new BN(0.000301010101010101 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.balance.toNumber()).to.equal(new BN(0.0298 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.liquidity.toNumber()).to.equal(new BN(0.01505050505050505 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.volume.toNumber()).to.equal(new BN(0.04 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.availableShares.toNumber()).to.equal(new BN(0.037401265177022754 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.availableYesShares.toNumber()).to.equal(new BN(0.007601265177022753 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.totalYesShares.toNumber()).to.equal(new BN(0.0298 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.availableNoShares.toNumber()).to.equal(new BN(0.0298 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.totalNoShares.toNumber()).to.equal(new BN(0.0298 * LAMPORTS_PER_SOL).toNumber());

                let shareState = await program.account.share.fetch(twoPercentFeeMarketShareKeypair.publicKey);
                expect(shareState.market.toBase58()).to.equal(twoPercentFeeMarketKeypair.publicKey.toBase58());
                expect(shareState.authority.toBase58()).to.equal(user.publicKey.toBase58());
                expect(shareState.liquidityClaimed).to.be.false;
                expect(shareState.yesSharesClaimed).to.be.false;
                expect(shareState.noSharesClaimed).to.be.false;
                expect(shareState.liquidityShares.toNumber()).to.equal(new BN(0.01505050505050505 * LAMPORTS_PER_SOL).toNumber());
                expect(shareState.claimedLiquidityFees.toNumber()).to.equal(new BN(0.000101010101010101 * LAMPORTS_PER_SOL).toNumber());
                expect(shareState.yesShares.toNumber()).to.equal(new BN(0.022198735 * LAMPORTS_PER_SOL).toNumber());
                expect(shareState.noShares.toNumber()).to.equal(0);
            });

            it('should remove liquidity', async () => {
                const user = programProvider.wallet;

                await program.methods
                    .claimLiquidityFees()
                    .accounts({
                        authority: user.publicKey,
                        share: twoPercentFeeMarketShareKeypair.publicKey,
                        market: twoPercentFeeMarketKeypair.publicKey,
                    })
                    .signers([])
                    .rpc();

                await program.methods
                    .removeLiquidity(new BN(0.005 * LAMPORTS_PER_SOL))
                    .accounts({
                        authority: user.publicKey,
                        share: twoPercentFeeMarketShareKeypair.publicKey,
                        market: twoPercentFeeMarketKeypair.publicKey,
                    })
                    .signers([])
                    .rpc();

                let marketState = await program.account.market.fetch(twoPercentFeeMarketKeypair.publicKey);
                expect(marketState.feesPoolWeight.toNumber()).to.equal(new BN(0.000201011 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.balance.toNumber()).to.equal(new BN(0.027274748 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.liquidity.toNumber()).to.equal(new BN(0.01005050505050505 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.volume.toNumber()).to.equal(new BN(0.04 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.availableShares.toNumber()).to.equal(new BN(0.024976013 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.availableYesShares.toNumber()).to.equal(new BN(0.005076013 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.totalYesShares.toNumber()).to.equal(new BN(0.027274748 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.availableNoShares.toNumber()).to.equal(new BN(0.0199 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.totalNoShares.toNumber()).to.equal(new BN(0.027274748 * LAMPORTS_PER_SOL).toNumber());

                let shareState = await program.account.share.fetch(twoPercentFeeMarketShareKeypair.publicKey);
                expect(shareState.market.toBase58()).to.equal(twoPercentFeeMarketKeypair.publicKey.toBase58());
                expect(shareState.authority.toBase58()).to.equal(user.publicKey.toBase58());
                expect(shareState.liquidityClaimed).to.be.false;
                expect(shareState.yesSharesClaimed).to.be.false;
                expect(shareState.noSharesClaimed).to.be.false;
                expect(shareState.liquidityShares.toNumber()).to.equal(new BN(0.01005050505050505 * LAMPORTS_PER_SOL).toNumber());
                expect(shareState.claimedLiquidityFees.toNumber()).to.equal(new BN(0.000201011 * LAMPORTS_PER_SOL).toNumber());
                expect(shareState.yesShares.toNumber()).to.equal(new BN(0.022198735 * LAMPORTS_PER_SOL).toNumber());
                expect(shareState.noShares.toNumber()).to.equal(new BN(0.007374748 * LAMPORTS_PER_SOL).toNumber());
            });

            it('should sell yes outcome shares', async () => {
                const user = programProvider.wallet;

                await program.methods
                    .sellOutcomeShares({yes: {}}, new BN(0.01 * LAMPORTS_PER_SOL), new BN(0.015537663 * LAMPORTS_PER_SOL))
                    .accounts({
                        authority: user.publicKey,
                        share: twoPercentFeeMarketShareKeypair.publicKey,
                        market: twoPercentFeeMarketKeypair.publicKey,
                    })
                    .signers([])
                    .rpc();

                let marketState = await program.account.market.fetch(twoPercentFeeMarketKeypair.publicKey);
                expect(marketState.feesPoolWeight.toNumber()).to.equal(new BN(0.000401011 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.balance.toNumber()).to.equal(new BN(0.017074748 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.liquidity.toNumber()).to.equal(new BN(0.01005050505050505 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.volume.toNumber()).to.equal(new BN(0.04 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.availableShares.toNumber()).to.equal(new BN(0.020113676 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.availableYesShares.toNumber()).to.equal(new BN(0.010413676 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.totalYesShares.toNumber()).to.equal(new BN(0.017074748 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.availableNoShares.toNumber()).to.equal(new BN(0.0097 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.totalNoShares.toNumber()).to.equal(new BN(0.017074748 * LAMPORTS_PER_SOL).toNumber());

                let shareState = await program.account.share.fetch(twoPercentFeeMarketShareKeypair.publicKey);
                expect(shareState.market.toBase58()).to.equal(twoPercentFeeMarketKeypair.publicKey.toBase58());
                expect(shareState.authority.toBase58()).to.equal(user.publicKey.toBase58());
                expect(shareState.liquidityClaimed).to.be.false;
                expect(shareState.yesSharesClaimed).to.be.false;
                expect(shareState.noSharesClaimed).to.be.false;
                expect(shareState.liquidityShares.toNumber()).to.equal(new BN(0.01005050505050505 * LAMPORTS_PER_SOL).toNumber());
                expect(shareState.claimedLiquidityFees.toNumber()).to.equal(new BN(0.000201011 * LAMPORTS_PER_SOL).toNumber());
                expect(shareState.yesShares.toNumber()).to.equal(new BN(0.006661072 * LAMPORTS_PER_SOL).toNumber());
                expect(shareState.noShares.toNumber()).to.equal(new BN(0.007374748 * LAMPORTS_PER_SOL).toNumber());
            });
        });

    });

    context('Market with 2% fee when amount 1', async () => {
        let twoPercentFeeMarketKeypair;
        let twoPercentFeeMarketShareKeypair;

        context('Market Creation', async () => {
            it('should create a market', async () => {
                twoPercentFeeMarketKeypair = anchor.web3.Keypair.generate();
                const creator = programProvider.wallet;

                const expiresAt = DateTime.now().plus({days: 1});

                await program.methods
                    .createMarket(
                        "market 1",
                        "about the market",
                        "market category",
                        "https://picsum.photos/id/1002/200/300.jpg",
                        2.0,
                        "resolution source",
                        "resolver",
                        new BN(expiresAt.toUnixInteger()),
                        "expected",
                        "=")
                    .accounts({
                        creator: creator.publicKey,
                        market: twoPercentFeeMarketKeypair.publicKey,
                    })
                    .signers([twoPercentFeeMarketKeypair])
                    .rpc();

                let marketState = await program.account.market.fetch(twoPercentFeeMarketKeypair.publicKey);

                expect(marketState.creator.toBase58()).to.equal(creator.publicKey.toBase58())
                expect(marketState.state).to.eql({open: {}});

                /*                let createdAround = Interval.fromDateTimes(DateTime.now().minus({minutes: 3}), DateTime.now());
                                let createdAt = DateTime.fromSeconds(marketState.createdAt.toNumber());
                                expect(createdAround.contains(createdAt)).to.be.true;*/

                expect(marketState.expiresAt.toNumber()).to.equal(expiresAt.toUnixInteger());
                expect(marketState.name).to.equal("market 1");
                expect(marketState.about).to.equal("about the market");
                expect(marketState.category).to.equal("market category");
                expect(marketState.imageUrl).to.equal("https://picsum.photos/id/1002/200/300.jpg");
                expect(marketState.resolutionSource).to.equal("resolution source");
                expect(marketState.resolver).to.equal("resolver");
                expect(marketState.expectedValue).to.equal("expected");
                expect(marketState.resolutionOperator).to.equal("=");
                expect(marketState.feePercentage).to.equal(2.0);
                expect(marketState.feesPoolWeight.toNumber()).to.equal(new BN(0).toNumber());
                expect(marketState.balance.toNumber()).to.equal(new BN(0).toNumber());
                expect(marketState.liquidity.toNumber()).to.equal(new BN(0).toNumber());
                expect(marketState.volume.toNumber()).to.equal(new BN(0).toNumber());
                expect(marketState.availableShares.toNumber()).to.equal(new BN(0).toNumber());
                expect(marketState.availableYesShares.toNumber()).to.equal(new BN(0).toNumber());
                expect(marketState.totalYesShares.toNumber()).to.equal(new BN(0).toNumber());
                expect(marketState.availableNoShares.toNumber()).to.equal(new BN(0).toNumber());
                expect(marketState.totalNoShares.toNumber()).to.equal(new BN(0).toNumber());
            });

            it('should init share for user', async () => {
                twoPercentFeeMarketShareKeypair = anchor.web3.Keypair.generate();
                const user = programProvider.wallet;

                await program.methods
                    .initShare()
                    .accounts({
                        share: twoPercentFeeMarketShareKeypair.publicKey,
                        market: twoPercentFeeMarketKeypair.publicKey,
                        authority: user.publicKey,
                    })
                    .signers([twoPercentFeeMarketShareKeypair])
                    .rpc();

                let shareState = await program.account.share.fetch(twoPercentFeeMarketShareKeypair.publicKey);
                expect(shareState.market.toBase58()).to.equal(twoPercentFeeMarketKeypair.publicKey.toBase58());
                expect(shareState.authority.toBase58()).to.equal(user.publicKey.toBase58());
                expect(shareState.liquidityClaimed).to.be.false;
                expect(shareState.yesSharesClaimed).to.be.false;
                expect(shareState.noSharesClaimed).to.be.false;
                expect(shareState.liquidityShares.toNumber()).to.equal(0);
                expect(shareState.claimedLiquidityFees.toNumber()).to.equal(new BN(0).toNumber());
                expect(shareState.yesShares.toNumber()).to.equal(0);
                expect(shareState.noShares.toNumber()).to.equal(0);
            });

            it('should add liquidity for newly created market', async () => {
                const user = programProvider.wallet;

                await program.methods
                    .addLiquidity(new BN(1 * LAMPORTS_PER_SOL))
                    .accounts({
                        authority: user.publicKey,
                        share: twoPercentFeeMarketShareKeypair.publicKey,
                        market: twoPercentFeeMarketKeypair.publicKey,
                    })
                    .signers([])
                    .rpc();

                let marketState = await program.account.market.fetch(twoPercentFeeMarketKeypair.publicKey);
                expect(marketState.feesPoolWeight.toNumber()).to.equal(new BN(0).toNumber());
                expect(marketState.balance.toNumber()).to.equal(new BN(1 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.liquidity.toNumber()).to.equal(new BN(1 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.volume.toNumber()).to.equal(new BN(1 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.availableShares.toNumber()).to.equal(new BN(2 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.availableYesShares.toNumber()).to.equal(new BN(1 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.totalYesShares.toNumber()).to.equal(new BN(1 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.availableNoShares.toNumber()).to.equal(new BN(1 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.totalNoShares.toNumber()).to.equal(new BN(1 * LAMPORTS_PER_SOL).toNumber());

                let shareState = await program.account.share.fetch(twoPercentFeeMarketShareKeypair.publicKey);
                expect(shareState.market.toBase58()).to.equal(twoPercentFeeMarketKeypair.publicKey.toBase58());
                expect(shareState.authority.toBase58()).to.equal(user.publicKey.toBase58());
                expect(shareState.liquidityClaimed).to.be.false;
                expect(shareState.yesSharesClaimed).to.be.false;
                expect(shareState.noSharesClaimed).to.be.false;
                expect(shareState.liquidityShares.toNumber()).to.equal(new BN(1 * LAMPORTS_PER_SOL).toNumber());
                expect(shareState.claimedLiquidityFees.toNumber()).to.equal(new BN(0).toNumber());
                expect(shareState.yesShares.toNumber()).to.equal(0);
                expect(shareState.noShares.toNumber()).to.equal(0);
            });

        });

        context('Market Interaction - Balanced Market (Same Outcome Odds)', async () => {
            it('should wait to avoid "This transaction has already been processed" error', async () => {
                await sleep(500);
            });

            it('should add liquidity without changing shares balance', async () => {
                const user = programProvider.wallet;

                await program.methods
                    .addLiquidity(new BN(1 * LAMPORTS_PER_SOL))
                    .accounts({
                        authority: user.publicKey,
                        share: twoPercentFeeMarketShareKeypair.publicKey,
                        market: twoPercentFeeMarketKeypair.publicKey,
                    })
                    .signers([])
                    .rpc();

                let marketState = await program.account.market.fetch(twoPercentFeeMarketKeypair.publicKey);
                expect(marketState.feesPoolWeight.toNumber()).to.equal(new BN(0).toNumber());
                expect(marketState.balance.toNumber()).to.equal(new BN( 2 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.liquidity.toNumber()).to.equal(new BN(2 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.volume.toNumber()).to.equal(new BN(2 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.availableShares.toNumber()).to.equal(new BN(4 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.availableYesShares.toNumber()).to.equal(new BN(2 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.totalYesShares.toNumber()).to.equal(new BN(2 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.availableNoShares.toNumber()).to.equal(new BN(2 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.totalNoShares.toNumber()).to.equal(new BN(2 * LAMPORTS_PER_SOL).toNumber());

                let shareState = await program.account.share.fetch(twoPercentFeeMarketShareKeypair.publicKey);
                expect(shareState.market.toBase58()).to.equal(twoPercentFeeMarketKeypair.publicKey.toBase58());
                expect(shareState.authority.toBase58()).to.equal(user.publicKey.toBase58());
                expect(shareState.liquidityClaimed).to.be.false;
                expect(shareState.yesSharesClaimed).to.be.false;
                expect(shareState.noSharesClaimed).to.be.false;
                expect(shareState.liquidityShares.toNumber()).to.equal(new BN(2 * LAMPORTS_PER_SOL).toNumber());
                expect(shareState.claimedLiquidityFees.toNumber()).to.equal(new BN(0).toNumber());
                expect(shareState.yesShares.toNumber()).to.equal(0);
                expect(shareState.noShares.toNumber()).to.equal(0);
            });

            it('should remove liquidity without changing shares balance', async () => {
                const user = programProvider.wallet;

                await program.methods
                    .removeLiquidity(new BN(1 * LAMPORTS_PER_SOL))
                    .accounts({
                        authority: user.publicKey,
                        share: twoPercentFeeMarketShareKeypair.publicKey,
                        market: twoPercentFeeMarketKeypair.publicKey,
                    })
                    .signers([])
                    .rpc();

                let marketState = await program.account.market.fetch(twoPercentFeeMarketKeypair.publicKey);
                expect(marketState.feesPoolWeight.toNumber()).to.equal(new BN(0).toNumber());
                expect(marketState.balance.toNumber()).to.equal(new BN(1 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.liquidity.toNumber()).to.equal(new BN(1 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.volume.toNumber()).to.equal(new BN(2 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.availableShares.toNumber()).to.equal(new BN(2 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.availableYesShares.toNumber()).to.equal(new BN(1 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.totalYesShares.toNumber()).to.equal(new BN(1 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.availableNoShares.toNumber()).to.equal(new BN(1 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.totalNoShares.toNumber()).to.equal(new BN(1 * LAMPORTS_PER_SOL).toNumber());

                let shareState = await program.account.share.fetch(twoPercentFeeMarketShareKeypair.publicKey);
                expect(shareState.market.toBase58()).to.equal(twoPercentFeeMarketKeypair.publicKey.toBase58());
                expect(shareState.authority.toBase58()).to.equal(user.publicKey.toBase58());
                expect(shareState.liquidityClaimed).to.be.false;
                expect(shareState.yesSharesClaimed).to.be.false;
                expect(shareState.noSharesClaimed).to.be.false;
                expect(shareState.liquidityShares.toNumber()).to.equal(new BN(1 * LAMPORTS_PER_SOL).toNumber());
                expect(shareState.claimedLiquidityFees.toNumber()).to.equal(new BN(0).toNumber());
                expect(shareState.yesShares.toNumber()).to.equal(0);
                expect(shareState.noShares.toNumber()).to.equal(0);
            });
        });

        context('Market Interaction - Unbalanced Market (Different Outcome Odds)', async () => {
            it('should buy yes outcome shares', async () => {
                const user = programProvider.wallet;

                await program.methods
                    .buyOutcomeShares({yes: {}}, new BN(1 * LAMPORTS_PER_SOL), new BN(1.47494949494949 * LAMPORTS_PER_SOL))
                    .accounts({
                        authority: user.publicKey,
                        share: twoPercentFeeMarketShareKeypair.publicKey,
                        market: twoPercentFeeMarketKeypair.publicKey,
                    })
                    .signers([])
                    .rpc();

                let marketState = await program.account.market.fetch(twoPercentFeeMarketKeypair.publicKey);
                expect(marketState.feesPoolWeight.toNumber()).to.equal(new BN(0.02 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.balance.toNumber()).to.equal(new BN(1.98 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.liquidity.toNumber()).to.equal(new BN(1 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.volume.toNumber()).to.equal(new BN(3 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.availableShares.toNumber()).to.equal(new BN(2.485050505 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.availableYesShares.toNumber()).to.equal(new BN(0.505050505 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.totalYesShares.toNumber()).to.equal(new BN(1.98 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.availableNoShares.toNumber()).to.equal(new BN(1.98 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.totalNoShares.toNumber()).to.equal(new BN(1.98 * LAMPORTS_PER_SOL).toNumber());

                let shareState = await program.account.share.fetch(twoPercentFeeMarketShareKeypair.publicKey);
                expect(shareState.market.toBase58()).to.equal(twoPercentFeeMarketKeypair.publicKey.toBase58());
                expect(shareState.authority.toBase58()).to.equal(user.publicKey.toBase58());
                expect(shareState.liquidityClaimed).to.be.false;
                expect(shareState.yesSharesClaimed).to.be.false;
                expect(shareState.noSharesClaimed).to.be.false;
                expect(shareState.liquidityShares.toNumber()).to.equal(new BN(1 * LAMPORTS_PER_SOL).toNumber());
                expect(shareState.claimedLiquidityFees.toNumber()).to.equal(new BN(0).toNumber());
                expect(shareState.yesShares.toNumber()).to.equal(new BN(1.474949495 * LAMPORTS_PER_SOL).toNumber());
                expect(shareState.noShares.toNumber()).to.equal(0);
            });

            it('should add liquidity', async () => {
                const user = programProvider.wallet;

                await program.methods
                    .addLiquidity(new BN(1 * LAMPORTS_PER_SOL))
                    .accounts({
                        authority: user.publicKey,
                        share: twoPercentFeeMarketShareKeypair.publicKey,
                        market: twoPercentFeeMarketKeypair.publicKey,
                    })
                    .signers([])
                    .rpc();

                let marketState = await program.account.market.fetch(twoPercentFeeMarketKeypair.publicKey);
                expect(marketState.feesPoolWeight.toNumber()).to.equal(new BN(0.0301010101010101 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.balance.toNumber()).to.equal(new BN(2.98 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.liquidity.toNumber()).to.equal(new BN(1.505050505050505 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.volume.toNumber()).to.equal(new BN(4 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.availableShares.toNumber()).to.equal(new BN(3.740126517 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.availableYesShares.toNumber()).to.equal(new BN(0.7601265177022754 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.totalYesShares.toNumber()).to.equal(new BN(2.98 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.availableNoShares.toNumber()).to.equal(new BN(2.98 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.totalNoShares.toNumber()).to.equal(new BN(2.98 * LAMPORTS_PER_SOL).toNumber());

                let shareState = await program.account.share.fetch(twoPercentFeeMarketShareKeypair.publicKey);
                expect(shareState.market.toBase58()).to.equal(twoPercentFeeMarketKeypair.publicKey.toBase58());
                expect(shareState.authority.toBase58()).to.equal(user.publicKey.toBase58());
                expect(shareState.liquidityClaimed).to.be.false;
                expect(shareState.yesSharesClaimed).to.be.false;
                expect(shareState.noSharesClaimed).to.be.false;
                expect(shareState.liquidityShares.toNumber()).to.equal(new BN(1.505050505 * LAMPORTS_PER_SOL).toNumber());
                expect(shareState.claimedLiquidityFees.toNumber()).to.equal(new BN(0.010101010 * LAMPORTS_PER_SOL).toNumber());
                expect(shareState.yesShares.toNumber()).to.equal(new BN(2.219873483 * LAMPORTS_PER_SOL).toNumber());
                expect(shareState.noShares.toNumber()).to.equal(0);
            });

            it('should remove liquidity', async () => {
                const user = programProvider.wallet;

                await program.methods
                    .claimLiquidityFees()
                    .accounts({
                        authority: user.publicKey,
                        share: twoPercentFeeMarketShareKeypair.publicKey,
                        market: twoPercentFeeMarketKeypair.publicKey,
                    })
                    .signers([])
                    .rpc();

                await program.methods
                    .removeLiquidity(new BN(0.005 * LAMPORTS_PER_SOL))
                    .accounts({
                        authority: user.publicKey,
                        share: twoPercentFeeMarketShareKeypair.publicKey,
                        market: twoPercentFeeMarketKeypair.publicKey,
                    })
                    .signers([])
                    .rpc();

                let marketState = await program.account.market.fetch(twoPercentFeeMarketKeypair.publicKey);
                expect(marketState.feesPoolWeight.toNumber()).to.equal(new BN(0.030001011 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.balance.toNumber()).to.equal(new BN(2.977474748 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.liquidity.toNumber()).to.equal(new BN(1.5000505050505049 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.volume.toNumber()).to.equal(new BN(4 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.availableShares.toNumber()).to.equal(new BN(3.727701265177023 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.availableYesShares.toNumber()).to.equal(new BN(0.7576012651770228 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.totalYesShares.toNumber()).to.equal(new BN(2.977474748 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.availableNoShares.toNumber()).to.equal(new BN(2.9701 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.totalNoShares.toNumber()).to.equal(new BN(2.977474748 * LAMPORTS_PER_SOL).toNumber());

                let shareState = await program.account.share.fetch(twoPercentFeeMarketShareKeypair.publicKey);
                expect(shareState.market.toBase58()).to.equal(twoPercentFeeMarketKeypair.publicKey.toBase58());
                expect(shareState.authority.toBase58()).to.equal(user.publicKey.toBase58());
                expect(shareState.liquidityClaimed).to.be.false;
                expect(shareState.yesSharesClaimed).to.be.false;
                expect(shareState.noSharesClaimed).to.be.false;
                expect(shareState.liquidityShares.toNumber()).to.equal(new BN(1.5000505050505049 * LAMPORTS_PER_SOL).toNumber());
                expect(shareState.claimedLiquidityFees.toNumber()).to.equal(new BN(0.030001011 * LAMPORTS_PER_SOL).toNumber());
                expect(shareState.yesShares.toNumber()).to.equal(new BN(2.219873483 * LAMPORTS_PER_SOL).toNumber());
                expect(shareState.noShares.toNumber()).to.equal(new BN(0.007374748 * LAMPORTS_PER_SOL).toNumber());
            });

            it('should sell yes outcome shares', async () => {
                const user = programProvider.wallet;

                await program.methods
                    .sellOutcomeShares({yes: {}}, new BN(1 * LAMPORTS_PER_SOL), new BN(1.416263417 * LAMPORTS_PER_SOL))
                    .accounts({
                        authority: user.publicKey,
                        share: twoPercentFeeMarketShareKeypair.publicKey,
                        market: twoPercentFeeMarketKeypair.publicKey,
                    })
                    .signers([])
                    .rpc();

                let marketState = await program.account.market.fetch(twoPercentFeeMarketKeypair.publicKey);
                expect(marketState.feesPoolWeight.toNumber()).to.equal(new BN(0.050001011 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.balance.toNumber()).to.equal(new BN(1.957474748 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.liquidity.toNumber()).to.equal(new BN(1.5000505050505049 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.volume.toNumber()).to.equal(new BN(4 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.availableShares.toNumber()).to.equal(new BN(3.103964682 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.availableYesShares.toNumber()).to.equal(new BN(1.153864682 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.totalYesShares.toNumber()).to.equal(new BN(1.957474748 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.availableNoShares.toNumber()).to.equal(new BN(1.950100000 * LAMPORTS_PER_SOL).toNumber());
                expect(marketState.totalNoShares.toNumber()).to.equal(new BN(1.957474748 * LAMPORTS_PER_SOL).toNumber());

                let shareState = await program.account.share.fetch(twoPercentFeeMarketShareKeypair.publicKey);
                expect(shareState.market.toBase58()).to.equal(twoPercentFeeMarketKeypair.publicKey.toBase58());
                expect(shareState.authority.toBase58()).to.equal(user.publicKey.toBase58());
                expect(shareState.liquidityClaimed).to.be.false;
                expect(shareState.yesSharesClaimed).to.be.false;
                expect(shareState.noSharesClaimed).to.be.false;
                expect(shareState.liquidityShares.toNumber()).to.equal(new BN(1.5000505050505049 * LAMPORTS_PER_SOL).toNumber());
                expect(shareState.claimedLiquidityFees.toNumber()).to.equal(new BN(0.030001011 * LAMPORTS_PER_SOL).toNumber());
                expect(shareState.yesShares.toNumber()).to.equal(new BN(0.803610066 * LAMPORTS_PER_SOL).toNumber());
                expect(shareState.noShares.toNumber()).to.equal(new BN(0.007374748 * LAMPORTS_PER_SOL).toNumber());
            });
        });

    });

});
