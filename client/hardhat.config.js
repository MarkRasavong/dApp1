
require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html

// tasks("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
//   const accounts = await hre.ethers.getSigners();

//   for (const account of accounts) {
//     console.log(account.address);
//   }
// });

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

//config, deploy to different networks, abis(machine reable code), artifacts, 

const key = process.env.REACT_APP_ACCT_KEY;

module.exports = {
  solidity: "0.8.4",
  paths: {
    artifacts: './src/artifacts',
  },
  networks: {
    //local network
    hardhat: {
      chainId: 1337,
    },
    ropsten: {
      url: 'https://ropsten.infura.io/v3/69837c3212774aceb77127cba2f708a5',
      accounts: [`0x${key}`]
    }
  }
};

//ropsten etherscan
//0x9C2AC8cB99BBe55502D89e8e7C1A5BFd008D6685