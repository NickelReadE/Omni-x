import React, { useState, useEffect } from "react";
import type { NextPage } from "next";
import useWallet from "../hooks/useWallet";
import MetaMaskConnect from "../components/layout/header/MetaMaskConnect";
import HomeCollections from "../components/home/Collections";
import HomeIntro from "../components/home/Intro";
import { supportChainIDs } from "../utils/constants";
import { HomeFeatured } from "../components/home/Featured";
import { HomeTopCollections } from "../components/home/TopCollections";
import { getETHPrice } from "../utils/helpers";

const Home: NextPage = () => {
  const { chainId, address } = useWallet();
  const [isBlur, setIsBlur] = useState<boolean>(false);
  const [ethPrice, setEthPrice] = useState<number>(0);

  useEffect(() => {
    if (address) {
      setIsBlur(false);
    } else setIsBlur(true);
  }, [address]);

  useEffect(() => {
    if (chainId && supportChainIDs.includes(chainId)) {
      setIsBlur(false);
    } else setIsBlur(true);
  }, [chainId]);

  useEffect(() => {
    (async () => {
      const ethPrice = await getETHPrice();
      setEthPrice(ethPrice);
    })();
  }, []);

  return (
    <>
      {isBlur && <MetaMaskConnect />}
      <HomeIntro />
      <HomeFeatured ethPrice={ethPrice} />
      <HomeTopCollections ethPrice={ethPrice} />
      <HomeCollections ethPrice={ethPrice} />
    </>
  );
};

export default Home;
