import React from "react";
import type { NextPage } from "next";
import LearnMoreIntro from "../components/learn-more/Intro";
import LearnMoreInfrastructure from "../components/learn-more/Infrastructure";
import LearnMoreSocial from "../components/learn-more/Social";
import LearnMoreLaunchWithUs from "../components/learn-more/LaunchWithUs";
import LearnMorePartners from "../components/learn-more/Partners";

const LearnMore: NextPage = () => {
  return (
    <div className='px-[60px]'>
      <LearnMoreIntro />
      <LearnMoreInfrastructure />
      <LearnMoreSocial />
      <LearnMoreLaunchWithUs />
      <LearnMorePartners />
    </div>
  );
};

export default LearnMore;
