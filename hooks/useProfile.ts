import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { NFTItem } from "../interface/interface";
import { openSnackBar } from "../redux/reducers/snackBarReducer";
import { userService } from "../services/users";

export type ProfileData = {
  address: string;
  username: string;
  bio: string;
  twitter: string;
  website: string;
  instagram: string;
  avatar: string;
  banner: string | undefined;
  isGregHolder: boolean;
  followers: number;
  following: number;
  points: number;
};

export type UserInformation = {
  profile: ProfileData | undefined;
  nfts: Array<NFTItem>;
  isUpdating: boolean;
  isLoading: boolean;
  refreshNfts: () => void;
  refreshProfile: () => void;
  updateProfileData: (user: FormData) => Promise<void>;
};

const getUserInformation = async (user_address: string): Promise<ProfileData | undefined> => {
  const user_info = await userService.getUserByAddress(user_address);
  if (user_info) {
    return {
      address: user_address,
      username: user_info.username,
      bio: user_info.bio,
      twitter: user_info.twitter,
      website: user_info.website,
      instagram: user_info.instagram,
      avatar: user_info.avatar,
      banner: user_info.banner,
      followers: user_info.followers,
      following: user_info.following,
      points: user_info.points,
      isGregHolder: user_info.isGregHolder
    };
  }
  return undefined;
};

const getUserNFTs = async (address: string): Promise<Array<NFTItem>> => {
  try {
    return await userService.getUserNFTs(address);
  } catch (err: any) {
    console.error(`While fetching user nfts: ${err}`);
    return [];
  }
};

const useProfile = (user_address: string | undefined): UserInformation => {
  const [profile, setProfile] = useState<ProfileData | undefined>();
  const [nfts, setNfts] = useState<Array<NFTItem>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [nftRefresh, setNftRefresh] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      if (user_address) {
        setProfile(await getUserInformation(user_address));
      }
    })();
  }, [user_address, refresh]);

  useEffect(() => {
    (async () => {
      if (user_address) {
        setLoading(true);
        const nfts = await getUserNFTs(user_address);
        setNfts(nfts);
        setLoading(false);
      }
    })();
  }, [user_address]);

  useEffect(() => {
    (async () => {
      if (user_address && nftRefresh) {
        const nfts = await getUserNFTs(user_address);
        setNfts(nfts);
        setNftRefresh(false);
      }
    })();
  }, [nftRefresh, user_address]);

  const updateProfileData = async (user: FormData) => {
    setIsUpdating(true);
    dispatch(openSnackBar({ message: "Updating User Profile...", status: "info" }));
    try {
      await userService.updateProfile(user);
      refreshProfile();
    } catch (e) {
      console.error(`While updating user profile: ${e}`);
      dispatch(openSnackBar({ message: "Failed to update profile", status: "error" }));
    } finally {
      setIsUpdating(false);
    }
    dispatch(openSnackBar({ message: "Successfully updated", status: "success" }));
  };

  const refreshNfts = () => {
    setNftRefresh(true);
  };

  const refreshProfile = () => {
    setRefresh(!refresh);
  };

  return {
    profile,
    nfts,
    isUpdating,
    isLoading: loading,
    refreshNfts,
    refreshProfile,
    updateProfileData
  };
};

export default useProfile;
