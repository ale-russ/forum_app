import React from "react";

import { ReactComponent as Logo } from "../../assets/Logo.svg";
import { useNavigate } from "react-router-dom";

const HeaderLogo = () => {
  const navigate = useNavigate();
  return (
    <div
      className="flex items-center px-1 md:px-4 cursor-pointer"
      onClick={() => navigate("/home")}
    >
      <Logo />
      <p className="hidden md:flex lg:flex xl:flex px-4 text-[#FF571A] font-bold text-xl">
        KnowledgeChain
      </p>
    </div>
  );
};

export default HeaderLogo;
