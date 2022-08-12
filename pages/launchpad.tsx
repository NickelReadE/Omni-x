import type { NextPage } from 'next'
import React from 'react'
import Link from 'next/link'
import styles from '../styles/launchpad.module.scss'
import classNames from '../helpers/classNames'
const Analytics: NextPage = () => {
  return (
    <div>
      <div className="mt-[90px] w-full">
        <div className={classNames(styles.bgImg, 'pt-[155px] pl-52 pr-52')}>
          <div className='flex justify-center text-6xl	font-circular'>OMNI X LAUNCHPAD</div>
          <div className='flex justify-center text-3xl mt-4	mb-10	 font-circular'>art for everyone, everywhere</div>
          <div className='w-[640px] m-auto'>
            <div className='flex justify-between items-center	'>
              <div className='flex justify-center items-center w-[140px] h-[140px] mt-[4px] border-2 border-solid rounded-[50%] border-black text-center	font-circular'>Super UX</div>
              <div className='w-[299px] h-[0px]  border-dashed border-b-2 border-black'/>
              <div className='flex justify-center items-center w-[140px] h-[140px] mt-[4px] border-2 border-solid	 rounded-[50%] border-black text-center	font-circular'>Unparalleled Liquidity</div>
            </div>     
            <div className='relative w-fit left-[225px] top-[43px]'>
              <Link href={'https://docs.google.com/forms/d/e/1FAIpQLSd0ymFsGZc888Pyj0HLcG8Qn7d25i7GRKh-h1D7Uq1j-qbqpQ/viewform'}>
                <a target="_blank">
                  <button className='flex justify-center  bg-[#B444F9] text-xl text-white rounded-lg pl-4 pr-4 pt-2 pb-2 items-center font-circular   transition-all duration-300 ease-in-out hover:scale-105 hover:drop-shadow-[0_10px_10px_rgba(180,68,249,0.7)] active:scale-100 active:drop-shadow-[0_5px_5px_rgba(180,68,249,0.8)]' >apply to launchpad</button>
                </a>
                
              </Link>
              

            </div>
            <div className='flex justify-between items-center w-[535px] m-auto mt-[72px]	'>
              <div className='w-[245px] h-[0px] border-dashed border-b-2 border-black  transform rotate-52'/>              
              <div className='w-[245px] h-[0px] border-dashed border-b-2 border-black  transform -rotate-52'/>
            </div>      
            <div className='mt-[122px]'>              
              <div className='flex justify-center items-center m-auto w-[140px] h-[140px] mt-[4px] border-2 border-solid rounded-[50%] border-black text-center	font-circular'>Extensive<br/> Support</div>              
              
            </div>            
          </div>
          <div className='flex justify-center text-lg text-[#ADB5BD] mt-12 font-circular'>
            <Link href="https://omni-x.gitbook.io/omni-x-nft-marketplace/marketplace-features/launchpad">
              <a target="_blank">
                learn more
              </a>
            </Link>
          </div>  
          <div className=' text-4xl mt-56 font-circular'>
            Superior User Experience
          </div>
          <div className=' text-2xl mt-14 pl-20 font-circular '>
            the omnichain experience
          </div>       
          <div className=' text-2xl mt-14 pl-40 font-circular'>
            No more listing art on 5 different platforms to cater to users on various blockchains. With Omni X, your art is immediately available to a massive audience as we service 7 major blockchains (and counting) all in one place.
            <div className='mt-5'></div>
            Concerned about the environment? Sell your art on a low energy impact blockchain like Polygon. Value decentralization above all else? List it on Ethereum.
            No matter you or your community’s preference, we are here to support.
          </div> 
          
          
          <div className=' text-2xl mt-14 pl-20 font-circular'>
            easy as amazon
          </div>       
          <div className=' text-2xl mt-14 pl-40 font-circular'>
           with simple, intuitive features like drag and drop shopping carts and asset transfer - the community loves our product and so will you. We make it incredibly simple for people to buy and support you!
          </div>
        </div>
        <div className={classNames(styles.bgImg1, 'pt-[155px] pl-52 pr-52 pb-24')}>
          <div className=' text-4xl mt-56 font-circular'>
           Unparalleled Liquidity
          </div>
          <div className=' text-2xl mt-14 pl-20 font-circular' >
            acquire your dreams
          </div>       
          <div className=' text-2xl mt-14 pl-40 font-circular '>
            OpenSea artists are only able to sell there art to user on Ethereum, Polygon, and Solana.
            <div className='mt-5 font-circular'></div>
            Magic Eden can only sell to Solana.
            <div className='mt-5 font-circular'></div>
            LooksRare only on Ethereum.
            <div className='mt-5 font-circular'></div>
            We enable any user on any of our SEVEN supported chains to purchase your art WITHOUT THEM EVEN BEING ON THE SAME CHAIN. Yes - that is correct. Jill, with her money on Avalanche, and Antonio on Polygon can both buy your art that is hosted on Ethereum - without them needing to anything but click the “buy” button! We deliver truly groundbreaking blockchain technology that no one else on the market does.
            <div className='mt-5 font-circular'></div>
            With exponentially more users able to purchase your art, you are that much closer developing your dream goals.

          </div>

          <div className=' text-4xl mt-56 font-circular'>
           Extensive Support
          </div>
          <div className=' text-2xl mt-14 pl-20 font-circular'>
           a genuine and trustworthy team
          </div>       
          <div className=' text-2xl mt-14 pl-40 font-circular'>
            You are our priority. Without your success we gain nothing, and we are hellbent on your growth. At every step - from prelaunch, mint, and post launch - we are there to support you, answer your questions, and give you expert feedback for a flawless experience.
          </div>    
          <div className=' text-2xl mt-14 pl-20 font-circular'>
           don’t sweat the technicals
          </div>       
          <div className=' text-2xl mt-14 pl-40 font-circular'>
           You worry about the art, we’ll worry about everything else. Minting a natively omnichain NFT collection that can exist on any blockchain is completely facilitated by us - all you need to do is provide the art.
          </div>           
            
          
        </div> 
      </div>
      
    </div>
  )
  
}

export default Analytics
