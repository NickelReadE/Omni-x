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

export enum CHAIN_TYPE {
    GOERLI = 'goerli',
    BSC_TESTNET = 'bsc testnet',
    MUMBAI = 'mumbai',
    FUJI_TESTNET = 'avalanche testnet',
    OPT_TESTNET = 'optimism',
    ARB_TESTNET = 'arbitrum',
    FANTOM_TESTNET = 'fantom-testnet',
    MOONBEAM_ALPHA = 'moonbeam-alpha',

    ETHEREUM = 'ethereum',
    BINANCE = 'binance',
    POLYGON = 'polygon',
    AVALANCHE = 'avalanche',
    ARBITRUM = 'arbitrum-mainnet',
    OPTIMISM = 'optimism-mainnet',
    FANTOM = 'fantom',

    APTOS = 'aptos'
}

export enum SaleType {
    FIXED = 1,
    AUCTION = 2,
}

export enum ListingStep {
    StepListing = 1,
    StepCheckNetwork,
    StepApprove,
    StepConfirm,
    StepDone,
    StepFail,
}

export enum BuyStep {
    StepBuy = 1,
    StepApprove,
    StepConfirm,
    StepComplete,
    StepDone,
    StepFail,
}

export enum BidStep {
    StepBid = 1,
    StepApprove,
    StepConfirm,
    StepDone,
    StepFail,
}

export enum AcceptStep {
    StepAccept = 1,
    StepCheckNetwork,
    StepApprove,
    StepConfirm,
    StepComplete,
    StepDone,
    StepFail,
}

export enum USER_ACTIVITY_TYPE {
    Transfer,
    Send,
    Buy,
    Sell,
    List,
    Bid,
}
