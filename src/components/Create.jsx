import React, { useState } from "react";
import styles from './Create.module.css';
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

  const [fundToRelease, setFundToRelease] = useState(0);

  const [description, setDescription] = useState("");

  return (
    <div className={styles.createpage}>
      <div className={styles.box}>
        <form>
          <div className={styles.selectbutton}>
            <button
              onClick={handleDropdown}
              id="dropdownDefault"
              data-dropdown-toggle="dropdown"
              className={styles.proposalselect}
              type="button"
            >
              Select Proposal
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
              <div id="dropdown" className={styles.drop}>
                <ul
                  className="py-1 text-sm text-gray-700 dark:text-gray-200"
                  aria-labelledby="dropdownDefault"
                >
                  <li
                    style={{
                      paddingLeft: "10px",
                      paddingTop: "10px",
                      position: "relative",
                    }}
                  >
                    <button
                      id="dropdownDefault"
                      data-dropdown-toggle="dropdown"
                      className={styles.dropoptions}
                      type="button"
                      onClick={handleFundDropdown}
                    >
                      Release Funds
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
                      <div className={styles.doubledrop}>
                        <input
                          className={styles.dropoptions}
                          id="description"
                          type="text"
                          placeholder="Ex: 100"
                          value={fundToRelease}
                          onChange={(e) => setFundToRelease(e.target.value)}
                        />
                      </div>
                    )}
                  </li>
                  {/* <li style={{ paddingLeft: "10px" }}>
                    <button
                      type="button"
                      className={styles.dropoptions}
                    >
                      Vote for token dividend
                    </button>
                  </li>
                  <li style={{ paddingLeft: "10px" }}>
                    <button
                      type="button"
                      className={styles.dropoptions}
                    >
                      Remove veto power
                    </button>
                  </li> */}
                </ul>
              </div>
            )}
          </div>
          <div className={styles.treasury}>
            <label className={styles.heading}>Treasury Address</label>
            <div className={styles.field}>{process.env.REACT_APP_TREASURY_CONTRACT}</div>
          </div>
          <div className={styles.description}>
            <label className={styles.heading}>Description</label>
            <input
              className={styles.field}
              id="description"
              type="text"
              placeholder="Ex: release funds"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className={styles.buttons}>
            <button
              type="button"
              className={styles.createButton}
              onClick={async () => {
                await createProposal(
                  process.env.REACT_APP_TREASURY_CONTRACT,
                  description,
                  fundToRelease
                );
              }}
            >
              Create
            </button>
            <button
              type="button"
              className={styles.queueButton}
              onClick={async () => {
                await queueGovernance(
                  process.env.REACT_APP_TREASURY_CONTRACT,
                  description
                );
              }}
            >
              Queue
            </button>
            <button
              type="button"
              className={styles.executeButton}
              onClick={async () => {
                await executeGovernance(
                  process.env.REACT_APP_TREASURY_CONTRACT,
                  description
                );
              }}
            >
              Execute
            </button>
          </div>
        </form>
      </div>
      <div className={styles.disclaimer}>
        <span style={{ marginRight: "6px" }}>&copy;</span>2022 Raspberry DAO
      </div>
    </div>
  );
};
