import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
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
  const { data, index } = props;
  const [modal, setModal] = useState(false);
  const [proposalState, setProposalState] = useState();
  const [proposalStateString, setproposalStateString] = useState("");
  const [quorumState, setQuorumState] = useState();
  const [votesFor, setVotesFor] = useState();
  const [votesAgainst, setVotesAgainst] = useState();
  const [votesAbstain, setVotesAbstain] = useState();
  const [signer, setSigner] = useState();
  const [timeLeft, setTimeLeft] = useState();

  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const toggleModal = () => {
    setModal(!modal);
  };

  let fetchTimeLeft = () => {
    let endBlock = data.end;
    let startBlock = data.start;
    let blockDifference = endBlock - startBlock;
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
    console.log("inside output:", proposalState);
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
    setTimeLeft(fetchTimeLeft());
  })

  useEffect(() => {
    getQuorum().then((result) => {
      setQuorumState(result);
    });
  }) 

  useEffect(() => {
    getVoteStatics(data.pId).then((result) => {
      setVotesFor(result.voteFor);
      setVotesAgainst(result.voteAgainst);
      setVotesAbstain(result.voteAbstain);
    });
  })

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
        toggleModal()
      }}
    >
      {modal && (
        <div className="modal justify-start ">
          <div className="overlay"></div>
          <div className="modal-content">
            <h1>
              <b className="text-2xl"> {data.description} </b>
            </h1>
            <p>
              {" "}
              <small>
                <b>
                  {" "}
                  Static Data Below. This can be replaced with a useful data{" "}
                  <br />
                  DAOs are an effective and safe way to work with like-minded
                  folks around the globe.
                </b>
              </small>
            </p>
            <br />
            
            <p>
              {" "}
              <b>Quorum: </b>
              <button
                type="button"
                class="py-2 px-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                {" "}
                {quorumState}
              </button>
            </p>
            
            <div className="vote-status-box ">
            <ul className="px-8 w-48 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <li className="py-2 px-4 w-full border-b border-gray-200 dark:border-gray-600 text-center">
                <b>Voting Stats</b>
              </li>
              <li className="py-2 px-4 w-full rounded-t-lg border-b border-gray-200 dark:border-gray-600">
                For: {votesFor}{" "}
              </li>
              <li className="py-2 px-4 w-full border-b border-gray-200 dark:border-gray-600">
                Against: {votesAgainst}{" "}
              </li>
              <li className="py-2 px-4 w-full border-b border-gray-200 dark:border-gray-600">
                Abstain: {votesAbstain}{" "}
              </li>
            </ul>
            </div>
            <hr />
            <p>
              <b className="text-base"> Place your vote here: </b>
              <button
                type="button"
                className="h-8 px-4 m-2	 focus:outline-none text-black bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                onClick={async () => {
                  await delegateGovernanceToken();
                  await castVoteAndParticipate(data.pId, 1);
                }}
              >
                <small>
                  {" "}
                  <b>For</b>{" "}
                </small>
              </button>
              {/**
               * Against
               */}
              <button
                type="button"
                className="h-8 px-4 m-2  focus:outline-none text-black bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:focus:ring-yellow-900"
                onClick={async () => {
                  await delegateGovernanceToken();
                  await castVoteAndParticipate(data.pId, 0);
                }}
              >
                <small>
                  {" "}
                  <b>Against</b>{" "}
                </small>
              </button>

              <button
                type="button"
                className="h-8 px-4 m-2 focus:outline-none text-black bg-yellow-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                onClick={async () => {
                  await delegateGovernanceToken();
                  await castVoteAndParticipate(data.pId, 2);
                }}
              >
                <small>
                  {" "}
                  <b>Abstain</b>{" "}
                </small>
              </button>
            </p>
            <button className="close-modal" onClick={toggleModal}>
              <b className="text-2xl">X</b>
            </button>
          </div>
        </div>
      )}
      <a
        href="#"
        className="block p-6 m-2 max-w-2xl    rounded-lg border shadow-md hover:bg-gray-700"
        style={{ borderColor: "#2d2d2d" }}
      >
        <div className="mb-3 flex flex-row justify-between">
          <div className="flex flex-row">
            <img
              src="https://mdbootstrap.com/img/new/standard/city/041.jpg"
              className=" h-6 w-6 rounded-full"
              alt=""
            />
            <p className=" font-medium text-gray-400 ml-2">Solulab DAO</p>
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
          {" "}
          <b> Ends In: {timeLeft} </b>{" "}
        </p>
      </a>
    </div>
  );
};

export default Card;
