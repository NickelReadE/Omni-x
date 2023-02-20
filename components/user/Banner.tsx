/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo, useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import { makeStyles } from "@material-ui/core/styles";
import Image from "next/image";
import useWallet from "../../hooks/useWallet";
import classNames from "../../helpers/classNames";
import { ProfileData } from "../../hooks/useProfile";
// import {ExternalLink, TextBody, TextBodyemphasis, TextH3} from './basic'
import { ExternalLink, TextBody, TextH3 } from "../common/Basic";
import UserEdit from "./UserEdit";
import { formatAmount } from "../../utils/numbers";
import { CopyAddressButton } from "../common/buttons/CopyAddressButton";
import { getImageProperLink } from "../../utils/helpers";

type UserBannerProps = {
  user: ProfileData;
};

const useStyles = makeStyles({
  paper: {
    padding: 0,
    width: "90%",
    maxWidth: "960px"
  }
});

const UserBanner = ({ user }: UserBannerProps): JSX.Element => {
  const { address } = useWallet();
  const classes = useStyles();
  const [settingModal, setSettingModal] = useState(false);

  const bannerImage = useMemo(() => {
    if (user && user.banner) {
      return getImageProperLink(user.banner);
    }
    return "/images/default_banner.png";
  }, [user]);

  const avatarImage = useMemo(() => {
    if (user && user.avatar) {
      return getImageProperLink(user.avatar);
    }
    return "/images/default_avatar.png";
  }, [user]);

  return (
    <>
      <div className={"grid grid-cols-4 lg:grid-cols-6 pt-5"}>
        <div className={"hidden lg:block"} />
        <div className={classNames("col-span-4")}>
          <div className={"relative"}>
            <div className={"overflow-hidden aspect-[3/1] rounded-lg"}>
              <img src={bannerImage} className='w-full object-cover' alt={"banner"} />
            </div>
            <div className='bottom-[-80px] left-6 w-[120px] h-[120px] absolute flex items-end border-solid rounded border-4 border-primary'>
              <img src={avatarImage} alt='avatar' className={"w-full h-full"} />
            </div>
          </div>

          <div className={"flex items-center justify-between w-full pl-[160px] pt-5"}>
            <div className={"flex flex-col justify-between h-full"}>
              <div className={"flex space-x-2"}>
                <TextH3 className={"text-primary-light"}>{user.username || "username"}</TextH3>
                {/* why are there 2 addresses here? is it not enough just passing user.address??*/}
                <CopyAddressButton address={user && user.address ? user.address : address || ""} />
              </div>

              <div className={"flex items-center space-x-3 mt-1"}>
                {/* <div className={'flex items-center space-x-1'}>
                  <TextBody className={'text-primary-light'}>{formatAmount(user.followers)}</TextBody>
                  <TextBody className={'text-secondary'}>followers</TextBody>
                </div>
                <div className={'flex items-center space-x-1'}>
                  <TextBody className={'text-primary-light'}>{formatAmount(user.following)}</TextBody>
                  <TextBody className={'text-secondary'}>following</TextBody>
                </div> */}
                <div className={"flex items-center space-x-1"}>
                  <TextBody className={"text-primary-light"}>{formatAmount(user.points)}</TextBody>
                  <TextBody className={"bg-primary-gradient text-transparent bg-clip-text"}>points</TextBody>
                </div>
              </div>
            </div>
            <div className={"flex items-center space-x-4"}>
              {/* <div className={'bg-primary-gradient py-2 px-4 flex items-center justify-center rounded-full cursor-pointer'}>
                <TextBodyemphasis className={'text-primary'}>following</TextBodyemphasis>
              </div> */}
              {/* <div className={'w-11 h-11'}>
                <Image src={'/images/icons/chat.svg'} alt={'chat'} width={44} height={44} />
              </div> */}
              <div className={`w-8 h-8 ${user.website === "" ? "hidden" : ""}`}>
                <ExternalLink link={user.website}>
                  <Image src={"/images/icons/website.svg"} alt={"website"} width={32} height={32} />
                </ExternalLink>
              </div>
              <div className={`w-8 h-8 ${user.twitter === "" ? "hidden" : ""}`}>
                <ExternalLink link={user.twitter}>
                  <Image src={"/images/icons/twitter.svg"} alt={"website"} width={32} height={32} />
                </ExternalLink>
              </div>
              <div className={`w-8 h-8 ${user.instagram === "" ? "hidden" : ""}`}>
                <ExternalLink link={user.instagram}>
                  <Image src={"/images/icons/instagram.svg"} alt={"instagram"} width={32} height={32} />
                </ExternalLink>
              </div>
            </div>
          </div>
        </div>
        <div className={"hidden lg:block"} />
      </div>
      <Dialog
        open={settingModal}
        onClose={() => setSettingModal(false)}
        aria-labelledby='simple-dialog-title'
        maxWidth={"xl"}
        classes={{ paper: classes.paper }}
      >
        <UserEdit updateModal={() => setSettingModal(false)} />
      </Dialog>
    </>
  );
};

export default UserBanner;
