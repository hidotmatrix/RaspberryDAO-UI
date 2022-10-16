import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
  useNetwork,
  useContractRead,
  useBlockNumber,
} from 'wagmi'
import "./PopupStyles.css";
import {
  getProposalState,
  getQuorum,
  getVoteStatics,
  delegateGovernanceToken,
  castVoteAndParticipate,
  queueGovernance,
  executeGovernance,
  getDelegateGovernanceToken,
} from "../utils/governace/governance-interaction.js";
import moment from "moment";
import { GOVERNANCE_CONRACT_ADDRESS, TREASURY_CONTRACT_ADDRESS } from "../constants/constants";
import ABI from "../contracts/Governance.json"

const Card = (props) => {
  const BlockInfo = useBlockNumber()

  const { data, index ,provider} = props;
  const [modal, setModal] = useState(false);
  const [proposalState, setProposalState] = useState();
  const [proposalStateString, setproposalStateString] = useState("");
  const [quorumState, setQuorumState] = useState();
  const [votesFor, setVotesFor] = useState();
  const [votesAgainst, setVotesAgainst] = useState();
  const [votesAbstain, setVotesAbstain] = useState();
  const [signer, setSigner] = useState();
  const [timeLeft, setTimeLeft] = useState();
  const [proposarAddress,setProposarAddress] = useState("")

  const contractReadForQuorom = useContractRead({
    addressOrName: GOVERNANCE_CONRACT_ADDRESS,
    contractInterface: ABI.abi,
    functionName: 'quorum',
    args:[BlockInfo.data-2],
    onSuccess(data) {
      const parseQuorum = ethers.utils.formatEther(data.toString());
      setQuorumState(parseQuorum)
      console.log('Success', data.toString())
    },
  })

  const contractReadForPorposalState = useContractRead({
    addressOrName: GOVERNANCE_CONRACT_ADDRESS,
    contractInterface: ABI.abi,
    functionName: 'state',
    args:[data.pId],
    onSuccess(data) {
      setProposalState(data);
      setproposalStateString(proposalStateOutput());
      console.log('Success State', data)
    },
  })

  const contractReadForPorposalVotes = useContractRead({
    addressOrName: GOVERNANCE_CONRACT_ADDRESS,
    contractInterface: ABI.abi,
    functionName: 'proposalVotes',
    args:[data.pId],
    onSuccess(data) {
      setVotesFor(ethers.utils.formatEther(data.forVotes.toString()));
      setVotesAgainst(ethers.utils.formatEther(data.againstVotes.toString()));
      setVotesAbstain(ethers.utils.formatEther(data.abstainVotes.toString()));
      console.log('Success Votes', data)
    },
  })

  const { isConnected } = useAccount()
  const { chain } = useNetwork()

  const toggleModal = () => {
    setModal(!modal);
  };

  let fetchTimeLeft = async () => {
    let currblockNumber = await provider.getBlockNumber();
    let endBlock = data.end;
    let startBlock = data.start;
    let blockDifference = Number(endBlock)>Number(currblockNumber)?Number(endBlock) - Number(currblockNumber):0;
    let timeRate = blockDifference * 2;
    let timeOutput = timeRate / 60;
    let momentMin = blockDifference===0? "Already Ended" :moment.duration(timeOutput, "minutes").humanize();
    return String(momentMin);
  };

  if (modal) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }

  const proposalStateOutput = () => {
    // States:
    /**
     * 0 - Pending
     * 1 - Active
     * 2 - Canceled
     * 3 - Defeated
     * 4 - Succeeded
     * 5 - Queued
     * 6 - Expired
     * 7 - Executed
     */
    if (proposalState === 0) {
      return "Pending";
    } else if (proposalState === 1) {
      return "Active";
    } else if (proposalState === 2) {
      return "Canceled";
    } else if (proposalState === 3) {
      return "Defeated";
    } else if (proposalState === 4) {
      return "Succeeded";
    } else if (proposalState === 5) {
      return "Queued";
    } else if (proposalState === 6) {
      return "Expired";
    } else if (proposalState === 7) {
      return "Executed";
    } else {
      return "Yet to be triggered";
    }
  };

  useEffect(() => {
    setproposalStateString(proposalStateOutput());
  }, [proposalStateOutput]);

  useEffect(() => {
    let fetch = async ()=>{
      setTimeLeft(await fetchTimeLeft());
      const proposarAddress = "0xd32210cDFAD71568503c5c1ef7C2e6d0f33F3c1b"
      const first_sliced_string_address = proposarAddress.slice(0,8)
      const second_sliced_string_address =  proposarAddress.slice(34,42)
      const sliced_address = `${first_sliced_string_address}........${second_sliced_string_address}`
      setProposarAddress(sliced_address);

      const flag = await getDelegateGovernanceToken()
      console.log("Flag",flag)
    }
    
    fetch()
  });

  return (
    <div
      key={index}
      onClick={() => {
        toggleModal();
      }}
    >
      {modal && (
        <>
          <div className="overlay"></div>
          <div className="modal-content">
            <button className="close-modal" onClick={toggleModal}>
              <b className="text-2xl">X</b>
            </button>
            <div className="modal-leftandright">
              <div className="modal-left">
                <div className="modal-heading">Please read proposals details below:</div>
                <div className="modal-description">
                  <div className="modal-subheading">Proposal Description</div>
                  <div className="modal-subdescription">
                  {data.description}
                  </div>
                </div>
                <div className="modal-quorum">
                  <div className="quorum-heading">
                    Quorum <span style={{ marginLeft: "5px" }}>:</span>
                  </div>
                  <button className="quorum-button">{quorumState}</button>
                </div>
                <div className="modal-proposer">
                  <div className="proposer-heading">Proposer :</div>
                  <button className="quorum-button">
                    {proposarAddress}
                  </button>
                </div>
              </div>
              <div className="modal-right">
                <div className="vote-status-box ">
                  <ul className="px-8 w-54 text-sm text-gray-400 bg-white rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <li
                      className="py-4 px-4 w-full border-b border-gray-200 dark:border-gray-600 text-center"
                      style={{ fontSize: "20px", fontWeight: "600" }}
                    >
                      Voting Stats
                    </li>
                    <li
                      className="py-4 px-4 w-full rounded-t-lg border-b border-gray-200 dark:border-gray-600"
                      style={{ fontSize: "16px", fontWeight: "400" }}
                    >
                      For: {votesFor}
                    </li>
                    <li
                      className="py-4 px-4 w-full border-b border-gray-200 dark:border-gray-600"
                      style={{ fontSize: "16px", fontWeight: "400" }}
                    >
                      Against: {votesAgainst}
                    </li>
                    <li
                      className="py-4 px-4 w-full border-b border-gray-200 dark:border-gray-600"
                      style={{ fontSize: "16px", fontWeight: "400" }}
                    >
                      Abstain: {votesAbstain}
                    </li>
                  </ul>
                </div>
                {/* <hr /> */}
                {proposalState === 1 ? (
                  <div className="modal-place">Place your vote here:</div>
                ) : (
                  <div className="modal-place">Voting has been closed!</div>
                )}
                <div className="modal-buttons">
                  {proposalState === 1 ? (
                    <button
                      type="button"
                      className="for-button"
                      onClick={async () => {
                        await delegateGovernanceToken();
                        await castVoteAndParticipate(data.pId, 1);
                      }}
                    >
                      For
                    </button>
                  ) : (
                    ""
                  )}

                  {proposalState === 1 ? (
                    <button
                      type="button"
                      className="abstain-button"
                      onClick={async () => {
                        await delegateGovernanceToken();
                        await castVoteAndParticipate(data.pId, 2);
                      }}
                    >
                      Abstain
                    </button>
                  ) : (
                    ""
                  )}

                  {proposalState === 1 ? (
                    <button
                      type="button"
                      className="against-button"
                      onClick={async () => {
                        await delegateGovernanceToken();
                        await castVoteAndParticipate(data.pId, 0);
                      }}
                    >
                      Against
                    </button>
                  ) : (
                    ""
                  )}
                  {proposalState === 4 ? (
                    <button
                      type="button"
                      className="queue-button"
                      onClick={async () => {
                        await queueGovernance(
                          process.env.REACT_APP_TREASURY_CONTRACT,
                          data.description,
                          data.calldatas
                        );
                      }}
                    >
                      Queue
                    </button>
                  ) : (
                    ""
                  )}
                  {proposalState === 5 ? (
                    <button
                      type="button"
                      className="execute-button"
                      onClick={async () => {
                        await executeGovernance(
                          process.env.REACT_APP_TREASURY_CONTRACT,
                          data.description,
                          data.calldatas
                        );
                      }}
                    >
                      Execute
                    </button>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <a
        href="#"
        className="block p-6 m-2 max-w-2xl    rounded-lg border shadow-md hover:bg-gray-700"
        style={{ borderColor: "#2d2d2d", marginBottom: "16px" }}
      >
        <div className="mb-3 flex flex-row justify-between">
          <div className="flex flex-row">
            <img
              src="https://mdbootstrap.com/img/new/standard/city/041.jpg"
              className=" h-6 w-6 rounded-full"
              alt=""
            />
            <p className=" font-medium text-gray-400 ml-2">Raspberry DAO</p>
          </div>

          <button className="bg-green-500 hover:bg-blue-700 text-white font-bold  px-3 rounded-full">
            {proposalStateString}
          </button>
        </div>
        <h5 className="mb-2 text-2xl font-bold tracking-tight  text-white group-hover:text-gray-400">
          {data.description}
        </h5>
        <p className="font-normal text-gray-400">
          They have built-in treasuries that no one has the authority to access
          without the approval of the group. Decisions are governed by proposals
          and voting to ensure everyone in the organization has a voice.
        </p>
        <p className="font-normal text-gray-400">
          <b> Ends In: {timeLeft} </b>
        </p>
      </a>
    </div>
  );
};

export default Card;
