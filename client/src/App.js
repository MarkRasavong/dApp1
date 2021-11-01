import { useState } from 'react';
import { ethers } from 'ethers';
import './App.css';

//ABI
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json'
import Token from './artifacts/contracts/Token.sol/Token.json'

const greeterAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const tokenAddress = '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9';

function App() {
  const [greeting, setGreetingValue] = useState('');
  const [userAccount, setUserAccount] = useState('');
  const [amount, setAmount] = useState(0);


  //greeting
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

  async function getBalance() {
    if (typeof window.ethereum !== 'undefined') {
      const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(tokenAddress, Token.abi, provider)
      const balance = await contract.balanceOf(account);
      console.log("Balance: ", balance.toString());
    }
  }

  async function sendCoins() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(tokenAddress, Token.abi, signer);
      const transaction = await contract.transfer(userAccount, amount);
      await transaction.wait();
      console.log(`${amount} Coins successfully sent to ${userAccount}`);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={fetchGreeting}>Fetch Greeting</button>
        <button onClick={setGreeting}>Set Greeting</button>
        <input onChange={e => setGreetingValue(e.target.value)} placeholder="Set Greeting" />

        <br />

        <button onClick={getBalance}>Get Balance</button>
        <button onClick={sendCoins}>Send Coins</button>
        <input onChange={e => setUserAccount(e.target.value)} placeholder='Public Address' />
        <input onChange={e => setAmount(e.target.value)} placeholder='Amount' />
      </header>
    </div>
  );
}

export default App;
