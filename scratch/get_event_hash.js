const fs = require('fs');
const path = require('path');
const solc = require('solc');

const filePath = path.join(__dirname, '../contracts/GenosPlazaComercio.sol');
const sourceCode = fs.readFileSync(filePath, 'utf8');

const input = {
  language: 'Solidity',
  sources: {
    'GenosPlazaComercio.sol': {
      content: sourceCode
    }
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['abi', 'evm.bytecode', 'metadata']
      }
    }
  }
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));
const contractOutput = output.contracts['GenosPlazaComercio.sol']['GenosPlazaComercio'];

console.log('ABI Events:');
const abi = contractOutput.abi;
console.log(JSON.stringify(abi.filter(x => x.type === 'event'), null, 2));

// Ethers can be simulated or we can see if we can print metadata or event hashes.
// Let's print the entire ABI and see.
