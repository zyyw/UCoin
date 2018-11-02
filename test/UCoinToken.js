var UCoinToken = artifacts.require("./UCoinToken.sol");

contract("UCoinToken", function(accounts){
  var tokenInstance;

  it("initialize the contract with the correct values", function() {
    return UCoinToken.deployed().then(function(instance) {
      tokenInstance = instance;
      return tokenInstance.name();
    }).then(function (name) {
      assert.equal(name, "UCoin Token", "has the correct name");
      return tokenInstance.symbol();
    }).then(function (symbol) {
      assert.equal(symbol, "UCoin", "has the correct symbol");
      return tokenInstance.standard();
    }).then(function (standard) {
      assert.equal(standard, "UCoin Token v1.0", "has the correct standard");
    })
  });

  it("allocates the initial upply upon deployment", function() {
    return UCoinToken.deployed().then(function(instance){
      tokenInstance = instance;
      return tokenInstance.totalSupply();
    }).then(function(totalSupply) {
      assert.equal(totalSupply.toNumber(), 100000000, "sets the total supply to 1,000,000");
      return tokenInstance.balanceOf(accounts[0]);
    }).then(function(adminBalance) {
      assert.equal(adminBalance.toNumber(), 100000000, "it allocates the initial supply to the admin account");
    });
  });

  it("transfer token ownership", function () {
    return UCoinToken.deployed().then(function (instance) {
      tokenInstance = instance;
      return tokenInstance.transfer.call(accounts[1], 999999999999);
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf("revert") >= 0, "error message must contain revert");
      return tokenInstance.transfer.call(accounts[1], 25000000);
    }).then(function (success) {
      assert.equal(success, true, "it returns true");
      return tokenInstance.transfer(accounts[1], 25000000, {from: accounts[0]});
    }).then(function(receipt) {
      assert.equal(receipt.logs.length, 1, "triggers one event");
      assert.equal(receipt.logs[0].event, "Transfer", "should be a <Transfer> event");
      assert.equal(receipt.logs[0].args._from, accounts[0], "logs the account the tokens are transferred from");
      assert.equal(receipt.logs[0].args._to, accounts[1], "logs the account the tokens are transferred to");
      assert.equal(receipt.logs[0].args._value, 25000000, "logs the transfer amount");
      return tokenInstance.balanceOf(accounts[1]);
    }).then(function (balance_to) {
      assert(balance_to.toNumber(), 25000000, "adds the amount to the receiving account");
      return tokenInstance.balanceOf(accounts[0]);
    }).then(function (balance_from) {
      assert(balance_from.toNumber(), 75000000, "deducts the amount from the sending account");
    });
  });

  it("approves tokens for delegated transfer", function () {
    return UCoinToken.deployed().then(function (instance) {
      tokenInstance = instance;
      return tokenInstance.approve.call(accounts[1], 100);
    }).then(function (success) {
      assert.equal(success, true, "it returns true");
      return tokenInstance.approve(accounts[1], 100, {from: accounts[0]});
    }).then(function (receipt) {
      assert.equal(receipt.logs.length, 1, "triggers one event");
      assert.equal(receipt.logs[0].event, "Approval", "should be a <Approval> event");
      assert.equal(receipt.logs[0].args._owner, accounts[0], "logs the account the tokens are authorized by");
      assert.equal(receipt.logs[0].args._spender, accounts[1], "logs the account the tokens are authorized to");
      assert.equal(receipt.logs[0].args._value, 100, "logs the transfer amount");
      return tokenInstance.allowance(accounts[0], accounts[1]);
    }).then(function (allowance) {
      assert.equal(allowance.toNumber(), 100, "stores the allowance for delegated transfer");
    });
  });

  it("handles delegated token transfers", function () {
    return UCoinToken.deployed().then(function (instance) {
      tokenInstance = instance;
      fromAccount = accounts[2];
      toAccount = accounts[3];
      spendingAccount = accounts[4];
      // Transfer some tokens to fromAccount
      return tokenInstance.transfer(fromAccount, 100, { from: accounts[0] });
    }).then(function (receipt) {
      // Approve spendingAccount to spend 10 tokens from fromAccount
      return tokenInstance.approve(spendingAccount, 10, { from: fromAccount });
    }).then(function (receipt) {
      // Try transferring something larger than the sender's balance
      return tokenInstance.transferFrom(fromAccount, toAccount, 9999, { from: spendingAccount });
    }).then(assert.fail).catch(function (error) {
      assert(error.message.indexOf("revert") >= 0, "cannot transfer value larger than balance");
      // Try transferring something larger than the approved amount
      return tokenInstance.transferFrom(fromAccount, toAccount, 20, { from: spendingAccount });
    }).then(assert.fail).catch(function (error) {
      assert(error.message.indexOf("revert") >= 0, "cannot transfer value larger than approved amount");
      return tokenInstance.transferFrom.call(fromAccount, toAccount, 10, { from: spendingAccount });
    }).then(function (success) {
      assert.equal(success, true);
      return tokenInstance.transferFrom(fromAccount, toAccount, 10, { from: spendingAccount });
    }).then(function (receipt) {
      assert.equal(receipt.logs.length, 1, "triggers one event");
      assert.equal(receipt.logs[0].event, "Transfer", "should be a <Transfer> event");
      assert.equal(receipt.logs[0].args._from, fromAccount, "logs the account the tokens are transferred from");
      assert.equal(receipt.logs[0].args._to, toAccount, "logs the account the tokens are transferred to");
      assert.equal(receipt.logs[0].args._value, 10, "logs the transfer amount");
      return tokenInstance.balanceOf(fromAccount);
    }).then(function (balance) {
      assert.equal(balance.toNumber(), 90, "deducts the amount from the sending account");
      return tokenInstance.balanceOf(toAccount);
    }).then(function (balance) {
      assert.equal(balance.toNumber(), 10, "adds the amount to the receiving account");
      return tokenInstance.allowance(fromAccount, spendingAccount);
    }).then(function (allowance) {
      assert.equal(allowance.toNumber(), 0, "deducts the amount from the allowance");
    })
  });
});
