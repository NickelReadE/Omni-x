export default function LearnMorePartners() {
  return (
    <div className='flex justify-center py-[150px]'>
      <div className={"flex flex-col"}>
        <div className='flex justify-center w-full space-x-2'>
          <span className={"text-xl2 text-primary-light"}>a special thanks to those that got us here</span>
        </div>
        <div className='flex flex-col w-full mt-12 px-10'>
          <div className={"flex justify-around w-full h-[70px] space-x-10"}>
            <a href='https://layerzero.network/'>
              <img src={"/images/learn-more/partners/layerzero.png"} alt={"layerzero"} />
            </a>
            <a href='https://www.sneaky.ventures/'>
              <img src={"/images/learn-more/partners/sneaky.png"} alt={"sneaky-vc"} />
            </a>
            <a href='https://www.phdcapital.fund/'>
              <img src={"/images/learn-more/partners/phd.png"} alt={"phd-capital"} />
            </a>
          </div>
          <div className={"flex justify-around w-full mt-12 h-[70px]"}>
            <a href='https://galxe.com/'>
              <img src={"/images/learn-more/partners/galxe-logo-white.svg"} alt={"galxe"} width={300} height={70} />
            </a>
            <a href='https://www.brex.com/'>
              <img src={"/images/learn-more/partners/brex.svg"} alt={"brex"} width={250} height={70} />
            </a>
          </div>
          <div className={"flex justify-around w-full mt-8 h-[70px] space-x-10"}>
            <a href='https://polygon.technology/'>
              <img src={"/images/learn-more/partners/polygon-logo-white.svg"} alt={"polygon"} width={300} />
            </a>
            <a href='https://kanpaipandas.io/'>
              <img src={"/images/learn-more/partners/kanpai_pandas.png"} alt={"kanpai pandas"} />
            </a>
            <a href='https://stargate.finance/'>
              <img src={"/images/learn-more/partners/stargate_logo_full.svg"} width={300} alt={"stargate"} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
