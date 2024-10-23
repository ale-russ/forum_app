import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

import { handleSearch } from "../../controllers/ForumController";
import { useForum } from "../../utils/PostContext";

const Search = () => {
  const { token } = useForum();
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const getSearchResults = async () => {
    const searchRes = await handleSearch(searchQuery, token);
    setSearchResult(searchRes);
    if (searchResult === 0) {
      setShowSearchModal(false);
    } else {
      setShowSearchModal(true);
    }

    setSearchQuery("");
  };

  return (
    <div className="flex flex-col relative w-full md:w-[300px] xl:w-[600px]">
      <div className="flex items-center light-search rounded-lg px-3 w-full ">
        <input
          className="sm:block m-auto w-full light-search border-0 h-10 text-[#858EAD] outline-none"
          placeholder="Type to search here ..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            e.preventDefault;
            if (e.key === "Enter") {
              getSearchResults();
            }
          }}
        />
        <CiSearch className="text-[#858EAD] w-7 h-7" />
      </div>
      {showSearchModal ? (
        <DisplaySearchResults
          setShowSearchModal={setShowSearchModal}
          searchResults={searchResult}
        />
      ) : null}
    </div>
  );
};

export default Search;

const DisplaySearchResults = ({ setShowSearchModal, searchResults }) => {
  const navigate = useNavigate();
  return (
    <div className="light absolute inset-x-0 top-12 mt-2 mx-auto w-[80vw] md:w-full min-h-40 z-50 border-gray-400 border-2 border-opacity-20 rounded-lg shadow-xl flex flex-col transition ease-in-out duration-300">
      <div className="flex items-center justify-end p-2 w-full">
        <div
          className="flex items-center justify-center rounded-full border-3 hover:cursor-pointer w-8 h-8 border border-gray-500"
          onClick={() => setShowSearchModal(false)}
        >
          X
        </div>
      </div>
      <div className="light overflow-y-auto scrollbar custom-scrollbar max-h-60">
        {searchResults.length > 0 ? (
          searchResults?.map((post) => (
            <div
              key={post._id}
              className="font-bold p-3 rounded-lg shadow-lg border border-gray-300 border-opacity-30 my-3 mx-2 light-navbar overflow-x-hidden cursor-pointer truncate text-clip whitespace-nowrap"
              onClick={() => navigate(`/post/${post._id}`, { state: { post } })}
            >
              {post?.title} : {post?.content}
            </div>
          ))
        ) : (
          <div className="h-40 w-full flex items-center justify-center">
            Nothing Found
          </div>
        )}
      </div>
    </div>
  );
};
