import { IntroCard } from "./Intro";
import CommunityLogo from "../../public/images/learn-more/community.png";
import Image from "next/image";

export default function LearnMoreSocial() {
  return (
    <div className='pt-[150px]'>
      <div className='w-full flex justify-center'>
        <span className='text-[40px] text-center leading-[48px] font-semibold text-primary-light shadow-[0_4_6px_rgba(0,0,0,0.25)]'>
          we3 NFT <span className='text-primary-blue'>communities live here</span>
        </span>
      </div>
      <div className='flex w-full mt-12 space-x-4'>
        <div className='flex flex-1 justify-center items-center flex-col'>
          <IntroCard title='personal feeds' className='flex justify-center w-full'>
            <span className={"text-secondary text-lg mt-6 text-center"}>
              <span className={"text-primary-green"}>follow your favorite projects and artists </span> to sign up for IRL events, collection
              activity notifications, and more!
            </span>
          </IntroCard>
          <IntroCard title='token gating' className='flex justify-center w-full mt-6'>
            <div className='flex flex-col items-center space-y-6 mt-6'>
              <span className={"text-secondary text-lg text-center"}>
                choose who can chat, view, attend, and share your content with our auto-refreshing list of community holders
              </span>
              <span className={"text-secondary text-lg text-center"}>
                this allows you to own and share content -
                <span className={"text-primary-green"}>&nbsp;without giving up any personal information</span>
              </span>
            </div>
          </IntroCard>
        </div>
        <div className='flex flex-1 flex-col items-center pl-8'>
          <span className='text-secondary'>
            most marketplaces only care about trading - we are building{" "}
            <span className='text-primary-green'> a new home for creators </span> with their{" "}
            <span className='text-primary-green'>community</span>
          </span>
          <div>
            <Image src={CommunityLogo} width={440} height={600} alt='community logo' />
          </div>
        </div>
      </div>
    </div>
  );
}
