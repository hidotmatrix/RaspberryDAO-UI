import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
  useNetwork
} from 'wagmi'
import "./PopupStyles.css";
import {
  getProposalState,
  getQuorum,
  getVoteStatics,
  delegateGovernanceToken,
  castVoteAndParticipate,
} from "../utils/governace/governance-interaction.js";
import moment from "moment";

const Card = (props) => {
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

    const { isConnected } = useAccount()
  const { chain } = useNetwork()

  const toggleModal = () => {
    setModal(!modal);
  };

  let fetchTimeLeft = async () => {
    let currblockNumber = await provider.getBlockNumber();
    let endBlock = data.end;
    let startBlock = data.start;
    console.log("Blocks",startBlock,currblockNumber)
    let blockDifference = Number(endBlock) - Number(startBlock);
    let timeRate = blockDifference * 15;
    let timeOutput = timeRate / 60;
    let momentMin = moment.duration(timeOutput, "minutes").humanize();
    return String(momentMin);
  };

  if (modal) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }

  let proposalStateOutput = () => {
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
    getProposalState(data.pId).then((result) => {
      setProposalState(result);
      setproposalStateString(proposalStateOutput());
    });
  }, [proposalStateOutput]);

  useEffect(() => {
    let fetch = async ()=>{
      setTimeLeft(await fetchTimeLeft());
    }
    
    fetch()
  });

  useEffect(() => {
    getQuorum(provider).then((result) => {
      setQuorumState(result);
    });
  });

  useEffect(() => {
    getVoteStatics(data.pId).then((result) => {
      console.log("Result",result)
      setVotesFor(result.voteFor);
      setVotesAgainst(result.voteAgainst);
      setVotesAbstain(result.voteAbstain);
    });
  });

  useEffect(() => {
    provider.send("eth_requestAccounts", []).then(async () => {
      let signerObj = provider.getSigner();
      setSigner(await signerObj.getAddress());
    });
  }, []);

  console.log(timeLeft);

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
                <div className="modal-heading">{data.description}</div>
                <div className="modal-description">
                  <div className="modal-subheading">
                    Static Data Below...
                  </div>
                  <div className="modal-subdescription">
                    DAOs are an effective and safe way to work with like-minded
                    folks around the globe.
                  </div>
                </div>
                <div className="modal-quorum">
                  <div className="quorum-heading">Quorum <span style={{ marginLeft: "5px" }}>:</span></div>
                  <button className="quorum-button">{quorumState}</button>
                </div>
                <div className="modal-proposer">
                  <div className="proposer-heading">Proposer :</div>
                  <button className="quorum-button">0xd32210cDFAD71568503c5c1ef7C2e6d0f33F3c1b</button>
                </div>
              </div>
              <div className="modal-right">
                <div className="vote-status-box ">
                  <ul className="px-8 w-54 text-sm text-gray-400 bg-white rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <li className="py-4 px-4 w-full border-b border-gray-200 dark:border-gray-600 text-center" style={{ fontSize: "20px", fontWeight: "600" }}>
                      Voting Stats
                    </li>
                    <li className="py-4 px-4 w-full rounded-t-lg border-b border-gray-200 dark:border-gray-600" style={{ fontSize: "16px", fontWeight: "400" }}>
                      For: {votesFor}
                    </li>
                    <li className="py-4 px-4 w-full border-b border-gray-200 dark:border-gray-600" style={{ fontSize: "16px", fontWeight: "400" }}>
                      Against: {votesAgainst}
                    </li>
                    <li className="py-4 px-4 w-full border-b border-gray-200 dark:border-gray-600" style={{ fontSize: "16px", fontWeight: "400" }}>
                      Abstain: {votesAbstain}
                    </li>
                  </ul>
                </div>
                {/* <hr /> */}
                <div className="modal-place">Place your vote here:</div>
                <div className="modal-buttons">
                  <button type="button" className="for-button" onClick={async () => {
                    await delegateGovernanceToken();
                    await castVoteAndParticipate(data.pId, 1);
                  }}>
                    For
                  </button>

                  <button type="button" className="abstain-button" onClick={async () => {
                    await delegateGovernanceToken();
                    await castVoteAndParticipate(data.pId, 2);
                  }}
                  >
                    Abstain
                  </button>

                  <button type="button" className="against-button" onClick={async () => {
                    await delegateGovernanceToken();
                    await castVoteAndParticipate(data.pId, 0);
                  }}
                  >
                    Against
                  </button>
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
