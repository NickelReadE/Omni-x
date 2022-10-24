export enum SupportedChainId {
    RINKEBY = 10001   
}

export enum ChainIds {
    ETHEREUM = 5, // 1
    BINANCE = 97, // 56
    AVALANCHE = 43113,
    POLYGON = 80001,
    ARBITRUM = 421613,
    OPTIMISM = 420,
    FANTOM = 4002,
    APTOS = 2222,    // should be fixed later
}

export enum SaleType {
    FIXED = 1,
    AUCTION = 2,
}

export enum ListingStep {
    StepListing = 1,
    StepApprove = 2,
    StepConfirm = 3,
    StepDone = 4,
    StepFail = 5,
}

export enum BuyStep {
    StepBuy = 1,
    StepApprove = 2,
    StepConfirm = 3,
    StepComplete = 4,
    StepDone = 4,
    StepFail = 5,
}

export enum BidStep {
    StepBid = 1,
    StepApprove = 2,
    StepConfirm = 3,
    StepDone = 4,
    StepFail = 5,
}