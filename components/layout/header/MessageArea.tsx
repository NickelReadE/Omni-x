import React, { useState } from "react";
import Image from "next/image";
import useMessage from "../../../hooks/useMessage";

export const MessageArea = () => {
  const [hovered, setHovered] = useState(false);
  const { opened, setOpen } = useMessage();

  return (
    <div className='w-11 h-11'>
      <div className='relative inline-block text-left' onMouseLeave={() => setHovered(false)}>
        <div className={"focus:outline-none"} onMouseEnter={() => setHovered(true)}>
          <div className={"w-11 h-11 rounded-full cursor-pointer"} onClick={() => setOpen(!opened)}>
            <Image
              src={hovered || opened ? "/images/icons/chat-active.svg" : "/images/icons/chat.svg"}
              alt='avatar'
              width={44}
              height={44}
              className='rounded-full'
            />
          </div>
        </div>
      </div>
    </div>
  );
};
