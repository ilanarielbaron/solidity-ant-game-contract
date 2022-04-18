import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

interface IEgg is IERC20 {
  function mint(address, uint256) external;

  function setEggPrice(uint256 _newPrice) external;

  function eggPrice() external view returns (uint256);
}

//SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.4 <0.9.0;

contract Egg is ERC20, IEgg {
  address private _ants;
  uint256 private _eggPrice = 0.001 ether;

  constructor(address __ants) ERC20('EGG', 'EGG') {
    _ants = __ants;
  }

  function mint(address _to, uint256 _amount) external override {
    //solhint-disable-next-line
    require(msg.sender == _ants, 'Only the ants contract can call this function, please refer to the ants contract');
    _mint(_to, _amount);
  }

  function setEggPrice(uint256 _newPrice) external override {
    //solhint-disable-next-line
    require(msg.sender == _ants, 'Only the ants contract can call this function, please refer to the ants contract');
    require(_newPrice > 0, 'The price must be higher than 0');
    _eggPrice = _newPrice;
  }

  function eggPrice() public view override returns (uint256) {
    return _eggPrice;
  }

  function decimals() public view virtual override returns (uint8) {
    return 0;
  }
}
