const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Testing Governance Flow", async () => {
  let TokenContract;
  let tokenContract;
  let TimelockContract;
  let timelockContract;
  let GovernanceContract;
  let governanceContract;
  let TreasuryContract;
  let treasuryContract;

  let provider;

  const treasuryABI = [
    {
      inputs: [
        {
          internalType: "address",
          name: "_payee",
          type: "address",
        },
      ],
      stateMutability: "payable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "previousOwner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "OwnershipTransferred",
      type: "event",
    },
    {
      inputs: [],
      name: "isReleased",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "payee",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "releaseFunds",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "renounceOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "totalFunds",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "transferOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];

  function waitForTx(ms) {
    return new Promise((res) => {
      setTimeout(res, ms);
    });
  }

  before(async () => {
    [owner, address1, address2, address3, address4, address5] =
      await ethers.getSigners();

    provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");

    // deploying token contract
    const tokenName = "Governance Token";
    const tokenSymbol = "GVNT";
    const initialSupply = ethers.utils.parseEther("1000");

    TokenContract = await ethers.getContractFactory("Token");
    tokenContract = await TokenContract.deploy(
      tokenName,
      tokenSymbol,
      initialSupply
    );
    console.log("deploying token contract...");
    tokenContract.deployed();
    console.log("token contract address:", tokenContract.address);

    // transfer some initial tokens to participants
    // this can be managed using a exchange to provide utility token
    const amountToTransferInParticipantWallet = ethers.utils.parseUnits("50");

    await tokenContract.transfer(
      address1.address,
      amountToTransferInParticipantWallet
    );
    await tokenContract.transfer(
      address2.address,
      amountToTransferInParticipantWallet
    );
    await tokenContract.transfer(
      address3.address,
      amountToTransferInParticipantWallet
    );
    await tokenContract.transfer(
      address4.address,
      amountToTransferInParticipantWallet
    );
    await tokenContract.transfer(
      address5.address,
      amountToTransferInParticipantWallet
    );

    await tokenContract.connect(address1).delegate(address1.address);
    await tokenContract.connect(address2).delegate(address2.address);
    await tokenContract.connect(address3).delegate(address3.address);
    await tokenContract.connect(address4).delegate(address4.address);
    await tokenContract.connect(address5).delegate(address5.address);

    // deploying timelock contract
    const minDelay = 0; // How long do we have to wait until we can execute after a passed proposal (in block numbers)
    TimelockContract = await ethers.getContractFactory("TimeLock");
    timelockContract = await TimelockContract.deploy(
      minDelay,
      [owner.address],
      [owner.address]
    );
    console.log("Deploying timelock contract...");
    await timelockContract.deployed();
    console.log("Timelock contract address", timelockContract.address);

    // deploy governance contract
    const quorum = 5;
    const votingDelay = 0;
    const votingPeriod = 5;

    GovernanceContract = await ethers.getContractFactory("Governance");
    governanceContract = await GovernanceContract.deploy(
      tokenContract.address,
      timelockContract.address,
      quorum,
      votingDelay,
      votingPeriod
    );

    console.log("Deploying governance contract...");
    await governanceContract.deployed();
    console.log("Governance contract address:", governanceContract.address);

    // deploy treasury contract
    const funds = ethers.utils.parseEther("10");
    console.log("funds", funds);

    TreasuryContract = await ethers.getContractFactory("Treasury");
    treasuryContract = await TreasuryContract.deploy(owner.address, {
      value: funds,
    });
    console.log("Deploying treasury contract...");
    await treasuryContract.deployed();
    console.log("Treasury contract address:", treasuryContract.address);

    // transfer treasury ownership to executor
    let treasuryOwnership = await treasuryContract.transferOwnership(
      timelockContract.address
    );
    await treasuryOwnership.wait();

    // Assign roles
    const proposerRole = await timelockContract.PROPOSER_ROLE();
    const executorRole = await timelockContract.EXECUTOR_ROLE();

    await timelockContract.grantRole(proposerRole, governanceContract.address);
    await timelockContract.grantRole(executorRole, governanceContract.address);
  });

  describe("ERC20 Governance Token Data", () => {
    it("Token Name", async () => {
      expect(await tokenContract.name()).to.equal("Governance Token");
    });

    it("Token Symbol", async () => {
      expect(await tokenContract.symbol()).to.equal("GVNT");
    });
  });

  describe("Governance Contract Interaction", () => {
    let proposalId;
    let encodedFunction;
    before("Create Proposal", async () => {
      const iface = new ethers.utils.Interface(treasuryABI);
      // console.log(iface);
      encodedFunction = iface.encodeFunctionData("releaseFunds");
      console.log(encodedFunction);

      // description
      const description = "Release funds from treasury";

      let tx = await governanceContract.propose(
        [treasuryContract.address],
        [0],
        [encodedFunction],
        description
      );

      let txReceipt = await tx.wait(1);
      let id = await txReceipt.events[0].args.proposalId;
      proposalId = String(id);
    });

    it("Treasury should have funds", async () => {
      let funds = await provider.getBalance(treasuryContract.address);
      let parseFunds = ethers.utils.formatEther(String(funds));
      expect(parseFunds).to.equal("10.0");
    });

    it("should not release funds", async () => {
      let check = await treasuryContract.isReleased();
      let parseCheck = String(check);
      expect(parseCheck).to.equal("false");
    });

    it("should create proposal", async () => {
      let data = await governanceContract.proposals(1);
      let dataId = String(data.proposalId);
      expect(proposalId).to.equal(dataId);
    });

    it("should fetch quorum", async () => {
      let blockNumber = await provider.getBlockNumber();
      let quorum = await governanceContract.quorum(blockNumber - 1);
      let parseQuorum = ethers.utils.formatEther(String(quorum));
      expect(parseQuorum).to.equal("50.0");
    });

    it("should caste vote", async () => {
      let blockNumber = await provider.getBlockNumber();

      let start = await governanceContract.proposalSnapshot(proposalId);
      console.log("Proposal started at block:", String(start));

      let end = await governanceContract.proposalDeadline(proposalId);
      console.log("Proposal end at block:", String(end));

      let voteRequired = await governanceContract.quorum(blockNumber - 1);
      console.log("Votes required to win:", String(voteRequired));

      console.log("casting votes...");

      let amount = ethers.utils.parseEther("1.0");
      let proposalState;

      proposalState = await governanceContract.state(proposalId);
      console.log("Proposal State:", proposalState, "(Pending)");

      // 0 - Against, 1 - For, 2 - Abstain
      await governanceContract.connect(address1).castVote(proposalId, 1);
      await governanceContract.connect(address2).castVote(proposalId, 1);
      await governanceContract.connect(address3).castVote(proposalId, 1);
      await governanceContract.connect(address4).castVote(proposalId, 1);
      await governanceContract.connect(address5).castVote(proposalId, 1);

      proposalState = await governanceContract.state(proposalId);
      console.log("Proposal state:", proposalState, "(Active)");

      // adding one block to the chain
      await tokenContract.transfer(address1.address, amount, {
        from: owner.address,
      });

      const { againstVotes, forVotes, abstainVotes } =
        await governanceContract.proposalVotes(proposalId);
      console.log("Votes For:", String(forVotes));
      console.log("Votes Against:", String(againstVotes));
      console.log("Votes Abstain:", String(abstainVotes));

      blockNumber = await provider.getBlockNumber();
      console.log("Current blocknumber:", blockNumber);

      proposalState = await governanceContract.state(proposalId);
      console.log("Proposal State", proposalState, "(Success)");

      expect(String(await governanceContract.state(proposalId))).to.equal(
        String(4)
      );
    });

    it("should queue the proposal", async () => {
      let hash =
        "0x9b384e2727bcd2b4a6a8c98e63706d7c8f78ab60cffc95c9258b363b339ef509";
      await governanceContract
        .connect(owner)
        .queue([treasuryContract.address], [0], [encodedFunction], hash);

      let proposalState;
      proposalState = await governanceContract.state(proposalId);
      console.log("Proposal State", proposalState, "(Queue)");

      expect(String(await governanceContract.state(proposalId))).to.equal(
        String(5)
      );
    });

    it("should execute the proposal", async () => {
      let hash =
        "0x9b384e2727bcd2b4a6a8c98e63706d7c8f78ab60cffc95c9258b363b339ef509";
      await governanceContract
        .connect(owner)
        .execute([treasuryContract.address], [0], [encodedFunction], hash);

      let proposalState;
      proposalState = await governanceContract.state(proposalId);
      console.log("Proposal State", proposalState, "(Executed)");

      expect(String(await governanceContract.state(proposalId))).to.equal(
        String(7)
      );
    });
  });

  describe("Treasury Contract Interaction", () => {
    it("should release funds", async () => {
      expect(String(await treasuryContract.isReleased())).to.equal(
        String(true)
      );
    });

    it("treasury balance should be 0", async () => {
      let funds = await provider.getBalance(treasuryContract.address);
      let parseFunds = ethers.utils.formatEther(String(funds));
      expect(parseFunds).to.equal("0.0");
    });
  });
});
