import React, { useState } from "react";

import {
  createProposal,
  queueGovernance,
  executeGovernance,
} from "../utils/governace/governance-interaction";

export const Create = () => {
  const [dropdown, setDropdown] = useState(false);
  const handleDropdown = () => {
    setDropdown(!dropdown);
  };

  const [fundDropdown, setFundDropdown] = useState(false);
  const handleFundDropdown = () => {
    setFundDropdown(!fundDropdown);
  };

  const [fundToRelease, setFundToRelease] = useState();

  const [description, setDescription] = useState("");

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <div className="w-full max-w-xs">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 dark:bg-gray-800">
          <div className="mb-4">
            <label
              className="block dark:text-white text-sm font-bold mb-2"
              htmlFor="username"
            >
              Treasury Address
            </label>
            <p className="text-xs text-center text-slate-500 ring-2 ring-gray-300 dark:ring-gray-500">
              <small>{process.env.REACT_APP_TREASURY_CONTRACT}</small>
            </p>
          </div>
          {/**Drop down menu */}

          <div style={{ position: "relative", paddingBottom: "20px" }}>
            <button
              onClick={handleDropdown}
              id="dropdownDefault"
              data-dropdown-toggle="dropdown"
              className="inline-flex items-center rounded-lg bg-blue-700 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              type="button"
              style={{ position: "relative" }}
            >
              Select Proposal{" "}
              <svg
                className="ml-2 h-4 w-4"
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>
            {dropdown && (
              <div
                id="dropdown"
                className="z-10 block w-44 divide-y divide-gray-100 rounded bg-white shadow dark:bg-gray-700"
                data-popper-reference-hidden=""
                data-popper-escaped=""
                data-popper-placement="bottom"
                style={{
                  position: "absolute",
                  inset: "0px auto auto 0px",
                  margin: "0px",
                  top: "50px",
                }}
              >
                <ul
                  className="py-1 text-sm text-gray-700 dark:text-gray-200"
                  aria-labelledby="dropdownDefault"
                >
                  <li style={{paddingLeft: "10px", paddingTop: "10px", position: "relative"}}>
                    <button
                      id="dropdownDefault"
                      data-dropdown-toggle="dropdown"
                      className="flex text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                      type="button"
                      style={{ paddingLeft: "20px" }}
                      onClick={handleFundDropdown}
                    >
                      Release Funds{" "}
                      <svg
                        className="ml-2 w-4 h-4"
                        aria-hidden="true"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </button>
                    {fundDropdown && (
                      <div>
                        <input
                          className="text-gray-900 bg-whitex0 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                          id="description"
                          type="text"
                          placeholder="Ex: 100"
                          value={fundToRelease}
                          onChange={(e) => setFundToRelease(e.target.value)}
                        />
                      </div>
                    )}
                  </li>
                  <li style={{paddingLeft: "10px"}}>
                  <button type="button" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">Vote for token dividend</button>
                  </li>
                  <li style={{paddingLeft: "10px"}}>
                  <button type="button" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">Remove veto power</button>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/*Description*/}
                    <div className="mb-6">
            <label
              className="block dark:text-white text-sm font-bold mb-2 "
              htmlFor="password"
            >
              Description
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 dark:text-white mb-3 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 text-sm"
              id="description"
              type="text"
              placeholder="Ex: release funds"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <button
              type="button"
              className="text-black bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
              onClick={async () => {
                await createProposal(
                  process.env.REACT_APP_TREASURY_CONTRACT,
                  description
                );
              }}
            >
              <small>Create</small>
            </button>
            <button
              type="button"
              className="text-black bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:focus:ring-yellow-900"
              onClick={async () => {
                await queueGovernance(
                  process.env.REACT_APP_TREASURY_CONTRACT,
                  description
                );
              }}
            >
              <small>Queue</small>
            </button>
            <button
              type="button"
              className="text-black bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
              onClick={async () => {
                await executeGovernance(
                  process.env.REACT_APP_TREASURY_CONTRACT,
                  description
                );
              }}
            >
              <small>Execute</small>
            </button>
          </div>
        </form>

        <p className="text-center text-gray-500 text-xs">
          &copy;2022 Solulab DAO
        </p>
      </div>
    </div>
  );
};
