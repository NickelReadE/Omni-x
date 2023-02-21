import Image from "next/image";
import { ReactNode } from "react";
import OmniChainImage from "../../public/images/learn-more/omnichain.png";

interface IPropsIntroCard {
  title: string;
  titleColor?: string;
  className?: string;
  children: ReactNode;
}

interface IPropsIconBox {
  children: ReactNode;
}

export const IntroCard = ({ title, titleColor, children, className }: IPropsIntroCard) => {
  return (
    <div className={className ? className : "flex flex-1 justify-center h-[214px]"}>
      <div className='flex flex-col w-full items-center bg-dark-gradient border-[1px] border-solid border-[#383838] shadow-[0_0_30px_rgba(255,255,255,0.06)] rounded-lg backdrop-blur-sm p-8'>
        <span className={`text-xl ${titleColor ? titleColor : "text-primary-light"}`}>{title}</span>
        <div className='flex items-center justify-center w-full h-full'>{children}</div>
      </div>
    </div>
  );
};

const IconBox = ({ children }: IPropsIconBox) => {
  return (
    <div
      className='h-[56px] w-[56px] rounded-md flex items-center justify-center bg-border-gradient border-[1px] border-solid border-transparent'
      style={{ backgroundOrigin: "padding-box, border-box", backgroundClip: "padding-box, border-box" }}
    >
      {children}
    </div>
  );
};

