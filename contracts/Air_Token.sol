// SPDX-License-Identifier: MIT

pragma solidity >=0.8.11;

// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract AirToken is ERC20 {
    mapping(address => uint256) private _pendingWithdrawals;
    mapping(address => bool) public _processesAirdrop;

    address private _admin;
    address[] public _airdropAddressList;
    uint256 public _maxAirdropAmount;
    uint256 public _currentAirdropAmount;

    event AirdropProcessed(address _recipient, uint256 _amount, uint256 _date);

    constructor() ERC20("Air Token", "ATN") {
        _mint(msg.sender, 100000 * 10**18);
        _admin = msg.sender;
        _maxAirdropAmount = (3 * totalSupply()) / 10; // Max amount for Air drop is allocatied to 30% of total supply.
    }

    modifier onlyAdmin() {
        require(msg.sender == _admin, "Only admin can perform this action");
        _;
    }

    // Funtion to Change the admin of the smart contract
    function changeAdmin(address newAdmin) external onlyAdmin {
        require(newAdmin == address(newAdmin), "Invalid address");
        require(newAdmin == address(0), "Address cannot be Zero Address");

        _admin = newAdmin;
    }

    // This function will let the admin to add specific address for the Airdrop.
    function addAddressForAirDrop(address _address) public onlyAdmin {
        require(_address == address(_address), "Invalid address");
        require(_address == address(0), "Address cannot be Zero Address");

        _airdropAddressList.push(_address);
    }

    // This function will let the admin to remove specific address for the Airdrop.
    function removeAddressForAirDrop(address _address) external onlyAdmin {
        require(_address == address(_address), "Invalid address");
        require(_address == address(0), "Address cannot be Zero Address");

        for (uint256 i = 0; i < _airdropAddressList.length; i++) {
            if (_address == _airdropAddressList[i]) {
                _airdropAddressList[i] = _airdropAddressList[
                    _airdropAddressList.length - 1
                ];
                _airdropAddressList.pop();
            }
        }
    }

    // This function will help the admin to add more Token to the initial supply.
    function mint(address to, uint256 amount) external onlyAdmin {
        _mint(to, amount);
    }

    // Anyone can burn thier own token if required.
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }

    function clainToken(address _recipient, uint256 _amount) external {
        require(
            _processesAirdrop[_recipient] == false,
            "Airdrop already Processed for this address"
        );
        require(
            _currentAirdropAmount + _amount <= _maxAirdropAmount,
            "Airdropped 100% of the allocated amount"
        );

        _processesAirdrop[_recipient] = true;
        _currentAirdropAmount += _amount;
        _transfer(_admin, _recipient, _amount);
        emit AirdropProcessed(_recipient, _amount, block.timestamp);
    }

    function withdraw() public {
        uint256 amount = _pendingWithdrawals[msg.sender];
        _pendingWithdrawals[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }
}
