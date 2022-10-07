import { ethers } from "ethers";

import Token from "../../contracts/Token.json";
import Governance from "../../contracts/Governance.json";
import TimeLock from "../../contracts/TimeLock.json";
import Treasury from "../../contracts/Treasury.json";

// provider
const provider = new ethers.providers.Web3Provider(window.ethereum);

// fetching contract adderesses
const tokenContract = process.env.REACT_APP_TOKEN_CONTRACT;
const timelockContract = process.env.REACT_APP_TIMELOCK_CONTRACT;
const governanceContract = process.env.REACT_APP_GOVERNANCE_CONTRACT;
const treasuryContract = process.env.REACT_APP_TREASURY_CONTRACT;

// fetching contract ABIs
const tokenABI = Token.abi;
const treasuryABI = Treasury.abi;
const governanceABI = Governance.abi;
const timelockABI = TimeLock.abi;

// Initiating contract instance:
const tokenContractInstance = new ethers.Contract(
  tokenContract,
  tokenABI,
  provider
);
const timelockContractInstnce = new ethers.Contract(
  timelockContract,
  timelockABI,
  provider
);
const governanceContractInstance = new ethers.Contract(
  governanceContract,
  governanceABI,
  provider
);
const treasuryContractInstance = new ethers.Contract(
  treasuryContract,
  treasuryABI,
  provider
);

// signer
// initiating signerObj, signer and proposalId
let signer;
let signerObj;

// Getting signer from provider:
const getSigner = async () => {
  await provider.send("eth_requestAccounts", []);
  signerObj = provider.getSigner();
  signer = await signerObj.getAddress();
};

// delegate token
export const delegateGovernanceToken = async () => {
  try {
    await getSigner();
    console.log(signer);
    console.log("provider", provider);
    await tokenContractInstance.connect(signerObj).delegate(signer);
  } catch (err) {
    console.log(err);
  }
};

// show in UI - funds inside treasury
export const fundsInsideTreasury = async () => {
  let funds = await provider.getBalance(treasuryContract);
  let parseFunds = ethers.utils.formatEther(String(funds));
  console.log(parseFunds);
  return parseFunds;
};

// check is funds released from treasury
export const checkFundReleaseFromTreasury = async () => {
  return await treasuryContractInstance.connect(provider).isReleased();
};

// treausy address
export const checkTreasuryAddress = async () => {
  return tokenContract;
};

// treasury name
export const checkTreasuryName = async () => {
  return await tokenContractInstance.connect(provider).name();
};

// treasury symbol
export const checkTreasurySymbol = async () => {
  return await tokenContractInstance.connect(provider).symbol();
};

// create proposal
const iface = new ethers.utils.Interface(Treasury.abi);
// console.log(iface);
const encodedFunction = iface.encodeFunctionData("releaseFunds");
// console.log("encoded function", encodedFunction);
// const description = "Release Fund From Treasuryi";
export const createProposal = async (treasuryContractAddress, description) => {
  console.log(signerObj);
  console.log(signer);
  await getSigner();
  let tx = await governanceContractInstance
    .connect(signerObj)
    .propose([treasuryContractAddress], [0], [encodedFunction], description);
  let txReceipt = await tx.wait(1);
  console.log(txReceipt);
  let id = await txReceipt.events[0].args.proposalId;
  console.log(String(id));
};

// show in UI - the current STATE of the proposal (use setTimeOut function here)
export const getProposalState = async (proposalId) => {
  return await governanceContractInstance.connect(provider).state(proposalId);
};

// show in UI - quorum(min number of votes required)
export const getQuorum = async () => {
  let blockNumber = await provider.getBlockNumber();
  let quorum = await governanceContractInstance
    .connect(provider)
    .quorum(blockNumber - 1);
  let parseQuorum = ethers.utils.formatEther(String(quorum));
  return parseQuorum;
};

// make a function to caste vote - take flag as a input (0, 1, 2)
// 1 - For
// 0 - Against
// 2 - Abstain
export const castVoteAndParticipate = async (id, vote) => {
  await getSigner();
  await governanceContractInstance.connect(signerObj).castVote(id, vote);
};

// show in UI - voting statics - how many votes are FOR, AGAINST, ABSTAIN
export const getVoteStatics = async (id) => {
  let { againstVotes, forVotes, abstainVotes } =
    await governanceContractInstance.connect(provider).proposalVotes(id);
  let voteAgainst = Math.trunc(ethers.utils.formatEther(String(againstVotes)));
  let voteFor = Math.trunc(ethers.utils.formatEther(String(forVotes)));
  let voteAbstain = Math.trunc(ethers.utils.formatEther(String(abstainVotes)));
  console.log("votes:", voteAgainst, voteFor, voteAbstain);
  return { voteAgainst, voteFor, voteAbstain };
};

// create queue for the proposal
export const queueGovernance = async () => {
  
  let hash =
    "0xc7d305603a21f5c8583039820cc493f6f7f82ba1ff58b47f8138d2b8a441444c";
  await getSigner();
  await governanceContractInstance
    .connect(signerObj)
    .queue([treasuryContract], [0], [encodedFunction], hash);
};

// create execute the proposal
export const executeGovernance = async () => {
  let hash =
    "0xc7d305603a21f5c8583039820cc493f6f7f82ba1ff58b47f8138d2b8a441444c";
  await getSigner();
  await governanceContractInstance
    .connect(signerObj)
    .execute([treasuryContract], [0], [encodedFunction], hash);
};

export const fetchProposalLength = async () => {
  
  return String(
    await governanceContractInstance.connect(provider).proposalIterator()
  );
};

let startResult = 0;
let proposalData = [];
export const fetchProposalData = async () => {
  const dataLength = await fetchProposalLength();
  if(dataLength === proposalData.length) {
    return;
  } 
  fetchProposalLength().then(async (result) => {
    
    if (result > startResult) {
      for (let i = 1; i <= result; i++) {
        let data = await governanceContractInstance
          .connect(provider)
          .proposals(i);
          console.log(data);
        let parseData = {
          id: String(data[0]),
          description: data[1],
          pId: String(data[2]),
          start: String(data[3]),
          end: String(data[4]),
        };
        proposalData.push(parseData);
      }
      startResult = result;
    }
  });
  return proposalData;
};
