import React, { useState } from 'react'
import {TextBodyemphasis} from './basic'

function Pagination({ totalItems, itemsPerPage, currentPage, setCurrentPage }: { totalItems: number, itemsPerPage: number, currentPage: number, setCurrentPage: (page: number) => void }) {
  const updateCurrentPage = (page: number) => {
    setCurrentPage(page)
  }

  const renderPageButtons = () => {
    const pageButtons = []
    for (let i = 1; i <= totalItems / itemsPerPage; i++) {
      pageButtons.push(
        <button className={`${currentPage === i ? 'bg-[#303030]' : ''} py-2 px-4 w-[38px] h-[38px]`} key={i} onClick={() => updateCurrentPage(i)}>
          <TextBodyemphasis className={'text-primary-light'}>
            {i}
          </TextBodyemphasis>
        </button>
      )
    }
    return pageButtons
  }

  return (
    <div>
      <div className={'px-4 h-[38px] bg-[#202020] rounded-[20px]'}>
        {renderPageButtons()}
      </div>
    </div>
  )
}

export default Pagination
