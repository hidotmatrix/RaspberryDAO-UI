import { ethers } from "ethers";
import { app, credentials } from "../../utils/mongo-client/mongo.client"; //add


import Token from "../../contracts/Token.json";
import Governance from "../../contracts/Governance.json";
import TimeLock from "../../contracts/TimeLock.json";
import Treasury from "../../contracts/Treasury.json";
import { GOCERNANCE_TOKEN_CONTRACT_ADDRESS, GOVERNANCE_CONRACT_ADDRESS, TIMELOCK_CONTRACT_ADDRESS, TREASURY_CONTRACT_ADDRESS } from "../../constants/constants";


// provider
const provider = new ethers.providers.Web3Provider(window.ethereum);

// fetching contract adderesses
const tokenContract = GOCERNANCE_TOKEN_CONTRACT_ADDRESS;
const timelockContract = TIMELOCK_CONTRACT_ADDRESS;
const governanceContract = GOVERNANCE_CONRACT_ADDRESS;
const treasuryContract = TREASURY_CONTRACT_ADDRESS;

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
    const getVotes = await tokenContractInstance.getVotes(signer);
    const votes = ethers.utils.formatUnits(getVotes.toString(),"ether");

    if(Number(votes.toString())===0){
     await tokenContractInstance.connect(signerObj).delegate(signer)
    }
  } catch (err) {
    console.log(err);
  }
};

// delegate token
export const getDelegateGovernanceToken = async () => {
  try {
    await getSigner();
    const getVotes = await tokenContractInstance.getVotes(signer);
    const votes = ethers.utils.formatUnits(getVotes.toString(),"ether");

    if(Number(votes.toString())===0){
     return false
    }
    return true;
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

export const createProposal = async (treasuryAction,treasuryContractAddress, description, fundToRelease, fundToRecepient,selectedNFTAdress,selectedNFTTokenID,NFTrecepient) => {
  console.log("Action",treasuryAction)
  console.log("fund to recepient",fundToRecepient)
  console.log("Selected NFT Address",selectedNFTAdress)
  console.log("selected NFT Token ID",selectedNFTTokenID)
  console.log("selected NFt recepient",NFTrecepient)

  const treasuryContractBalanceInWei = await provider.getBalance(TREASURY_CONTRACT_ADDRESS)
  
  const treasuryContractBalanceInEther= ethers.utils.formatEther(treasuryContractBalanceInWei);
  const etherBalanceTresuryContractNum = Number(treasuryContractBalanceInEther);
  const THRESOLD_TREASURY_BALANCE = ((10*etherBalanceTresuryContractNum)/100)+0.001;
  console.log("THREASOLD TREASURY Balance",ethers.utils.parseUnits(THRESOLD_TREASURY_BALANCE.toString(), "ether").toString())

  const _amount = (ethers.utils.parseEther(fundToRelease)).toString()
  const encodedFunctionLocalScope = iface.encodeFunctionData("withdrawFunds",[_amount]);
  console.log("Encode Function bytes",encodedFunctionLocalScope)

  await getSigner();
  const userVotes = await tokenContractInstance.getVotes(signer);
  const userGovTokenBalance = await tokenContractInstance.balanceOf(signer);
  console.log("userGov token balance",userGovTokenBalance)
  if(userGovTokenBalance.toString()=== "0"){
    return
  }
  if(userVotes.toString() === "0" && userGovTokenBalance.toString()!=="0"){
    let tx = await tokenContractInstance.connect(signerObj).delegate(signer);
    let txReceipt = await tx.wait(1);
    console.log("Delegate Receipt",txReceipt)
  }

  let tx = await governanceContractInstance
    .connect(signerObj)
    .lockFundsAndPropose([TREASURY_CONTRACT_ADDRESS], [0], [encodedFunctionLocalScope], description,{value: ethers.utils.parseUnits(THRESOLD_TREASURY_BALANCE.toString(), "ether")});
  let txReceipt = await tx.wait(1);
  console.log("Tx Logs",txReceipt);
  const proposalCreated = txReceipt.events[1].args;
  if(txReceipt.status){
    const user = await app.logIn(credentials);
    const insertedProposal = await user.functions.createProposal(proposalCreated.proposalId, proposalCreated.proposer, proposalCreated.targets, proposalCreated.values, proposalCreated.signatures, proposalCreated.calldatas, proposalCreated.startBlock, proposalCreated.endBlock, proposalCreated.description);
    console.log("Proposal Inserted",insertedProposal)
  }
  console.log("Event Logs",txReceipt.events[1].args);
  let id = await txReceipt.events[1].args.proposalId;
  console.log(String(id));
};

// show in UI - the current STATE of the proposal (use setTimeOut function here)
export const getProposalState = async (proposalId) => {
  return await governanceContractInstance.connect(provider).state(proposalId);
};

// show in UI - quorum(min number of votes required)
export const getQuorum = async (provider) => {
  let blockNumber = await provider.getBlockNumber();
  let quorum = await governanceContractInstance
    .connect(provider)
    .quorum(blockNumber - 2);
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
  return { voteAgainst, voteFor, voteAbstain };
};

// create queue for the proposal
export const queueGovernance = async (treasuryContract,proposalId,description,encodedFunction) => {
  const hash = ethers.utils.id(description)
  await getSigner();
  await governanceContractInstance
    .connect(signerObj)
    .queue([TREASURY_CONTRACT_ADDRESS], [0],encodedFunction,hash);
};

// create execute the proposal
export const executeGovernance = async (treasuryContract,description,encodedFunction) => {
  const hash = ethers.utils.id(description)
  await getSigner();
  await governanceContractInstance
    .connect(signerObj)
    .execute([TREASURY_CONTRACT_ADDRESS], [0], encodedFunction, hash);
};

export const fetchProposalLength = async () => {
  
  return String(
    await governanceContractInstance.connect(provider).proposalIterator()
  );
};


export const fetchProposalData = async (result) => {
  const user = await app.logIn(credentials);
  const proposals = await user.functions.getAllProposals();
  console.log("Proposals",proposals)
  return proposals;
};
