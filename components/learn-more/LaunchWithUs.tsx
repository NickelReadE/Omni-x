import { IntroCard } from "./Intro";
import Image from "next/image";
import { PrimaryButton } from "../common/buttons/PrimaryButton";

export default function LearnMoreLaunchWithUs() {
  return (
    <div className='flex justify-center pt-[150px]'>
      <div className={"flex flex-col"}>
        <div className='flex justify-center w-full space-x-2'>
          <span className={"text-xl2 text-primary-light"}>
            <span className={"text-primary-blue italic"}>launch</span> with us
          </span>
        </div>
        <div className='flex w-full mt-12 space-x-12'>
          <div className='flex flex-1 justify-between items-center flex-col'>
            <span className={"text-secondary text-xl text-center"}>
              we did all the hard technical work, so you just need to focus on the art - the Omni X{" "}
              <span className={"text-primary-green"}>launchpad is a simple and curated experience</span> for artists & projects creating new
              collections
            </span>
            <Image src={"/images/learn-more/rocket.svg"} width={240} height={240} alt={"rocket"} />
          </div>
          <div className='flex flex-1 justify-center items-center flex-col space-y-8'>
            <IntroCard title={"ONFT minting"} className={"flex justify-center"}>
              <div className='flex flex-col items-center space-y-4'>
                <span className={"text-secondary text-lg pt-12 text-center"}>
                  all launchpad projects mint omnichain NFT (ONFTs) to enable seameless{" "}
                  <span className={"text-primary-green"}>transfer</span> of assets (and metadata) across blockchains
                </span>
              </div>
            </IntroCard>
            <IntroCard title={"technical expertise"} className={"flex justify-center"}>
              <div className='flex flex-col items-center space-y-4'>
                <span className={"text-secondary text-lg pt-12 text-center"}>
                  we provide <span className={"text-primary-green"}>tailored solutions designed for your needs</span>
                </span>
                <span className={"text-secondary text-lg text-center"}>
                  launching on specific chains, adding metadata, keeping your community up to date, and selling out - we make sure it all
                  happens perfectly
                </span>
                <PrimaryButton text={"apply now!"} className={"text-md font-medium cursor-pointer rounded-full h-[32px] w-[124px]"} />
              </div>
            </IntroCard>
          </div>
        </div>
      </div>
    </div>
  );
}