export default function LearnMoreIntro() {
  return (
    <div>
      <div className='flex justify-center pt-[150px]'>
        <div className='flex flex-col'>
          <span className='text-primary-light text-center text-extraxl font-bold shadow-[0_4_6px_rgba(0,0,0,0.25)]'>where web3</span>
          <span className='bg-clip-text text-center text-transparent bg-rainbow-gradient text-extraxl font-bold shadow-[0_4_6px_rgba(0,0,0,0.25)]'>
            connects through art
          </span>
          <span className='text-secondary mt-2 text-xg1 leading-[29px] text-center shadow-[0_4_6px_rgba(0,0,0,0.25)]'>
            art for everyone, everywhere, all in one place
          </span>
        </div>
      </div>
      <div className='flex justify-between space-x-12 pt-[150px]'>
        <IntroCard title='ONFTs' className={"flex flex-1 justify-center h-[214px] hover:shadow-[0_0_30px_#FFE817] rounded-[8px]"}>
          <Image src={OmniChainImage} alt='omnichain' />
        </IntroCard>
        <IntroCard title='web3 social' className={"flex flex-1 justify-center h-[214px] hover:shadow-[0_0_30px_#FFE817] rounded-[8px]"}>
          <div className='flex w-full justify-around'>
            <IconBox>
              <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path
                  d='M20.8401 4.60987C20.3294 4.09888 19.7229 3.69352 19.0555 3.41696C18.388 3.14039 17.6726 2.99805 16.9501 2.99805C16.2276 2.99805 15.5122 3.14039 14.8448 3.41696C14.1773 3.69352 13.5709 4.09888 13.0601 4.60987L12.0001 5.66987L10.9401 4.60987C9.90843 3.57818 8.50915 2.99858 7.05012 2.99858C5.59109 2.99858 4.19181 3.57818 3.16012 4.60987C2.12843 5.64156 1.54883 7.04084 1.54883 8.49987C1.54883 9.95891 2.12843 11.3582 3.16012 12.3899L4.22012 13.4499L12.0001 21.2299L19.7801 13.4499L20.8401 12.3899C21.3511 11.8791 21.7565 11.2727 22.033 10.6052C22.3096 9.93777 22.4519 9.22236 22.4519 8.49987C22.4519 7.77738 22.3096 7.06198 22.033 6.39452C21.7565 5.72706 21.3511 5.12063 20.8401 4.60987Z'
                  fill='url(#paint0_linear_185_420)'
                  stroke='url(#paint1_linear_185_420)'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <defs>
                  <linearGradient
                    id='paint0_linear_185_420'
                    x1='5.46816'
                    y1='2.99805'
                    x2='23.0191'
                    y2='7.85782'
                    gradientUnits='userSpaceOnUse'
                  >
                    <stop stopColor='#FA16FF' />
                    <stop offset='1' stopColor='#F00056' />
                  </linearGradient>
                  <linearGradient
                    id='paint1_linear_185_420'
                    x1='5.46816'
                    y1='2.99805'
                    x2='23.0191'
                    y2='7.85782'
                    gradientUnits='userSpaceOnUse'
                  >
                    <stop stopColor='#FA16FF' />
                    <stop offset='1' stopColor='#F00056' />
                  </linearGradient>
                </defs>
              </svg>
            </IconBox>

            <IconBox>
              <svg width='22' height='22' viewBox='0 0 22 22' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path
                  d='M22 10.3889C22.0042 12.0021 21.6273 13.5934 20.9 15.0333C20.0376 16.7588 18.7119 18.2101 17.0713 19.2247C15.4307 20.2393 13.5401 20.777 11.6111 20.7778C9.99792 20.782 8.40657 20.4051 6.96666 19.6778L0 22L2.32222 15.0333C1.59491 13.5934 1.21801 12.0021 1.22222 10.3889C1.22297 8.45995 1.76074 6.56929 2.77532 4.9287C3.78989 3.28811 5.24119 1.96239 6.96666 1.10003C8.40657 0.372728 9.99792 -0.00417115 11.6111 3.48187e-05H12.2222C14.7697 0.14058 17.1759 1.21585 18.98 3.01997C20.7841 4.82409 21.8594 7.23027 22 9.7778V10.3889Z'
                  fill='url(#paint0_linear_185_424)'
                />
                <defs>
                  <linearGradient
                    id='paint0_linear_185_424'
                    x1='4.125'
                    y1='-8.54139e-07'
                    x2='22.9171'
                    y2='4.53847'
                    gradientUnits='userSpaceOnUse'
                  >
                    <stop stopColor='#00B6F0' />
                    <stop offset='1' stopColor='#1673FF' />
                  </linearGradient>
                </defs>
              </svg>
            </IconBox>

            <IconBox>
              <svg width='22' height='27' viewBox='0 0 22 27' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path
                  d='M16.2727 1.6665L20.6363 6.03014L16.2727 10.3938'
                  stroke='url(#paint0_linear_185_428)'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M1 12.5757V10.3939C1 9.2366 1.45974 8.12669 2.27808 7.30835C3.09642 6.49001 4.20633 6.03027 5.36363 6.03027H20.6364'
                  stroke='url(#paint1_linear_185_428)'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M5.36363 25.6667L1 21.3031L5.36363 16.9395'
                  stroke='url(#paint2_linear_185_428)'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M20.6364 14.7573V16.9391C20.6364 18.0964 20.1766 19.2064 19.3583 20.0247C18.5399 20.843 17.43 21.3028 16.2727 21.3028H1'
                  stroke='url(#paint3_linear_185_428)'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <defs>
                  <linearGradient
                    id='paint0_linear_185_428'
                    x1='17.0909'
                    y1='1.6665'
                    x2='20.979'
                    y2='2.13601'
                    gradientUnits='userSpaceOnUse'
                  >
                    <stop stopColor='#05F000' />
                    <stop offset='1' stopColor='#00B51D' />
                  </linearGradient>
                  <linearGradient
                    id='paint1_linear_185_428'
                    x1='4.68182'
                    y1='6.03027'
                    x2='16.3226'
                    y2='14.4643'
                    gradientUnits='userSpaceOnUse'
                  >
                    <stop stopColor='#05F000' />
                    <stop offset='1' stopColor='#00B51D' />
                  </linearGradient>
                  <linearGradient
                    id='paint2_linear_185_428'
                    x1='1.81818'
                    y1='16.9395'
                    x2='5.70625'
                    y2='17.409'
                    gradientUnits='userSpaceOnUse'
                  >
                    <stop stopColor='#05F000' />
                    <stop offset='1' stopColor='#00B51D' />
                  </linearGradient>
                  <linearGradient
                    id='paint3_linear_185_428'
                    x1='4.68182'
                    y1='14.7573'
                    x2='16.3226'
                    y2='23.1914'
                    gradientUnits='userSpaceOnUse'
                  >
                    <stop stopColor='#05F000' />
                    <stop offset='1' stopColor='#00B51D' />
                  </linearGradient>
                </defs>
              </svg>
            </IconBox>
          </div>
        </IntroCard>
        <IntroCard title='curated content' className={"flex flex-1 justify-center h-[214px] hover:shadow-[0_0_30px_#FFE817] rounded-[8px]"}>
          <svg width='101' height='100' viewBox='0 0 101 100' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path
              d='M64.0457 64.2262L63.0912 65.1741L63.3556 66.4891L63.3558 66.4903L63.3559 66.4911L63.356 66.4914L63.3563 66.4929L63.3599 66.5117C63.3639 66.5329 63.3706 66.5687 63.3794 66.6185C63.3971 66.7182 63.4235 66.8736 63.4547 67.0795C63.5171 67.4915 63.5987 68.1037 63.6693 68.8736C63.8108 70.4174 63.9057 72.5719 63.7207 75.0032C63.4006 79.2112 62.262 84.0229 59.2993 87.9937L12.0491 40.6278C15.9664 37.6836 20.7488 36.57 24.951 36.2753C27.3781 36.1051 29.533 36.2145 31.0788 36.367C31.8494 36.443 32.4628 36.5292 32.8758 36.5947C33.0821 36.6275 33.2379 36.655 33.3379 36.6735C33.3879 36.6827 33.4238 36.6897 33.4451 36.6939L33.4641 36.6976L33.4656 36.6979L33.4659 36.698L33.4667 36.6982L33.4678 36.6984L34.8173 36.9795L35.7756 35.9834L35.7757 35.9833L35.7764 35.9825L35.7796 35.9793L35.7928 35.9656L35.8465 35.9099L36.0614 35.6876C36.2517 35.4909 36.5353 35.1986 36.9063 34.8179C37.6485 34.0563 38.7405 32.9409 40.1369 31.5289C42.9299 28.7048 46.9397 24.695 51.802 19.9574L51.8239 19.936L51.8453 19.9141C57.3701 14.2604 66.0285 12.6667 73.8089 12.6616C77.6333 12.6591 81.0956 13.0409 83.6047 13.4251C84.5931 13.5765 85.4293 13.7276 86.0763 13.8543C86.2034 14.5056 86.3551 15.3486 86.5071 16.3457C86.8914 18.8669 87.2733 22.3454 87.2708 26.186C87.2657 34.0012 85.6707 42.6887 80.0184 48.2121L79.9944 48.2355L79.9711 48.2595C77.9669 50.3257 73.9924 54.3108 70.5044 57.7936C68.7635 59.5319 67.1487 61.1402 65.9691 62.3139C65.3793 62.9008 64.8983 63.379 64.5649 63.7104L64.1802 64.0927L64.0799 64.1923L64.0543 64.2177L64.0479 64.2241L64.0463 64.2257L64.0459 64.2261C64.0458 64.2262 64.0457 64.2262 65.8073 66.0002L64.0457 64.2262ZM61.3046 24.3819C59.9895 24.9271 58.7947 25.7261 57.7885 26.7334C56.2747 28.2489 55.2441 30.1793 54.8271 32.2804C54.41 34.3815 54.6253 36.5591 55.4456 38.538C56.2659 40.5168 57.6544 42.208 59.4357 43.3979C61.217 44.5877 63.311 45.2228 65.4531 45.2228C67.5952 45.2228 69.6893 44.5877 71.4706 43.3979C73.2518 42.208 74.6404 40.5168 75.4607 38.538C76.281 36.5591 76.4962 34.3815 76.0792 32.2804C75.6621 30.1793 74.6316 28.2489 73.1177 26.7334C72.1116 25.7261 70.9168 24.9271 69.6016 24.3819C68.2865 23.8367 66.8768 23.5561 65.4531 23.5561C64.0295 23.5561 62.6197 23.8367 61.3046 24.3819ZM20.5687 69.8805L29.6766 78.9884C25.4468 82.167 20.4511 84.1722 15.1985 84.8007C15.3281 83.2765 15.5745 81.2804 16.0394 79.1883C16.531 76.9763 17.2473 74.7477 18.2677 72.877C18.9386 71.6469 19.7041 70.6377 20.5687 69.8805Z'
              stroke='url(#paint0_linear_185_437)'
              strokeWidth='5'
            />
            <defs>
              <linearGradient id='paint0_linear_185_437' x1='89.5859' y1='10' x2='8.58594' y2='92' gradientUnits='userSpaceOnUse'>
                <stop stopColor='#FFA216' />
                <stop offset='1' stopColor='#FF1616' />
              </linearGradient>
            </defs>
          </svg>
        </IntroCard>
      </div>
    </div>
  );
}
