import React, { useState } from "react";
import { MdOutlineVerified } from "react-icons/md";
import { NavLink } from "react-router-dom";
import styles from './Sidebar.module.css';

export const Sidebar = (props) => {
  const [selected, setSelected] = useState(props.selected ? props.selected : 'Proposal');

  return (
    <div className="md:w-64 sm:w-full  py-4 px-3 m-5 mt-7 rounded-xl border" style={{ borderColor: "#2d2d2d" }}>
      <img src="https://mdbootstrap.com//img/Photos/Square/1.jpg" className="w-12 mx-auto md:max-w-full h-auto rounded-full" alt="" />
      <h5 className="mb-2 text-2xl mt-4 font-bold text-center text-white flex flex-row justify-center" style={{ alignItems: "center" }}>
        Raspberry DAO
        <MdOutlineVerified style={{ fontSize: "30px", marginLeft: "6px" }} />
      </h5>
      <p className="font-normal text-gray-400 text-center">20k members</p>
      <a
        href="#"
        className="inline-block flex m-4 flex-row justify-center text-sm px-4 py-2 leading-none border rounded-full text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 "
      >
        Join
      </a>

      <ul className="space-y-2" style={{ marginBottom: "6px" }}>
        <li>
          <NavLink
            to="/"
            className={selected === 'Proposal' ? styles.active : styles.nonactive}
            onClick={() => setSelected('Proposal')}
          >
            Proposal
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/Create"
            className={selected === 'NewProposal' ? styles.active : styles.nonactive}
            onClick={() => setSelected('NewProposal')}
          >
            New Proposal
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/Treasury"
            className={selected === 'Treasury' ? styles.active : styles.nonactive}
            onClick={() => setSelected('Treasury')}
          >
            Treasury
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/About"
            className={selected === 'About' ? styles.active : styles.nonactive}
            onClick={() => setSelected('About')}
          >
            About
          </NavLink>
        </li>
      </ul>
    </div>
  );
};
