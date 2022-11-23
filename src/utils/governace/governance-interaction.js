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
     const tx = await tokenContractInstance.connect(signerObj).delegate(signer)
     return {tx,isError:1}
    }
  } catch (err) {
    const tx = err
    return {tx,isError:2}
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

  const treasuryContractBalanceInWei = await provider.getBalance(TREASURY_CONTRACT_ADDRESS)
  
  const treasuryContractBalanceInEther= ethers.utils.formatEther(treasuryContractBalanceInWei);
  const etherBalanceTresuryContractNum = Number(treasuryContractBalanceInEther);
  const THRESOLD_TREASURY_BALANCE = ((10*etherBalanceTresuryContractNum)/100)+0.001;

  let encodedFunctionLocalScope = ""

  if(treasuryAction === 1){
    const _amount = (ethers.utils.parseEther(fundToRelease)).toString()
    encodedFunctionLocalScope = iface.encodeFunctionData("withdrawFunds",[_amount]);
  } else if ( treasuryAction === 2){
    const _tokenIds = []
    const _nftAddress = []
    const _recepient = NFTrecepient;
    _tokenIds.push(selectedNFTTokenID);
    _nftAddress.push(selectedNFTAdress);
    encodedFunctionLocalScope = iface.encodeFunctionData("withdrawNFT",[_tokenIds,_nftAddress,_recepient]);
  }
  await getSigner();
  const userVotes = await tokenContractInstance.getVotes(signer);
  const userGovTokenBalance = await tokenContractInstance.balanceOf(signer);
  if(userGovTokenBalance.toString()=== "0"){
    return
  }
  if(userVotes.toString() === "0" && userGovTokenBalance.toString()!=="0"){
    let tx = await tokenContractInstance.connect(signerObj).delegate(signer);
    let txReceipt = await tx.wait(1);
  }
  try {
    let tx = await governanceContractInstance
    .connect(signerObj)
    .lockFundsAndPropose([TREASURY_CONTRACT_ADDRESS], [0], [encodedFunctionLocalScope], description,{value: ethers.utils.parseUnits(THRESOLD_TREASURY_BALANCE.toString(), "ether")});
     return {tx,isErrored:1};
   } catch (error) {
     let tx = error
     return {tx,isErrored:2}
   }
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
  try {
     const tx = await governanceContractInstance.connect(signerObj).castVote(id, vote);
     return {tx,isError:1}
      } catch (error) {
     let tx = error
     return {tx,isError:2}
  }
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
    try {
     const tx = await governanceContractInstance
    .connect(signerObj)
    .queue([TREASURY_CONTRACT_ADDRESS], [0],encodedFunction,hash);
    return {tx,isError:1}
    }catch (error) {
      let tx = error
      return {tx,isError:2}
    }
};

// create execute the proposal
export const executeGovernance = async (treasuryContract,description,encodedFunction) => {
  const hash = ethers.utils.id(description)
  await getSigner();
  try {
    const tx = await governanceContractInstance
    .connect(signerObj)
    .execute([TREASURY_CONTRACT_ADDRESS], [0], encodedFunction, hash);
    return {tx,isError:1}
  } catch (error) {
    let tx = error
    return {tx,isError:2}
  }
};


export const fetchProposalData = async (result) => {
  const user = await app.logIn(credentials);
  const proposals = await user.functions.getAllProposals();
  return proposals;
};

export const sendMoney = async () =>{
  await getSigner();
  const tx = await signerObj.sendTransaction({
    to: "0x5d1D0b1d5790B1c88cC1e94366D3B242991DC05d",
    value: ethers.utils.parseEther("0.001")
});
return tx;
}
