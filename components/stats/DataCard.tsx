import { chainInfos } from "../../utils/constants";
import { twMerge } from "tailwind-merge";
import { TextBody, TextH2 } from "../common/Basic";

export type AnalyticsData = {
  chainId: number;
  value: number;
};

interface IAnalyticsCardProps {
  header: string;
  amount: string;
  chainData: AnalyticsData[];
}

export const AnalyticsCard = ({ header, amount, chainData }: IAnalyticsCardProps) => {
  return (
    <div className={"flex flex-col p-6 rounded-lg bg-[#202020]"}>
      <TextBody className={"text-primary-light"}>{header}</TextBody>
      <TextH2 className={"text-primary-light my-2"}>{amount}</TextH2>
      {chainData.map((data: AnalyticsData, index) => {
        return (
          <div key={index} className={"flex items-center justify-between"}>
            <div className={"flex items-center"}>
              <div className={twMerge("w-2 h-2", `${"bg-chain-" + data.chainId}`)} />
              <div className={"ml-2 text-md font-medium text-secondary"}>{chainInfos[data.chainId].officialName}</div>
            </div>
            <div className={"text-md font-medium text-primary-light ml-4"}>{data.value}</div>
          </div>
        );
      })}
    </div>
  );
};
