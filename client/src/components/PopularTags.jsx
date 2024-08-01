import React from "react";
import { IoLogoJavascript } from "react-icons/io";
import LeftSideWrapper from "./common/LeftSideWrapper";
import TagsGroupsTile from "./common/TagsGroupsTile";

const PopularTags = () => {
  return (
    <LeftSideWrapper
      children={
        <>
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

export default PopularTags;
