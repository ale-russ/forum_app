import React, { useEffect, useState } from "react";
import { IoLogoJavascript } from "react-icons/io";
import LeftSideWrapper from "./common/LeftSideWrapper";
import TagsGroupsTile from "./common/TagsGroupsTile";
import { useForum } from "../utils/PostContext";

const PopularTags = () => {
  // const [chatRooms, setChatRooms] = useState([]);
  const { handleFetchRooms, chatRooms } = useForum();

  const getRooms = async () => {
    await handleFetchRooms();
    // setChatRooms(rooms);
  };

  useEffect(() => {
    getRooms();
  }, []);
  // console.log("ChatRooms: ", chatRooms);
  return (
    <LeftSideWrapper
      children={
        <>
          {chatRooms &&
            chatRooms.map((room) => (
              <TagsGroupsTile
                image={<IoLogoJavascript />}
                label={room.name}
                color="bg-[#FF8F67]"
                caption={`${room.messages.length} Users`}
              />
            ))}
          {/* <TagsGroupsTile
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
          /> */}
        </>
      }
    />
  );
};

export default PopularTags;
