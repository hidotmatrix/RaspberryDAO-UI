import React, { useState } from "react";
import Treasury from "../components/Treasury";
import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";
import ViewNFT from "../components/ViewNFT";
import styles from './TreasuryPage.module.css';
import Backdrop from "../utils/Backdrop/Backdrop";

const Treasurypage = () => {
  return (
    <div>
      <Navbar />
      <div className={styles.treasurypage}>
        <div className={styles.sidebar}>
          <Sidebar selected="Treasury" />
        </div>
        <div className={styles.treasury}>
          <Treasury />
        </div>
        <div className={styles.view}>
          <ViewNFT />
        </div>
      </div>
    </div>
  );
};

export default Treasurypage;
