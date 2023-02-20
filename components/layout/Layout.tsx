import React from "react";
import Head from "next/head";
import Header from "./header/Header";
import Footer from "./footer/Footer";
import SnackbarComponent from "../common/SnackBar";
import { MessageBar } from "./MessageBar";

type LayoutProps = {
  children?: React.ReactNode;
};

const Layout: React.FC = ({ children }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>Omni-X Marketplace</title>
        <meta name='viewport' content='width=device-width, initial-scale=1, maximum-scale=1' />
      </Head>
      <SnackbarComponent />
      <main className='w-full flex flex-col'>
        <Header />
        <MessageBar />
        <div className={"pt-[72px] pb-[62px] px-[42px] lg:px-[52px] bg-primary"}>{children}</div>
        <Footer />
      </main>
    </>
  );
};

export default Layout;
