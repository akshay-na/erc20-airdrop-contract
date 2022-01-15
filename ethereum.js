import detectEthereumProvider from "./detectEthereumProvider";
import Web3 from "./web3";

const network = {
  5777: "Local Development Blockchain",
  4: "Ethereum Rinkeby Test Network"
};

const getBlockchain = () => {
  new Promise((resolve, reject) => {
    const provider = await detectEthereumProvider();
    if (provider) {
      const accounts = await provider.request({method: "eth_requestAccounts"});
      const networkId = await provider.request({method: "net_version"});
      if (networkId != 4) {
        reject("Wrong network, please switch to Rinkeby Test Network");
        return;
      }
      const web3 = new Web3(provider);
      const airdrop = new web3.eth.Contract(
        Airdrop.abi,
        Airdrop.networks[networkId].address
      );
      resolve({airdrop, accounts});
    }
    reject("Install Metamask");
  });

  export default getBlockchain;
};
