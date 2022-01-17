import Web3 from "web3";
import AirTokenBuild from "./AirToken.json";

let smartContractAddresses = "0xdE84Be91e69ec7c87D2d6a4612653e6f1E2C1b5b";
let adminAddress = "0x0946d0549A8f1e5853d0e6c2154E08562244da09";
let selectedAccount;
let tokenContract;
let isInitialized = false;
let accountList = [];
let amountList = [];

// Checks and connects with the user metamask and establishes
// a connection to contract using the contract abi and address.
// Also it validates the network and checks whether the user is connected to ropsten network or not.

export const init = async () => {
  let provider = window.ethereum;

  if (typeof provider !== "undefined") {
    // Metamask is Installed

    await provider
      .request({ method: "eth_requestAccounts" })
      .then((accounts) => {
        selectedAccount = accounts[0];
        console.log(`Selected Account is ${selectedAccount}`);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  window.ethereum.on("accountChange", function (accounts) {
    selectedAccount = accounts[0];
    console.log(`Selected Account changed to ${selectedAccount}`);
  });

  const web3 = new Web3(provider);

  tokenContract = new web3.eth.Contract(
    AirTokenBuild.abi,
    smartContractAddresses
  );

  if (!((await web3.eth.net.getNetworkType()) === "ropsten")) {
    alert(
      "You are not on Ropsten Network. Please switch metamask to Ropsten network then press ok to continue!"
    );
    window.location.reload(false);
  }

  isInitialized = true;
};

// The function proceed with the airdrop transaction.
// Here user should pay the tx gas fee to claim their aur drop.

export const claimToken = async () => {
  if (!isInitialized) {
    await init();
  }

  return tokenContract.methods
    .claimToken(selectedAccount)
    .send({ from: selectedAccount });
};

// Returns a bool value from the smart contract, to determine whether the user is already claimed the airdrop or not.

export const isProcessed = async () => {
  if (!isInitialized) {
    await init();
  }

  return await tokenContract.methods
    .getProcessedAirdrop(selectedAccount)
    .call();
};

// Returns a bool value if the address is in the whitelisted address array in smart contract.

export const isWhitelisted = async () => {
  if (!isInitialized) {
    await init();
  }

  accountList = await tokenContract.methods.getWhitelistedAddress().call();
  amountList = await tokenContract.methods.getAllocatedAmount().call();

  let flag = false;
  let i;

  for (i = 0; i < accountList.length; i++) {
    if (
      accountList[i]
        .toLowerCase()
        .localeCompare(selectedAccount.toLowerCase()) === 0
    ) {
      flag = true;
      return await [flag, Web3.utils.fromWei(`${amountList[i]}`, "ether")];
    }
  }

  return await [flag, null];
};

//Checks whether the user is a admin when adding new address to whitelisted address list.

export const checkAdmin = async () => {
  if (!isInitialized) {
    await init();
  }

  let flag = false;

  if (
    selectedAccount.toLowerCase().localeCompare(adminAddress.toLowerCase()) ===
    0
  ) {
    flag = true;
    return flag;
  } else {
    return flag;
  }
};

// This function will initiate a transaction to add a new address to the white listed account list.

export const addAddressForAirDrop = async (address, amount) => {
  if (!isInitialized) {
    await init();
  }

  return tokenContract.methods
    .addAddressForAirDrop(address, Web3.utils.toWei(`${amount}`, "ether"))
    .send({ from: selectedAccount });
};
