require('dotenv').config();

const HDWalletProvider = require("truffle-hdwallet-provider");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    ropsten: {
      provider: function() {
        return new HDWalletProvider(
          process.env.MNEMONIC,
          `https://ropsten.infura.io/v3/${process.env.INFURA_API_KEY}`
        )
      },
      gasPrice: 25000000000,
      network_id: 3
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(
          process.env.MNEMONIC,
          `https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`
        )
      },
      gasPrice: 25000000000,
      network_id: 4
    },
    development: {
      host: "127.0.0.1",
      port: "7545",
      network_id: "*" // match any network id
    },
    syu: {
      host: "localhost",
      port: 8545,
      network_id: 33,
      gas: 4700000
    },
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
};
