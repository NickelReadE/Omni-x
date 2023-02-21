import { Alchemy } from "alchemy-sdk";
import { BigNumber, ethers } from "ethers";
import { arbitrumSettings, CHAIN_IDS, optimismSettings, ethSettings, mumbaiSettings, getDecimalsByAddress } from "../utils/constants";
import { USDC_ADDRESS, USDT_ADDRESS } from "../utils/constants/addresses";
import { CHAIN_TYPE } from "../types/enum";

const ethereumAlchemy = new Alchemy(ethSettings);
const mumbaiAlchemy = new Alchemy(mumbaiSettings);
const arbitrumAlchemy = new Alchemy(arbitrumSettings);
const optimismAlchemy = new Alchemy(optimismSettings);

const getERC20BalanceFromNetwork = async (address: string, alchemyInstance: Alchemy, chainId: number) => {
  const balances = { usdc: 0, usdt: 0, chainId: chainId };
  try {
    const balance = await alchemyInstance.core.getTokenBalances(
      address,
      [USDC_ADDRESS[chainId], USDT_ADDRESS[chainId]].filter((item) => item !== "")
    );

    if (balance && balance.tokenBalances.length > 0) {
      for (const tokenBalance of balance.tokenBalances) {
        const decimal = getDecimalsByAddress(chainId, tokenBalance.contractAddress);
        const formattedBalance = Number(ethers.utils.formatUnits(BigNumber.from(tokenBalance.tokenBalance), decimal));
        if (tokenBalance.contractAddress === USDC_ADDRESS[chainId]) {
          balances.usdc = formattedBalance;
        } else if (tokenBalance.contractAddress === USDT_ADDRESS[chainId]) {
          balances.usdt = formattedBalance;
        }
      }
    }
  } catch (e) {
    console.error(e);
  }
  return balances;
};

export const getERC20Balances = async (address: string) => {
  const ethBalances = await getERC20BalanceFromNetwork(address, ethereumAlchemy, CHAIN_IDS[CHAIN_TYPE.GOERLI]);
  const mumbaiBalances = await getERC20BalanceFromNetwork(address, mumbaiAlchemy, CHAIN_IDS[CHAIN_TYPE.MUMBAI]);
  const arbBalances = await getERC20BalanceFromNetwork(address, arbitrumAlchemy, CHAIN_IDS[CHAIN_TYPE.ARB_TESTNET]);
  const optBalances = await getERC20BalanceFromNetwork(address, optimismAlchemy, CHAIN_IDS[CHAIN_TYPE.OPT_TESTNET]);

  return [ethBalances, mumbaiBalances, arbBalances, optBalances];
};
