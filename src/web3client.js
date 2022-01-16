import Web3 from "web3";
import AirTokenBuild from "contracts/AirToken.json";

let smartContractAddresses = "0xdE84Be91e69ec7c87D2d6a4612653e6f1E2C1b5b";
let adminAddress = "0x0946d0549A8f1e5853d0e6c2154E08562244da09";
let selectedAccount;
let tokenContract;
let isInitialized = false;
let accountList = [];

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

  isInitialized = true;
};

export const claimToken = async () => {
  if (!isInitialized) {
    await init();
  }

  return tokenContract.methods
    .claimToken(selectedAccount)
    .send({ from: selectedAccount });
};

export const isWhitelisted = async () => {
  if (!isInitialized) {
    await init();
  }

  accountList = await tokenContract.methods.getWhitelistedAddress().call();

  let flag = false;
  let i;

  console.log(accountList);

  for (i = 0; i < accountList.length; i++) {
    console.log(accountList[i]);
    if (
      accountList[i]
        .toLowerCase()
        .localeCompare(selectedAccount.toLowerCase()) === 0
    ) {
      flag = true;
      return flag;
    }
  }

  return flag;
};

export const processesAirdrop = async () => {
  // let provider = window.ethereum;
  // let slot = "0".repeat(64);  // hex uint256 representation of 0
  let key = "0x509840449916fc49913baf920ac4c7e4d541e0c4";
  let processesAirdropList = [];

  // processesAirdropList = await tokenContract._processesAirdrop.call(key);
  await tokenContract._processesAirdrop.call(key, function (err, res) {
    console.log(res);
  });

  console.log(processesAirdropList);

  // const web3 = new Web3(provider);// hex representation of the key

  // web3.eth.getStorageAt(
  //   smartContractAddresses,  // address of the contract to read from
  //   web3.utils.sha3(key + slot, { encoding: 'hex' }),  // keccak256(k . p)
  //   function (err, result) {
  //     console.log(result);
  //     return result;// 00...0 for false, 00...1 for true, both 32 bytes wide
  //   }
  // );
};

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

export const addAddressForAirDrop = async (address, amount) => {
  if (!isInitialized) {
    await init();
  }

  return tokenContract.methods
    .addAddressForAirDrop(address, Web3.utils.toWei(`${amount}`))
    .send({ from: selectedAccount });
};
