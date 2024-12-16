// App.js
import React, { useState, useEffect } from "react";
import Web3 from "web3";
import MessageStorageContract from "./build/contracts/Migrations.json"; 
// import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [message, setMessage] = useState("");
  const [storedMessage, setStoredMessage] = useState("");

  useEffect(() => {
    const initWeb3 = async () => {
      // Connect to the Metamask provider
      if (window.ethereum) {
        try {
          await window.ethereum.enable();
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);

          // Get the current Ethereum account
          const accounts = await web3Instance.eth.getAccounts();
          setAccount(accounts[0]);

          // Instantiate the contract
          const networkId = await web3Instance.eth.net.getId();
          const deployedNetwork = MessageStorageContract.networks[networkId];
          const contractInstance = new web3Instance.eth.Contract(
            MessageStorageContract.abi,
            deployedNetwork && deployedNetwork.address
          );
          setContract(contractInstance);
        } catch (error) {
          console.error("Error connecting to Metamask:", error);
        }
      } else {
        console.error("Metamask not found");
      }
    };

    initWeb3();
  }, []);

  const handleStoreMessage = async () => {
    if (web3 && contract && account && message) {
      try {
        await contract.methods.storeMessage(message).send({ from: account });
        console.log("Message stored successfully!");
      } catch (error) {
        console.error("Error storing message:", error);
      }
    }
  };

  const handleRetrieveMessage = async () => {
    if (web3 && contract) {
      try {
        const storedMessage = await contract.methods.retrieveMessage().call();
        setStoredMessage(storedMessage);
      } catch (error) {
        console.error("Error retrieving message:", error);
      }
    }
  };

  return (
    <div className="App">
      <h1>Message Storage App</h1>
      <div>
        <label>Enter Message:</label>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={handleStoreMessage}>Store Message</button>
      </div>
      <div>
        <button onClick={handleRetrieveMessage}>Retrieve Message</button>
        <p>Stored Message: {storedMessage}</p>
      </div>
    </div>
  );
}

export default App;
