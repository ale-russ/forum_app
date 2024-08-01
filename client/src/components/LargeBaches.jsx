import React from "react";

import { ReactComponent as Following } from "../assets/Follow.svg";
import { ReactComponent as Newest } from "../assets/NewBatch.svg";
import { ReactComponent as Popular } from "../assets/PopularBach.svg";
import LeftSideWrapper from "./common/LeftSideWrapper";

const LargeBaches = () => {
  return (
    <LeftSideWrapper
      children={
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-center m-auto rounded-lg dark-search border-1 h-[30px] w-[30px] mr-1">
              <Newest />
            </div>
            <div>
              <p className="font-bold text-lg">Newest and Recent</p>
              <p className="dark-caption">Find the latest update</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-center m-auto rounded-lg dark-search border-1 h-[30px] w-[30px] mr-1">
              <Popular />
            </div>
            <div>
              <p className="font-bold text-lg">Popular of the day</p>
              <p className="dark-caption">Shots featured tody curators</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-center m-auto rounded-lg dark-search border-1 h-[30px] w-[30px] mr-1">
              <Following />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex flex-col justify-start">
                <div className="flex items-center">
                  <p className="font-bold text-lg">Following</p>
                  <div className="bg-[#FF571A] h-7 w-7 rounded-lg flex items-center justify-center mx-1">
                    <p className="text-bold text-xs">251</p>
                  </div>
                </div>
                <p className="dark-caption">Find the latest update</p>
              </div>
            </div>
          </div>
        </>
      }
    />
  );
};

export default LargeBaches;
