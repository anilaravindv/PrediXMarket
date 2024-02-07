export type Marketplace = {
  "version": "0.1.0",
  "name": "marketplace",
  "instructions": [
    {
      "name": "createMarket",
      "accounts": [
        {
          "name": "market",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "creator",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "about",
          "type": "string"
        },
        {
          "name": "category",
          "type": "string"
        },
        {
          "name": "imageUrl",
          "type": "string"
        },
        {
          "name": "feePercentage",
          "type": "f64"
        },
        {
          "name": "resolutionSource",
          "type": "string"
        },
        {
          "name": "resolver",
          "type": "string"
        },
        {
          "name": "expiresAt",
          "type": "i64"
        },
        {
          "name": "expectedValue",
          "type": "string"
        },
        {
          "name": "resolutionOperator",
          "type": "string"
        }
      ]
    },
    {
      "name": "initShare",
      "accounts": [
        {
          "name": "share",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "addLiquidity",
      "accounts": [
        {
          "name": "share",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "removeLiquidity",
      "accounts": [
        {
          "name": "share",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "buyOutcomeShares",
      "accounts": [
        {
          "name": "share",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "outcome",
          "type": {
            "defined": "Outcome"
          }
        },
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "minOutcomeSharesToBuy",
          "type": "u64"
        }
      ]
    },
    {
      "name": "sellOutcomeShares",
      "accounts": [
        {
          "name": "share",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "outcome",
          "type": {
            "defined": "Outcome"
          }
        },
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "maxOutcomeSharesToSell",
          "type": "u64"
        }
      ]
    },
    {
      "name": "deleteMarket",
      "accounts": [
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "creator",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "closeMarketWithPyth",
      "accounts": [
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "priceAccount",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "closeMarketWithAnswer",
      "accounts": [
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "outcome",
          "type": {
            "defined": "Outcome"
          }
        }
      ]
    },
    {
      "name": "claimWinnings",
      "accounts": [
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "share",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "claimLiquidity",
      "accounts": [
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "share",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "claimLiquidityFees",
      "accounts": [
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "share",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "isAdmin",
      "accounts": [],
      "args": [
        {
          "name": "userPubKey",
          "type": "string"
        }
      ],
      "returns": "bool"
    }
  ],
  "accounts": [
    {
      "name": "market",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "creator",
            "type": "publicKey"
          },
          {
            "name": "state",
            "type": {
              "defined": "MarketState"
            }
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "expiresAt",
            "type": "i64"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "about",
            "type": "string"
          },
          {
            "name": "category",
            "type": "string"
          },
          {
            "name": "imageUrl",
            "type": "string"
          },
          {
            "name": "feePercentage",
            "type": "f64"
          },
          {
            "name": "feesPoolWeight",
            "type": "u64"
          },
          {
            "name": "balance",
            "type": "u64"
          },
          {
            "name": "liquidity",
            "type": "u64"
          },
          {
            "name": "volume",
            "type": "u64"
          },
          {
            "name": "availableShares",
            "type": "u64"
          },
          {
            "name": "availableYesShares",
            "type": "u64"
          },
          {
            "name": "availableNoShares",
            "type": "u64"
          },
          {
            "name": "totalYesShares",
            "type": "u64"
          },
          {
            "name": "totalNoShares",
            "type": "u64"
          },
          {
            "name": "resolutionSource",
            "type": "string"
          },
          {
            "name": "resolver",
            "type": "string"
          },
          {
            "name": "expectedValue",
            "type": "string"
          },
          {
            "name": "resolutionOperator",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "share",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "market",
            "type": "publicKey"
          },
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "liquidityClaimed",
            "type": "bool"
          },
          {
            "name": "yesSharesClaimed",
            "type": "bool"
          },
          {
            "name": "noSharesClaimed",
            "type": "bool"
          },
          {
            "name": "liquidityShares",
            "type": "u64"
          },
          {
            "name": "claimedLiquidityFees",
            "type": "u64"
          },
          {
            "name": "yesShares",
            "type": "u64"
          },
          {
            "name": "noShares",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "ShareError",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "NotOwnedByAuthority"
          },
          {
            "name": "NotOwnedByMarket"
          },
          {
            "name": "InsufficientLiquidityShares"
          },
          {
            "name": "InsufficientOutcomeShares"
          },
          {
            "name": "NoLiquidityShares"
          },
          {
            "name": "AlreadyClaimedLiquidityWinnings"
          },
          {
            "name": "NoResolvedOutcomeShares"
          },
          {
            "name": "AlreadyClaimedOutcomeWinnings"
          }
        ]
      }
    },
    {
      "name": "Outcome",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Yes"
          },
          {
            "name": "No"
          }
        ]
      }
    },
    {
      "name": "MarketState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Open"
          },
          {
            "name": "Resolved",
            "fields": [
              {
                "name": "outcome",
                "type": {
                  "defined": "Outcome"
                }
              }
            ]
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "MarketCreated",
      "fields": [
        {
          "name": "market",
          "type": "publicKey",
          "index": true
        },
        {
          "name": "user",
          "type": "publicKey",
          "index": true
        },
        {
          "name": "timestamp",
          "type": "i64",
          "index": true
        }
      ]
    },
    {
      "name": "MarketResolved",
      "fields": [
        {
          "name": "market",
          "type": "publicKey",
          "index": true
        },
        {
          "name": "user",
          "type": "publicKey",
          "index": true
        },
        {
          "name": "timestamp",
          "type": "i64",
          "index": true
        }
      ]
    },
    {
      "name": "MarketLiquidity",
      "fields": [
        {
          "name": "market",
          "type": "publicKey",
          "index": true
        },
        {
          "name": "liquidity",
          "type": "u64",
          "index": false
        },
        {
          "name": "liquidityPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "timestamp",
          "type": "i64",
          "index": true
        }
      ]
    },
    {
      "name": "MarketOutcomePrice",
      "fields": [
        {
          "name": "market",
          "type": "publicKey",
          "index": true
        },
        {
          "name": "yesOutcomePrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "noOutcomePrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "timestamp",
          "type": "i64",
          "index": true
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "ForbiddenOperation",
      "msg": "Forbidden operation"
    },
    {
      "code": 6001,
      "name": "MarketNotOpen",
      "msg": "Market not open"
    },
    {
      "code": 6002,
      "name": "MarketNotResolved",
      "msg": "Market not resolved"
    },
    {
      "code": 6003,
      "name": "MarketExpired",
      "msg": "Market expired"
    },
    {
      "code": 6004,
      "name": "NameTooLong",
      "msg": "The provided market name should be 200 characters long maximum"
    },
    {
      "code": 6005,
      "name": "AboutTooLong",
      "msg": "The provided market about text should be 200 characters long maximum"
    },
    {
      "code": 6006,
      "name": "CategoryTooLong",
      "msg": "The provided market category should be 50 characters long maximum"
    },
    {
      "code": 6007,
      "name": "ImageUrlTooLong",
      "msg": "The provided market about text should be 200 characters long maximum"
    },
    {
      "code": 6008,
      "name": "ResolutionSourceTooLong",
      "msg": "The provided market resolution source should be 250 characters long maximum"
    },
    {
      "code": 6009,
      "name": "ResolverTooLong",
      "msg": "The provided market resolver should be 50 characters long maximum"
    },
    {
      "code": 6010,
      "name": "ExpectedValueTooLong",
      "msg": "The provided market expected value should be 50 characters long maximum"
    },
    {
      "code": 6011,
      "name": "ResolutionOperatorTooLong",
      "msg": "The provided market resolution operator should be 5 characters long maximum"
    },
    {
      "code": 6012,
      "name": "InsufficientAmount",
      "msg": "Given amount not sufficient for the operation"
    },
    {
      "code": 6013,
      "name": "InsufficientBalance",
      "msg": "The provided market does not have sufficient balance"
    },
    {
      "code": 6014,
      "name": "InsufficientAvailableOutcomeShares",
      "msg": "Market does not have sufficient available outcome share balance"
    },
    {
      "code": 6015,
      "name": "MinBuyAmountNotReached",
      "msg": "Minimum buy amount not reached"
    },
    {
      "code": 6016,
      "name": "MaxSellAmountExceeded",
      "msg": "Maximum sell amount exceeded"
    },
    {
      "code": 6017,
      "name": "SharesToSellIsZero",
      "msg": "Shares to ell is zero"
    },
    {
      "code": 6018,
      "name": "EndingOutcomeBalanceMustBeNonZero",
      "msg": "Ending outcome must have non-zero balances"
    },
    {
      "code": 6019,
      "name": "MismatchMarketResolver",
      "msg": "Provided resolver does not match with market resolver"
    },
    {
      "code": 6020,
      "name": "MismatchMarketPythPriceAccount",
      "msg": "Provided pyth account does not match with market pyth price account"
    },
    {
      "code": 6021,
      "name": "MismatchMarketExpectedValue",
      "msg": "Invalid market expected value"
    }
  ]
};

export const IDL: Marketplace = {
  "version": "0.1.0",
  "name": "marketplace",
  "instructions": [
    {
      "name": "createMarket",
      "accounts": [
        {
          "name": "market",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "creator",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "about",
          "type": "string"
        },
        {
          "name": "category",
          "type": "string"
        },
        {
          "name": "imageUrl",
          "type": "string"
        },
        {
          "name": "feePercentage",
          "type": "f64"
        },
        {
          "name": "resolutionSource",
          "type": "string"
        },
        {
          "name": "resolver",
          "type": "string"
        },
        {
          "name": "expiresAt",
          "type": "i64"
        },
        {
          "name": "expectedValue",
          "type": "string"
        },
        {
          "name": "resolutionOperator",
          "type": "string"
        }
      ]
    },
    {
      "name": "initShare",
      "accounts": [
        {
          "name": "share",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "addLiquidity",
      "accounts": [
        {
          "name": "share",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "removeLiquidity",
      "accounts": [
        {
          "name": "share",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "buyOutcomeShares",
      "accounts": [
        {
          "name": "share",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "outcome",
          "type": {
            "defined": "Outcome"
          }
        },
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "minOutcomeSharesToBuy",
          "type": "u64"
        }
      ]
    },
    {
      "name": "sellOutcomeShares",
      "accounts": [
        {
          "name": "share",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "outcome",
          "type": {
            "defined": "Outcome"
          }
        },
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "maxOutcomeSharesToSell",
          "type": "u64"
        }
      ]
    },
    {
      "name": "deleteMarket",
      "accounts": [
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "creator",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "closeMarketWithPyth",
      "accounts": [
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "priceAccount",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "closeMarketWithAnswer",
      "accounts": [
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "outcome",
          "type": {
            "defined": "Outcome"
          }
        }
      ]
    },
    {
      "name": "claimWinnings",
      "accounts": [
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "share",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "claimLiquidity",
      "accounts": [
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "share",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "claimLiquidityFees",
      "accounts": [
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "share",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "isAdmin",
      "accounts": [],
      "args": [
        {
          "name": "userPubKey",
          "type": "string"
        }
      ],
      "returns": "bool"
    }
  ],
  "accounts": [
    {
      "name": "market",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "creator",
            "type": "publicKey"
          },
          {
            "name": "state",
            "type": {
              "defined": "MarketState"
            }
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "expiresAt",
            "type": "i64"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "about",
            "type": "string"
          },
          {
            "name": "category",
            "type": "string"
          },
          {
            "name": "imageUrl",
            "type": "string"
          },
          {
            "name": "feePercentage",
            "type": "f64"
          },
          {
            "name": "feesPoolWeight",
            "type": "u64"
          },
          {
            "name": "balance",
            "type": "u64"
          },
          {
            "name": "liquidity",
            "type": "u64"
          },
          {
            "name": "volume",
            "type": "u64"
          },
          {
            "name": "availableShares",
            "type": "u64"
          },
          {
            "name": "availableYesShares",
            "type": "u64"
          },
          {
            "name": "availableNoShares",
            "type": "u64"
          },
          {
            "name": "totalYesShares",
            "type": "u64"
          },
          {
            "name": "totalNoShares",
            "type": "u64"
          },
          {
            "name": "resolutionSource",
            "type": "string"
          },
          {
            "name": "resolver",
            "type": "string"
          },
          {
            "name": "expectedValue",
            "type": "string"
          },
          {
            "name": "resolutionOperator",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "share",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "market",
            "type": "publicKey"
          },
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "liquidityClaimed",
            "type": "bool"
          },
          {
            "name": "yesSharesClaimed",
            "type": "bool"
          },
          {
            "name": "noSharesClaimed",
            "type": "bool"
          },
          {
            "name": "liquidityShares",
            "type": "u64"
          },
          {
            "name": "claimedLiquidityFees",
            "type": "u64"
          },
          {
            "name": "yesShares",
            "type": "u64"
          },
          {
            "name": "noShares",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "ShareError",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "NotOwnedByAuthority"
          },
          {
            "name": "NotOwnedByMarket"
          },
          {
            "name": "InsufficientLiquidityShares"
          },
          {
            "name": "InsufficientOutcomeShares"
          },
          {
            "name": "NoLiquidityShares"
          },
          {
            "name": "AlreadyClaimedLiquidityWinnings"
          },
          {
            "name": "NoResolvedOutcomeShares"
          },
          {
            "name": "AlreadyClaimedOutcomeWinnings"
          }
        ]
      }
    },
    {
      "name": "Outcome",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Yes"
          },
          {
            "name": "No"
          }
        ]
      }
    },
    {
      "name": "MarketState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Open"
          },
          {
            "name": "Resolved",
            "fields": [
              {
                "name": "outcome",
                "type": {
                  "defined": "Outcome"
                }
              }
            ]
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "MarketCreated",
      "fields": [
        {
          "name": "market",
          "type": "publicKey",
          "index": true
        },
        {
          "name": "user",
          "type": "publicKey",
          "index": true
        },
        {
          "name": "timestamp",
          "type": "i64",
          "index": true
        }
      ]
    },
    {
      "name": "MarketResolved",
      "fields": [
        {
          "name": "market",
          "type": "publicKey",
          "index": true
        },
        {
          "name": "user",
          "type": "publicKey",
          "index": true
        },
        {
          "name": "timestamp",
          "type": "i64",
          "index": true
        }
      ]
    },
    {
      "name": "MarketLiquidity",
      "fields": [
        {
          "name": "market",
          "type": "publicKey",
          "index": true
        },
        {
          "name": "liquidity",
          "type": "u64",
          "index": false
        },
        {
          "name": "liquidityPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "timestamp",
          "type": "i64",
          "index": true
        }
      ]
    },
    {
      "name": "MarketOutcomePrice",
      "fields": [
        {
          "name": "market",
          "type": "publicKey",
          "index": true
        },
        {
          "name": "yesOutcomePrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "noOutcomePrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "timestamp",
          "type": "i64",
          "index": true
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "ForbiddenOperation",
      "msg": "Forbidden operation"
    },
    {
      "code": 6001,
      "name": "MarketNotOpen",
      "msg": "Market not open"
    },
    {
      "code": 6002,
      "name": "MarketNotResolved",
      "msg": "Market not resolved"
    },
    {
      "code": 6003,
      "name": "MarketExpired",
      "msg": "Market expired"
    },
    {
      "code": 6004,
      "name": "NameTooLong",
      "msg": "The provided market name should be 200 characters long maximum"
    },
    {
      "code": 6005,
      "name": "AboutTooLong",
      "msg": "The provided market about text should be 200 characters long maximum"
    },
    {
      "code": 6006,
      "name": "CategoryTooLong",
      "msg": "The provided market category should be 50 characters long maximum"
    },
    {
      "code": 6007,
      "name": "ImageUrlTooLong",
      "msg": "The provided market about text should be 200 characters long maximum"
    },
    {
      "code": 6008,
      "name": "ResolutionSourceTooLong",
      "msg": "The provided market resolution source should be 250 characters long maximum"
    },
    {
      "code": 6009,
      "name": "ResolverTooLong",
      "msg": "The provided market resolver should be 50 characters long maximum"
    },
    {
      "code": 6010,
      "name": "ExpectedValueTooLong",
      "msg": "The provided market expected value should be 50 characters long maximum"
    },
    {
      "code": 6011,
      "name": "ResolutionOperatorTooLong",
      "msg": "The provided market resolution operator should be 5 characters long maximum"
    },
    {
      "code": 6012,
      "name": "InsufficientAmount",
      "msg": "Given amount not sufficient for the operation"
    },
    {
      "code": 6013,
      "name": "InsufficientBalance",
      "msg": "The provided market does not have sufficient balance"
    },
    {
      "code": 6014,
      "name": "InsufficientAvailableOutcomeShares",
      "msg": "Market does not have sufficient available outcome share balance"
    },
    {
      "code": 6015,
      "name": "MinBuyAmountNotReached",
      "msg": "Minimum buy amount not reached"
    },
    {
      "code": 6016,
      "name": "MaxSellAmountExceeded",
      "msg": "Maximum sell amount exceeded"
    },
    {
      "code": 6017,
      "name": "SharesToSellIsZero",
      "msg": "Shares to ell is zero"
    },
    {
      "code": 6018,
      "name": "EndingOutcomeBalanceMustBeNonZero",
      "msg": "Ending outcome must have non-zero balances"
    },
    {
      "code": 6019,
      "name": "MismatchMarketResolver",
      "msg": "Provided resolver does not match with market resolver"
    },
    {
      "code": 6020,
      "name": "MismatchMarketPythPriceAccount",
      "msg": "Provided pyth account does not match with market pyth price account"
    },
    {
      "code": 6021,
      "name": "MismatchMarketExpectedValue",
      "msg": "Invalid market expected value"
    }
  ]
};
