// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract MessageStorage {
    // State variable to store the message
    string private storedMessage;

    // Event to log when a new message is stored
    event MessageStored(address indexed user, string message);

    // Function to store a message on the blockchain
    function storeMessage(string memory newMessage) public {
        storedMessage = newMessage;
        emit MessageStored(msg.sender, newMessage);
    }

    // Function to retrieve the stored message from the blockchain
    function retrieveMessage() public view returns (string memory) {
        return storedMessage;
    }
}

