import React from "react";
import { useState } from "react";
import {
  init,
  claimToken,
  isWhitelisted,
  addAddressForAirDrop,
  checkAdmin,
  isProcessed,
} from "./web3client.js";

function App() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({
    text: "",
    color: "",
    txLink: "",
  });
  const [errorMessage1, setErrorMessage1] = useState("");

  const claim = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    let transactionHash;
    await init();
    setMessage({
      text: "",
      color: "",
      txLink: "",
    });

    setLoading(true);

    let whiteListCheck = await isWhitelisted();

    if (!whiteListCheck[0]) {
      console.log("This address is not whitelisted");
      setLoading(false);
      setMessage({
        text: "Your address is not whitelisted for the airdrop",
        color: "red",
      });
    } else if (await isProcessed()) {
      setLoading(false);
      console.log("This address has already claimed the airdrop");
      setMessage({
        text: "Your address has already claimed the airdrop",
        color: "green",
      });
    } else if (!(whiteListCheck[1] === data.get("amount"))) {
      setLoading(false);
      console.log("Invalid Amount");
      setMessage({
        text: `Invalid Amount. Your allocated amount is ${whiteListCheck[1]}`,
        color: "red",
      });
    } else {
      await claimToken()
        .then((tx) => {
          console.log(tx);
          transactionHash = tx.transactionHash;
        })
        .catch((err) => {
          console.error(err);
        });

      setLoading(false);

      setMessage({
        text: `Yey, Airdrop Completed. Check the transaction at`,
        txLink: `https:/ropsten.etherscan.io/tx/${transactionHash.toLowerCase()}`,
        color: "blue",
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
        <form onSubmit={claim}>
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
                    <b>Step 1: </b> Make sure you have configured the Ropsten
                    network with Metamask
                  </li>
                  <br />
                  <li>
                    <b>Step 2: </b> Make sure you have some ETH to pay for
                    transaction fees (~10-20 USD worth of ETH, paid to the
                    network
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
                  <h5 className=" card-text text-gray-700 font-bold">
                    Enter the Airdrop Amount:
                  </h5>
                  <div className="my-3">
                    <input
                      type="number"
                      name="amount"
                      className="input input-bordered block w-full focus:ring focus:outline-none"
                      placeholder="Enter the Airdrop Token Amount"
                    />
                  </div>
                  <div className="p-4"></div>
                </div>
                {loading ? (
                  <p className="card-text text-green-700 text-center font-bold">
                    Processing....
                  </p>
                ) : null}
                {message.text && (
                  <p
                    className={
                      "error text-" +
                      message.color +
                      "-700 text-center font-bold"
                    }
                  >
                    {" "}
                    {message.text}{" "}
                  </p>
                )}
                {message.txLink && (
                  <a
                    href={message.txLink}
                    className={
                      "error text-" +
                      message.color +
                      "-700 text-center font-bold"
                    }
                    style={{ whiteSpace: "pre" }}
                  >
                    {" "}
                    {message.txLink}{" "}
                  </a>
                )}
              </div>
            </main>
            <footer className="p-4">
              <button
                type="submit"
                className="btn btn-primary submit-button focus:ring focus:outline-none w-full"
              >
                Claim Airdrop
              </button>
            </footer>
          </div>
        </form>
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
                  placeholder="Add Address"
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
                  Whitelist A Address
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
