import { Avatar as Ava } from "@heroui/avatar";

import React from "react";
const Avatar = ({ seed = "default", className = "" }) => {
  return (
    <div>
      <Ava className={className}></Ava>
    </div>
  );
};

export default Avatar;
