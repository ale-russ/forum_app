import React from "react";

import { ReactComponent as Following } from "../assets/Follow.svg";
import { ReactComponent as Newest } from "../assets/NewBatch.svg";
import { ReactComponent as Popular } from "../assets/PopularBach.svg";

const SmallBaches = () => {
  return (
    <div className=" dark-navbar flex flex-wrap md:hidden lg:hidden xl:hidden items-center justify-between flex-row sm:flex-row md:flex-col lg:flex-col xl:flex-col mt-8 p-4 w-full rounded-lg gap-y-3">
      <SmallBachesTile child={<Newest />} label="Newest" />
      <SmallBachesTile child={<Popular />} label="Popular" />

      <div className="flex items-center mx-2">
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

const SmallBachesTile = ({ child, label }) => {
  return (
    <div className="flex items-center mx-2">
      <div className="flex items-center justify-center m-auto rounded-lg dark-search border-1 h-[30px] w-[30px] mr-1">
        {child}
      </div>
      <p>{label}</p>
    </div>
  );
};
