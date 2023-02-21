import { UserCollectionType } from "../../types/collections";
import UserCollectionCard from "./UserCollectionCard";
import Dropdown from "../common/Dropdown";

const sortMenu = [
  { text: "A - Z", value: "name" },
  { text: "Z - A", value: "-name" },
  { text: "last sold", value: "lastSale" },
  { text: "price ascending", value: "price" },
  { text: "price descending", value: "-price" }
];

const UserCollections = ({ collections, ethPrice }: { collections: UserCollectionType[]; ethPrice: number }) => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onChangeSort = () => {};

  return (
    <div>
      <div className={"mb-6 flex"}>
        <Dropdown menus={sortMenu} onChange={onChangeSort} />
      </div>
      <div className={"grid grid-cols-4 gap-4"}>
        {collections.map((collection, index) => {
          return <UserCollectionCard key={index} collection={collection} ethPrice={ethPrice} />;
        })}
      </div>
    </div>
  );
};

export default UserCollections;
