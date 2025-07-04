require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  networks: {
    coston2: {
      url: "https://coston2-api.flare.network/ext/C/rpc",
      accounts: [`0x${process.env.PRIVATE_KEY}`],
      chainId: 114,
    },
  },
  solidity: "0.8.28",
};