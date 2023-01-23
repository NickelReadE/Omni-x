import Image from 'next/image'
import InfrastructureImage1 from '../../public/images/learn-more/infrastructure_1.png'
import LayerzeroLogo from '../../public/images/learn-more/layerzero_logo.png'
import StargateLogo from '../../public/images/learn-more/stargate_logo.png'
import { IntroCard } from './intro'

export default function LearnMoreInfrastructure() {
  return (
    <div className="pt-[150px]">
      <div className="flex justify-center w-full space-x-2">
        <span className="text-[40px] leading-[48px] font-semibold text-primary-light shadow-[0_4_6px_rgba(0,0,0,0.25)]">truly</span>
        <span className="text-[40px] leading-[48px] font-semibold text-primary-blue italic shadow-[0_4_6px_rgba(0,0,0,0.25)]">omnichain</span>
        <span className="text-[40px] leading-[48px] font-semibold text-primary-light shadow-[0_4_6px_rgba(0,0,0,0.25)]">infrastructure</span>
      </div>
      <div className="flex w-full mt-12 space-x-4">
        <div className="flex flex-1 justify-center items-center flex-col">
          <span className='text-secondary text-xl text-center'>
            A multichain world needs <span className='text-[#16FFC5]'>real omnichain solutions.</span> Your NFTs on 10+ blockchains (and counting) can all be viewed, traded, and shared all in one place - Omni X.
          </span>
          <div className='flex items-center justfy-center w-[500px] h-[500px] mt-6'>
            <Image src={InfrastructureImage1} width={500} height={500} alt='infrastructure image 1' className='mt-6 w-full' />
          </div>
        </div>
        <div className="flex flex-1 flex-col space-y-8 pl-8">
          <IntroCard title="NFT interoperability" className='flex justify-center'>
            <div className='flex flex-col items-center'>
              <span className='text-xl text-secondary text-center'>
                <span className='text-[#16FFC5] mr-1'>bridge</span>
                any pre-existing NFT to any chain using our wrapped asset bridge, or
                <span className='text-[#16FFC5]'>&nbsp;mint omnichain NFTs&nbsp;</span>
                (ONFTs) to enable seamless transfer of assets (and metadata) across blockchains
              </span>
              <span className='text-xl text-secondary text-center mt-6 mb-2'>
                10+ blockchains (and counting) powered by
              </span>
              <Image src={LayerzeroLogo} width={150} height={40} alt='layerzero logo' />
            </div>
          </IntroCard>
          <IntroCard title="deep & frictionless liquidity" className='flex justify-center'>
            <div className='flex flex-col items-center space-y-4'>
              <span className='text-xl text-secondary text-center mt-5'>
                trade any asset, on any chain, with any token*
              </span>
              <span className='text-xl text-secondary text-center'>
                a new paradigm that <span className='text-[#16FFC5]'>exponentially increases available liquidity</span> for artists and traders
              </span>
              <span className='text-xl italic text-secondary text-center'>
                *fully multichain assets $USDC, $USDT, $ETH, and $OMNI powered by
              </span>
              <div>
                <Image src={StargateLogo} className="mt-2" width={160} height={40} alt='layerzero logo' />
              </div>
            </div>
          </IntroCard>
        </div>
      </div>
    </div>
  )
}
