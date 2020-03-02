# Ethereum Contract Explorer

This application visualizes recent Ethereum Contract transactions based on event logs emitted by the contract.

## Install
To contribute to development, install from the repo using the instructions below, or use [Docker](https://www.docker.com/) (install instructions below).

```bash
# clone this repo
$ git clone https://github.com/amitdeshmukh/contract-explorer.git

# change directory
$ cd contract-explorer

# install dependencies
$ npm install

# serve with hot reload at localhost:8080
$ npm run dev

# build for production with minification
$ npm run build

# unit tests
$ npm test

```

## Install Using Docker

```bash
# clone this repo
$ git clone https://github.com/amitdeshmukh/contract-explorer.git

# change directory
$ cd contract-explorer

# Run docker-compose
$ docker-compose build && docker-compose up

```

## Installation

### Setting up Infura
The app uses [Infura](https://infura.io/) websockets to connect to an Ethereum network, and receive contract events.

To setup Infura properly, please refer to their documentation. You will also need to provide your Infura API `projectId` in [./src/config/index.js](src/config/index.js)

The drawback of this approach however, is that Infura websockets seem to not provide event logs that are older than 2 days. The performance is optimal when events within the past 1 day of blocks are requested.

### Setting up the Contract
You will need:
1. The deployed contract address - Configure the `contractAddress` property in [./src/config/index.js](src/config/index.js)

2. Ethereum network name (e.g. mainnet/ropsten/rinkeby etc) - Configure the `network` property in [./src/config/index.js](src/config/index.js)

3. Contract ABI - Copy the built contract artefact in JSON format to [./src/assets/](src/assets/) and then edit [./src/assets/contractABI.js](src/assets/contractABI.js) to point to your ABI file. 
For example:
    ```
    const contractJSON = require('./CounterAct.json')
    ```

## Usage

Browse to [http://localhost:8080](http://localhost:8080). Contract events will begin to stream into the app over [websockets](https://infura.io/docs/ethereum/wss/eth_subscribe) as they occur.

Currently, the app displays:
- A summary of contract events (type and number)

- Information emitted in individual event logs

![Screenshot](static/contract-explorer.png)


## Todo

1. Unit Test for Vue component
2. Read Web3 parameters from config
3. Implement additional features