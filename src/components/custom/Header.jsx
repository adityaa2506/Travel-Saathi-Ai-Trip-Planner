import React from "react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

function Header() {
  return (
    <div className="p-2 shadow-sm  flex justify-between items-center">
      <div class="flex items-center">
        <img className="h-12 w-12 mr-4" src="/logo.png" alt="" />
        <div class="text-gray-800 font-bold font-serif">Travel Saathi</div>
      </div>
      <div>
        <Button>Sign In</Button>
      </div>
    </div>
  );
}

export default Header;
