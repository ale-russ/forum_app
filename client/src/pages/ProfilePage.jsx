import React, { useEffect, useState } from "react";

import { useForum } from "../utils/PostContext";
import ProfileImage from "../components/common/ProfileImage";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../components/ui/hover-card";

const ProfilePage = () => {
  const { user, handleGetUpdatedUserInfo } = useForum();
  const [expanded, setExpanded] = useState(false);
  // console.log("user: ", user);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(() => {
    handleGetUpdatedUserInfo();
  }, []);

  return (
    <div className="m-auto h-full w-full lg:w-[40%] light-navbar p-4  flex-col space-y-4 rounded-lg shadow-xl">
      <div className="rounded-lg shadow-xl w-full h-36 flex flex-col items-center justify-center light-search ">
        <div className="flex flex-col items-center justify-center hover:scale-105 transition duration-300 ease-in-out">
          <ProfileImage author={user} />
          <p className="font-bold ">{user.userName}</p>
        </div>
      </div>
      <div className="rounded-lg shadow-xl w-full flex flex-col items-center justify-between light-search p-3 my-2 space-y-4">
        <UserDetails title="Email" label={user?.email} />

        <UserInfoAccordion
          value="posts"
          title={"Posts"}
          label={user?.posts}
          numberOfItems={user?.posts?.length ?? 0}
        />

        <UserInfoAccordion
          value="likedPosts"
          title={"Liked Posts"}
          label={user?.likedPosts}
          numberOfItems={user?.likedPosts?.length ?? 0}
        />
        <UserInfoAccordion
          value="createdRooms"
          title={"Created Rooms"}
          label={user?.roomsCreated}
          numberOfItems={user?.roomsCreated?.length ?? 0}
        />
        <UserInfoAccordion
          value="joinedRooms"
          title={"Joined Rooms"}
          label={user?.roomsJoined}
          numberOfItems={user?.roomsJoined?.length ?? 0}
        />
      </div>
    </div>
  );
};

export default ProfilePage;

const UserDetails = ({ title, label }) => {
  return (
    <div className="flex items-center justify-between w-full px-2 rounded-lg shadow-xl light-navbar h-10">
      <div>{title}</div>
      <div>{label}</div>
    </div>
  );
};

const UserInfoAccordion = ({ title, label, value, numberOfItems }) => {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full rounded-lg shadow-xl light-navbar px-2  "
    >
      <AccordionItem value={value} className="hover:no-underline">
        <AccordionTrigger className="w-full no-underline hover:no-underline">
          <div className="flex items-center justify-between w-full pr-2">
            <div>{title}</div>
            <div>{numberOfItems}</div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="max-h-48 overflow-hidden overflow-y-auto scrollbar custom-scrollbar">
          {label?.length ? (
            <>
              {label?.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="flex items-center rounded-lg shadow-lg h-8 my-3 p-2 border bg-white"
                  >
                    {item?.name ?? item?.title}
                  </div>
                );
              })}
            </>
          ) : (
            <p className="flex items-center justify-center h-full">
              No items found
            </p>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
