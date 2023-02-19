import React from "react";
import { TextBodyemphasis } from "./Basic";

function Pagination({
  totalPage,
  currentPage,
  setCurrentPage
}: {
  totalPage: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}) {
  const updateCurrentPage = (page: number) => {
    setCurrentPage(page);
  };

  const renderPageButtons = () => {
    const pageButtons = [];
    for (let i = 0; i < totalPage; i++) {
      pageButtons.push(
        <button
          className={`${currentPage === i ? "bg-[#303030]" : ""} py-2 px-4 w-[38px] h-[38px]`}
          key={i}
          onClick={() => updateCurrentPage(i)}
        >
          <TextBodyemphasis className={"text-primary-light"}>{i + 1}</TextBodyemphasis>
        </button>
      );
    }
    return pageButtons;
  };

  return (
    <div>
      <div className={"px-4 h-[38px] bg-[#202020] rounded-[20px]"}>{renderPageButtons()}</div>
    </div>
  );
}

export default Pagination;
