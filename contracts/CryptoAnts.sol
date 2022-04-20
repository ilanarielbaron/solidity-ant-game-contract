import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import 'hardhat/console.sol';

interface IEgg is IERC20 {
  function mint(address, uint256) external;

  function setEggPrice(uint256) external;

  function eggPrice() external view returns (uint256);
}

interface ICryptoAnts is IERC721 {
  event EggsBought(address, uint256);

  function notLocked() external view returns (bool);

  function buyEggs(uint256) external payable;

  function createEgg(uint256 _antId) external;

  error NoEggs();
  event AntSold();
  event EggCreated();
  error NoZeroAddress();
  event AntCreated();
  error WrongEtherSent();
}

//SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.4 <0.9.0;

contract CryptoAnts is ERC721, ICryptoAnts {
  address private _owner;
  mapping(uint256 => address) public antToOwner;
  bool public locked = false;
  IEgg public immutable eggs;
  uint256[] public allAntsIds;
  bool public override notLocked = false;
  uint256 public antsCreated = 0;
  uint256 public antPrice = 0.0004 ether;
  uint256[] private _expiryOf;

  uint256 private _waitTime = 600;

  constructor(address _eggs) ERC721('Crypto Ants', 'ANTS') {
    _owner = msg.sender;
    eggs = IEgg(_eggs);
  }

  // Since solidity is deterministic, is not possible to generate a real random number.
  function _random(uint256 max) private view returns (uint256) {
    uint256 randNonce = 0;

    return uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, randNonce))) % max;
  }

  function createEgg(uint256 _antId) external override expire(_antId) {
    require(antToOwner[_antId] == msg.sender, 'Unauthorized');
    uint256 randomNumber = _random(20);
    if (randomNumber == 0) {
      delete antToOwner[_antId];
      _burn(_antId);
    } else {
      eggs.mint(msg.sender, randomNumber);
      _expiryOf[_antId - 1] = block.timestamp + _waitTime;
      emit EggCreated();
    }
  }

  function buyEggs(uint256 _amount) external payable override lock {
    uint256 _eggPrice = eggs.eggPrice();
    uint256 eggsCallerCanBuy = (msg.value / _eggPrice);
    eggs.mint(msg.sender, _amount);
    emit EggsBought(msg.sender, eggsCallerCanBuy);
  }

  function createAnt() external {
    require(eggs.balanceOf(msg.sender) >= 1, 'You do not have eggs');
    uint256 _antId = ++antsCreated;
    _mint(msg.sender, _antId);
    antToOwner[_antId] = msg.sender;
    allAntsIds.push(_antId);
    _expiryOf.push(block.timestamp);
    emit AntCreated();
  }

  function sellAnt(uint256 _antId) external {
    require(antToOwner[_antId] == msg.sender, 'Unauthorized');
    // solhint-disable-next-line
    (bool success, ) = msg.sender.call{value: antPrice}('');
    require(success, 'Whoops, this call failed!');
    delete antToOwner[_antId];
    _burn(_antId);
  }

  function getContractBalance() public view returns (uint256) {
    return address(this).balance;
  }

  function getAntsCreated() public view returns (uint256) {
    return antsCreated;
  }

  function expiryTime(uint256 _antId) public view returns (uint256) {
    return _expiryOf[_antId - 1];
  }

  function changeEggPrice(uint256 newPrice) public {
    require(msg.sender == _owner, 'Unauthorized');
    // solhint-disable-next-line
    require(newPrice > antPrice, 'Egg price must be higher than Ant price');
    eggs.setEggPrice(newPrice);
  }

  modifier lock() {
    //solhint-disable-next-line
    require(locked == false, 'Sorry, you are not allowed to re-enter here :)');
    locked = true;
    _;
    locked = notLocked;
  }

  modifier expire(uint256 _antId) {
    require(_expiryOf[_antId - 1] < block.timestamp, 'You must wait 10 minutes');
    _expiryOf[_antId - 1] = block.timestamp + _waitTime;
    _;
  }
}
