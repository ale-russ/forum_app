import React from "react";
import { IoLogoJavascript } from "react-icons/io";
import { FaArrowRight } from "react-icons/fa6";

import LeftSideWrapper from "./common/LeftSideWrapper";
import TagsGroupsTile from "./common/TagsGroupsTile";

const PinnedGroups = () => {
  return (
    <LeftSideWrapper
      children={
        <>
          <div className="flex items-center gap-x-2">
            <h2>Pinned Group</h2>
            <FaArrowRight />
          </div>
          <TagsGroupsTile
            image={<IoLogoJavascript />}
            label="JavaScript"
            color="bg-[#5A4F43]"
            caption="82,642 Posted by this tag"
          />
          <TagsGroupsTile
            image={<IoLogoJavascript />}
            label="JavaScript"
            color="bg-[#FF8F67]"
            caption="82,642 Posted by this tag"
          />
          <TagsGroupsTile
            image={<IoLogoJavascript />}
            label="JavaScript"
            color="bg-[#FF8F67]"
            caption="82,642 Posted by this tag"
          />
          <TagsGroupsTile
            image={<IoLogoJavascript />}
            label="JavaScript"
            color="bg-[#FF8F67]"
            caption="82,642 Posted by this tag"
          />
          <TagsGroupsTile
            image={<IoLogoJavascript />}
            label="JavaScript"
            color="bg-[#FF8F67]"
            caption="82,642 Posted by this tag"
          />
          <TagsGroupsTile
            image={<IoLogoJavascript />}
            label="JavaScript"
            color="bg-[#FF8F67]"
            caption="82,642 Posted by this tag"
          />
        </>
      }
    />
  );
};

export default PinnedGroups;
