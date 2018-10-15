pragma solidity ^0.4.11;

contract UCoinToken {
  string public name = "UCoin Token";
  string public symbol = "UCoin";
  string public standard = "UCoin Token v1.0";
  uint256 public totalSupply;

  event Transfer(
    address indexed _from,
    address indexed _to,
    uint256 _value
  );

  event Approval(
    address indexed _owner,
    address indexed _spender,
    uint256 _value
  );

  mapping (address => uint256) public balanceOf;
  mapping (address => mapping (address => uint256)) public allowance;

  function UCoinToken(uint256 _initialSupply) public {
    balanceOf[msg.sender] = _initialSupply;
    totalSupply = _initialSupply;
  }

  function transfer(address _to, uint256 _value) public returns (bool success){
    // Exception if the sender doesn't have enough tokens
    require(_value <= balanceOf[msg.sender]);
    // do the transfer
    balanceOf[msg.sender] -= _value;
    balanceOf[_to] += _value;
    // emit a Transfer event
    emit Transfer(msg.sender, _to, _value);
    // return bool
    return true;
  }

  // approve
  function approve(address _spender, uint256 _value) public returns(bool success) {
    // allowance
    allowance[msg.sender][_spender] = _value;
    // approval event
    emit Approval(msg.sender, _spender, _value);
    // return bool
    return true;
  }

  // transferFrom
  function transferFrom(address _from, address _to, uint256 _value) public returns(bool success) {
    //require _from has enough balance
    require(_value <= balanceOf[_from]);
    // require allowance[_from][msg.sender] is big enough >= _value
    require (_value <= allowance[_from][msg.sender]);
    // change the balance
    balanceOf[_from] -= _value;
    balanceOf[_to] += _value;
    // update the allowance
    allowance[_from][msg.sender] -= _value;
    // transfer event
    emit Transfer(_from, _to, _value);
    // return bool
    return true;
  }
}
