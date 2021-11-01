import { useState } from 'react';
import { ethers } from 'ethers';
import './App.css';

//ABI
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json'

const greeterAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

function App() {
  const [greeting, setGreetingValue] = useState('');

  async function requestAccount() {
    // request accnt info from metamask accnt.
    await window.ethereum.request({ method: 'eth_requestAccounts' })
  }

  async function fetchGreeting() {
    //if metamask exist in the window
    if (typeof window.ethereum !== 'undefined') {
      // new provier using ethers --> web3 
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // once we have provier and we create a new instance of the contract
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider);
      try {
        //greeting value from the blockchain
        const data = await contract.greet();
        console.log('data: ', data);
      } catch (e) {
        console.log('Error: ', e);
      }
    }
  }

  async function setGreeting() {
    // if user hasn't typed a greeting
    if (!greeting) return
    // if the metamask wallet exist
    if (typeof window.ethereum !== 'undefined') {
      //request user to auth. transaction
      await requestAccount();
      //create a provider to make a transaction
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // sign the transaction
      const signer = provider.getSigner();
      //new instance of contract replacing provider with signer which changes the state 
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer);
      //passes our user set greeting into our contract 
      const transaction = await contract.setGreeting(greeting);
      //waiting for transaction to be confirmed and into blockchain 
      setGreeting('');
      await transaction.wait();
      //logout new value.
      fetchGreeting();
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={fetchGreeting}>Fetch Greeting</button>
        <button onClick={setGreeting}>Set Greeting</button>
        <input onChange={e => setGreetingValue(e.target.value)} placeholder="Set Greeting" />
      </header>
    </div>
  );
}

export default App;
