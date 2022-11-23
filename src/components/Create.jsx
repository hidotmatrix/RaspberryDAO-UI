import React, { useState } from "react";
import styles from './Create.module.css';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import {app,credentials} from "../utils/mongo-client/mongo.client"
import { useNavigate } from 'react-router-dom';

import {
  createProposal,
  queueGovernance,
  executeGovernance,
  sendMoney,
} from "../utils/governace/governance-interaction";

export const Create = () => {
  const navigate = useNavigate();

  const [dropdown, setDropdown] = useState(false);
  const handleDropdown = () => {
    setDropdown(!dropdown);
  };

  const [fundDropdown, setFundDropdown] = useState(false);
  const handleFundDropdown = () => {
    setFundDropdown(!fundDropdown);
  };
  const [nftDropdown, setNFTDropdown] = useState(false);
  const handleNFTDropdown = () => {
    setNFTDropdown(!nftDropdown);
  };

  const [isLoading,setLoading] = useState(false)
  const [treasuryAction,setTreasuryAction] = useState(0)

  const [fundToRelease, setFundToRelease] = useState("");
  const [fundToRecepient, setFundToRecepient] = useState("");
 
  const [selectedNFTAdress,setNFTAddress] = useState("")
  const [selectedNFTTokenID,setNFTTokenID]= useState("")
  const [NFTrecepient,setNFTRecepient] = useState("")

  const [description, setDescription] = useState("");

  const notify = async (txReceipt,isErrored) => { 
    setLoading(true)
    if(isErrored===2){
      toast.error(txReceipt.data.message)
    }
    try {
      const txData = txReceipt.wait()
      toast.promise(
        txData,
        {
          pending: 'Your transaction is pending',
          success: `Your transaction has been confirmed`,
          error: 'You transaction has been rejected 🤯'
        }
    )
    const tx = await txData;
    const proposalCreated = tx.events[1].args;
      if(tx.status){
        const user = await app.logIn(credentials);
        const insertedProposal = await user.functions.createProposal(proposalCreated.proposalId, proposalCreated.proposer, proposalCreated.targets, proposalCreated.values, proposalCreated.signatures, proposalCreated.calldatas, proposalCreated.startBlock, proposalCreated.endBlock, proposalCreated.description);
      }
    } catch (error) {
      toast.error(error.data.message)
    }finally{
      setLoading(false)
      const timerId = setTimeout(() => {
         navigate("/");
         clearTimeout(timerId);
      }, 5000);
    }
};

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
               {   treasuryAction === 0 || treasuryAction ===1 ? <button
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
                    </button>:""}
                    {fundDropdown && (
                      <div className={styles.doubledrop}>
                        <input
                          className={styles.dropoptions}
                          id="description"
                          type="text"
                          placeholder="Ex: 100"
                          value={fundToRelease}
                          onChange={(e) => {setFundToRelease(e.target.value);setTreasuryAction(1)}}
                        />
                        <input
                          className={styles.dropoptions}
                          id="description"
                          type="text"
                          placeholder="Ex: 0x000..."
                          value={fundToRecepient}
                          onChange={(e) => setFundToRecepient(e.target.value)}
                        />
                      </div>
                    )}
                  </li>
                  <li
                    style={{
                      paddingLeft: "10px",
                      paddingTop: "10px",
                      position: "relative",
                    }}
                  >
               {treasuryAction === 2 || treasuryAction === 0? <button
                      id="dropdownDefault"
                      data-dropdown-toggle="dropdown"
                      className={styles.dropoptions}
                      type="button"
                      onClick={handleNFTDropdown}
                    >
                      Withdraw NFT
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
                    </button>:""}
                    {nftDropdown && (
                      <div className={styles.doubledrop}>
                       <input
                          className={styles.dropoptions}
                          id="description"
                          type="text"
                          placeholder="NFT Address"
                          value={selectedNFTAdress}
                          onChange= {(e) => {setNFTAddress(e.target.value);setTreasuryAction(2)}}
                        />
                        <input
                          className={styles.dropoptions}
                          id="description"
                          type="text"
                          placeholder="NFT Token ID"
                          value={selectedNFTTokenID}
                          onChange= {(e) => setNFTTokenID(e.target.value)}
                        />
                            <input
                          className={styles.dropoptions}
                          id="description"
                          type="text"
                          placeholder="Recepient Address"
                          value={NFTrecepient}
                          onChange= {(e) => setNFTRecepient(e.target.value)}
                        />
                      </div>
                    )}
                  </li>
                </ul>
              </div>
            )}
          </div>
          <div className={styles.treasury}>
            <label className={styles.heading}>Treasury Address</label>
            <div className={styles.field}>
              {process.env.REACT_APP_TREASURY_CONTRACT}
            </div>
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
              disabled={isLoading}
              onClick={async () => {
                handleDropdown()
                const {tx,isErrored} = await createProposal(
                  treasuryAction,
                  process.env.REACT_APP_TREASURY_CONTRACT,
                  description,
                  fundToRelease,
                  fundToRecepient,
                  selectedNFTAdress,
                  selectedNFTTokenID,
                  NFTrecepient
                );
                notify(tx,isErrored)
              }}
            >
             {isLoading?"Creating...":"Create"}
            </button>
           
          </div>
        </form>
      </div>
      <div className={styles.disclaimer}>
        <span style={{ marginRight: "6px" }}>&copy;</span>2022 Raspberry DAO
      </div>
          <ToastContainer
          theme="dark" />
    </div>
  );
};
