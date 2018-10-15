var UCoinToken = artifacts.require("./UCoinToken.sol");
var UCoinTokenSale = artifacts.require("./UCointokenSale.sol");

module.exports = function(deployer) {
  deployer.deploy(UCoinToken, 100000000).then(function() {
    // Token price is 0.001 Ether
    var tokenPrice = 1000000000000000;
    return deployer.deploy(UCoinTokenSale, UCoinToken.address, tokenPrice);
  });
};
