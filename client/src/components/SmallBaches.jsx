import React from "react";
import { useNavigate } from "react-router-dom";

import { ReactComponent as Following } from "../assets/Follow.svg";
import { ReactComponent as Newest } from "../assets/NewBatch.svg";
import { ReactComponent as Popular } from "../assets/PopularBach.svg";
import { useForum } from "../utils/PostContext";

const SmallBaches = () => {
  const navigate = useNavigate();
  const { user } = useForum();
  return (
    <div className=" light-navbar flex flex-wrap lg:hidden items-center justify-between flex-row  lg:flex-col  mt-8 p-4 w-full rounded-lg gap-y-3 drop-shadow-lg">
      <SmallBachesTile
        child={<Newest />}
        label="Newest"
        onClick={() => {
          navigate("/post/latest-posts");
        }}
      />
      <SmallBachesTile
        child={<Popular />}
        label="Popular"
        onClick={() => {
          navigate("/post/popular-posts");
        }}
      />

      <div
        className="flex items-center mx-2  cursor-pointer "
        onClick={() => {
          navigate("/post/following-posts");
        }}
      >
        <div className="flex items-center justify-center m-auto rounded-lg light-search border-1 h-[30px] w-[30px] mr-1">
          <Following />
        </div>
        <p>Following</p>
        <div className="primary h-7 w-7 rounded-lg flex items-center justify-center mx-1">
          <p className="text-bold text-xs text-white">
            {user?.following.length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SmallBaches;

const SmallBachesTile = ({ child, label, onClick }) => {
  return (
    <div className="flex items-center mx-2 cursor-pointer" onClick={onClick}>
      <div className="flex items-center justify-center m-auto rounded-lg light-search border-1 h-[30px] w-[30px] mr-1 ">
        {child}
      </div>
      <p>{label}</p>
    </div>
  );
};
