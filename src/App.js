import React from "react";
import { useState } from "react";
import {
  init,
  claimToken,
  isWhitelisted,
  addAddressForAirDrop,
  checkAdmin,
  processesAirdrop,
} from "./web3client.js";

function App() {
  const [message, setMessage] = useState({
    text: "",
    color: "",
  });
  const [errorMessage1, setErrorMessage1] = useState("");

  const claim = async () => {
    let transactionHash;
    await init();
    setMessage({
      text: "",
      color: "",
    });
    console.log(isWhitelisted());

    if (await isWhitelisted()) {
      await claimToken()
        .then((tx) => {
          console.log(tx);
          transactionHash = tx.transactionHash;
        })
        .catch((err) => {
          console.error(err);
        });

      setMessage({
        text: `Yey, Airdrop Completed. Check your transaction at
        https://ropsten.etherscan.io//tx/${transactionHash.toLowerCase()}`,
        color: "blue",
      });
    } else {
      console.log("This address is not whitelisted");
      setMessage({
        text: "This address is not whitelisted for the airdrop",
        color: "red",
      });
    }
  };

  const whitelistAddress = async (e) => {
    e.preventDefault();
    setErrorMessage1("");
    await init();
    if (await checkAdmin()) {
      const data = new FormData(e.target);

      await addAddressForAirDrop(data.get("address"), data.get("amount"))
        .then((tx) => {
          console.log(tx);
          console.log(typeof tx);
          console.log(tx.transactionHash);
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      setErrorMessage1(
        "Only Admin of the contract can add address to whitelist"
      );
    }
  };

  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
      <div>
        {/* <form className="m-4" onSubmit={() => claim()}> */}
        <div className="credit-card w-full lg:w-3/4 sm:w-auto shadow-lg mx-auto rounded-xl bg-white">
          <main className="mt-4 p-4">
            <h1 className="text-xl font-bold text-gray-700 text-center">
              Airtoken Airdrop
            </h1>
            <br />
            <h5 className=" card-title text-gray-700">
              How to claim your tokens?
            </h5>
            <div className=" card-text text-gray-700">
              <ul>
                <li>
                  <b>Step 1: </b> Make sure you have configured the Rinkeby
                  network with Metamask
                </li>
                <br />
                <li>
                  <b>Step 2: </b> Make sure you have some ETH to pay for
                  transaction fees (~10-20 USD worth of ETH, paid to the network
                </li>
                <br />
                <li>
                  <b>Step 3: </b>Enter your ETH address and click on submit.
                  This will check if you are eligible for the airdrop or not
                </li>
                <br />
                <li>
                  <b>Step 4: </b> Confirm the transaction to claim your ATN
                  tokens. This will send a transaction to the Airdrop smart
                  contract
                </li>
                <br />
              </ul>
            </div>
            <div className="">
              <div className="my-3">
                <p className=" card-text text-gray-700 font-bold">
                  Your ETH Address:
                </p>
                <br />
                <h5 className=" card-title text-gray-700">Place Holder</h5>
                <div className="p-4"></div>
              </div>
              {message.text && (
                <p
                  className={
                    "error text-" + message.color + "-700 text-center font-bold"
                  }
                  style={{ whiteSpace: "pre" }}
                >
                  {" "}
                  {message.text}{" "}
                </p>
              )}
            </div>
          </main>
          <footer className="p-4">
            <button
              type="submit"
              className="btn btn-primary submit-button focus:ring focus:outline-none w-full"
              onClick={() => claim()}
            >
              Claim Airdrop
            </button>
          </footer>
        </div>
        {/* </form> */}
      </div>
      <div>
        <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg mx-auto rounded-xl bg-white">
          <div className="mt-4 p-4">
            <h1 className="text-xl font-semibold text-gray-700 text-center">
              For Admin Only
            </h1>
            <form onSubmit={whitelistAddress}>
              <div className="my-3">
                <input
                  type="text"
                  name="address"
                  className="input input-bordered block w-full focus:ring focus:outline-none"
                  placeholder="Address"
                />
              </div>
              <div className="my-3">
                <input
                  type="number"
                  name="amount"
                  className="input input-bordered block w-full focus:ring focus:outline-none"
                  placeholder="Amount to transfer"
                />
              </div>
              <div>
                {errorMessage1 && (
                  <p className="error text-red-700 text-center font-bold">
                    {" "}
                    {errorMessage1}{" "}
                  </p>
                )}
              </div>
              <footer className="p-4">
                <button
                  type="submit"
                  className="btn btn-primary submit-button focus:ring focus:outline-none w-full"
                >
                  Whitelist
                </button>
              </footer>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
