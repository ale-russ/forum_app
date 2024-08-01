import React from "react";

import { ReactComponent as Following } from "../assets/Follow.svg";
import { ReactComponent as Newest } from "../assets/NewBatch.svg";
import { ReactComponent as Popular } from "../assets/PopularBach.svg";

const SmallBaches = () => {
  return (
    <div className=" dark-navbar h-16 flex md:hidden lg:hidden xl:hidden items-center justify-between flex-row sm:flex-row md:flex-col lg:flex-col xl:flex-col mt-8 p-4">
      <div className="flex items-center mx-2 ">
        <div className="flex items-center justify-center m-auto rounded-lg dark-search border-1 h-[30px] w-[30px] mr-1">
          <Newest />
        </div>
        <p>Newest</p>
      </div>
      <div className="flex items-center mx-2 ">
        <div className="flex items-center justify-center m-auto rounded-lg dark-search border-1 h-[30px] w-[30px] mr-1 ">
          <Popular />
        </div>
        <p>Popular</p>
      </div>
      <div className="flex items-center mx-2 ">
        <div className="flex items-center justify-center m-auto rounded-lg dark-search border-1 h-[30px] w-[30px] mr-1 ">
          <Following />
        </div>
        <p>Following</p>
        <div className="bg-[#FF571A] h-7 w-7 rounded-lg flex items-center justify-center mx-1">
          <p className="text-bold text-xs">251</p>
        </div>
      </div>
    </div>
  );
};

export default SmallBaches;
