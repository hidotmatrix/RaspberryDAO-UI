import React from "react";
import Treasury from "../components/Treasury";
import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";

const Treasurypage = () => {
  return (
    <div>
      <Navbar />
      <div className="flex flex-col md:flex-row justify-center ">
        <div>
          <Sidebar />
        </div>
        <Treasury />
      </div>
    </div>
  );
};

export default Treasurypage;
