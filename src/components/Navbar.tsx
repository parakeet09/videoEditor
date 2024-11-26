import React from "react";
import { ReactComponent as Logo } from "../components/imageFolder/trupeerLogo.svg";

const Navbar = () => {
  return (
    <nav className="bg-[#d4d4d4] bg-opacity-40">
      <div className="container mx-auto flex justify-between items-center px-0 py-1">
        <Logo className="trupeer-logo" />
        <div className="text-xl font-bold text-gray-800">
          <a href="/">Prateek Sinha</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
