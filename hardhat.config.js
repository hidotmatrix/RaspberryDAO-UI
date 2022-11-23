require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require('dotenv').config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    goerli: {
      url: process.env.REACT_APP_ALCHEMY_RPC_URL,
      accounts: [process.env.REACT_APP_DEPLOYER_PRIV_KEY]
    },
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    ropsten: {
      url: process.env.REACT_APP_ALCHEMY_RPC_URL || "",
      accounts:
        process.env.REACT_APP_DEPLOYER_PRIV_KEY !== undefined ? [process.env.REACT_APP_DEPLOYER_PRIV_KEY] : [],
      gas: "auto"
    },
    rinkeby: {
      url: process.env.REACT_APP_ALCHEMY_RPC_URL || "",
      accounts:
        process.env.REACT_APP_DEPLOYER_PRIV_KEY !== undefined ? [process.env.REACT_APP_DEPLOYER_PRIV_KEY] : [],
      gas: "auto"
    },
    goerli: {
      url: process.env.REACT_APP_ALCHEMY_RPC_URL || "",
      accounts:
        process.env.REACT_APP_DEPLOYER_PRIV_KEY !== undefined ? [process.env.REACT_APP_DEPLOYER_PRIV_KEY] : [],
      gas: "auto"
    },
    bscTestnet: {
      url: process.env.REACT_APP_ALCHEMY_RPC_URL || "",
      accounts:
        process.env.REACT_APP_DEPLOYER_PRIV_KEY !== undefined ? [process.env.REACT_APP_DEPLOYER_PRIV_KEY] : [],
      gas: "auto"
    },
    polygonTestnet: {
      url: process.env.REACT_APP_ALCHEMY_RPC_URL || "",
      accounts:
        process.env.REACT_APP_DEPLOYER_PRIV_KEY !== undefined ? [process.env.REACT_APP_DEPLOYER_PRIV_KEY] : [],
      gas: "auto"
    },
    localhost: {
      url: "http://127.0.0.1:8545",
    },
  },
  etherscan: {
    apiKey: {
      goerli: process.env.REACT_APP_ETHERSCAN_API_KEY,
    },
  },
  mocha: {
    timeout: 80000
  }
};