<template>
  <div id="events">
    <nav class="navbar navbar-expand-lg navbar-light">
      <div class="container">
        <h2>{{ eventsSummary.msg }}</h2>
      </div>
    </nav>
    <!-- Contract Event Summary -->
    <div class="container mt-5">
      <!-- <div class="row mb-7">Contract Address: {{ eventsSummary.contractAddress }}</div> -->
      <div class="row text-uppercase text-center mb-5" v-if="eventsSummary.loaded">
        <div class="col-12 col-sm" v-for="(events, type) in eventsSummary.eventSummary" :key="type">
          <p class="lead mb-0">{{ type }}</p>
          <h1 class="display-5">{{ events }}</h1>
        </div>
      </div>
      <!-- Placeholder -->
      <div class="row text-uppercase text-center mb-5" v-else>
        <div class="col-12 col-sm">
          <p class="lead mb-0"> Loading Data from Contract ... </p>
        </div>
      </div>

      <!-- Event details -->
      <h3 v-if="eventsSummary.loaded">Event Details</h3>
      <div v-for="(Event, index) in contractEvents.Events" :key="index" class="card mb-3">
        <div class="card-body">
          <h4 class="card-title">{{ Event.event }}</h4>
          <dl class="row">
            <dt class="col-sm-3">Transaction</dt>
            <dd class="col-sm-9"><a v-bind:href="'https://rinkeby.etherscan.io/tx/'+Event.txhash" target="_blank">{{ Event.txhash }}</a></dd>
            <dt class="col-sm-3">Block number</dt>
            <dd class="col-sm-9">{{ Event.block }}</dd>
            <template v-for="(propertyValue, propertyName, index) in Event.attribs">
              <dt :key="index" class="col-sm-3">{{ propertyName }}</dt>
              <dd :key="index" class="col-sm-9">{{ propertyValue }}</dd>
            </template>
          </dl>
        </div>
      </div>
    </div>

    <div class="bg-light text-center py-5 mt-5">
      <div class="container">
        <p>
          <strong>Event Explorer</strong> by <a href="https://github.com/amitdeshmukh">Amit Deshmukh</a>.
        </p>
      </div>
    </div>
  </div>
</template>

<script>

/* eslint-disable */
import Vue from 'vue'
import Web3 from 'web3'
import abiDecoder from 'abi-decoder'
import contractABI from '../assets/contractABI'
import config from '../config/'

// Bootstrap Web3
const network = config.network
const projectId = config.projectId
const contractAddress = config.contractAddress

//const web3 = new Web3(new Web3.providers.WebsocketProvider('wss://mainnet.infura.io/ws/v3/311d6f6491fa42c6b984cecadd45db6c'))
const web3 = new Web3(new Web3.providers.WebsocketProvider(`wss://${network}.infura.io/ws/v3/${projectId}`))

abiDecoder.addABI(contractABI);
// Get contract instance
const contract = new web3.eth.Contract(contractABI, contractAddress)

export default {
  name: 'event-explorer',
  components: {

  },

  data () {
    return {
      eventsSummary: {
        msg: 'Contract Events',
        contractAddress: '',
        eventSummary: {},
        loaded: false
      },
      contractEvents: {
        Events: [],
      },
    }
  },

  created () {
    this.getContractEvents()
  },

  methods: {
    // Function - obtain current block
    async currentBlock() {
      var currentBlock = await web3.eth.getBlockNumber()
      return currentBlock
    },

    // Function - retrieve Contract events
    getContractEvents () {
      // get currentBlock
      this.currentBlock().then((b) => {
        // blockNumber 1 day ago @ approx 5750 blocks per day
        return (b - (5750 * 1))
      })
      .then((s) => {
        // fetch event logs from startBlock
        let startBlock = s
        console.log('Start reading at block number', startBlock)

        // Contract Events
        contract.events.allEvents({fromBlock: startBlock}, async (err, event) => {
          if (err) {
            console.log('An error occured', err)
            return
          }
          this.eventsSummary.loaded = true
          this.eventsSummary.contractAddress = contractAddress

          // parse events
          if (typeof(event.event) === 'string') {
            this.eventsSummary.eventSummary[event.event]  = (parseInt(this.eventsSummary.eventSummary[event.event]) || 0) + 1
            var txHash = event.transactionHash
            var eventBlockNumber = event.blockNumber

            // decode event logs
            try {
              await web3.eth.getTransactionReceipt(txHash, (e, receipt) => {
                var decodedLogs = abiDecoder.decodeLogs(receipt.logs)
                decodedLogs.forEach(async (l) => {
                  if (l) {
                    var eventName = l.name
                    var o = {}
                    var hash
                    o['block'] = eventBlockNumber
                    o['event'] = eventName
                    o['txhash'] = txHash

                    // Add to contractEvents.Events
                    let attribs = {}
                    l.events.forEach((e) => {
                      var k = e.name
                      // hash  = (k === 'hash') ? hash : undefined
                      // var v = (k === 'deposit' || k === 'amount') ? web3.utils.fromWei((e.value).toString(), 'ether') : (e.value).toString()
                      var v = (k === 'deposit' || k === 'amount') ? (e.value).toString() : (e.value).toString()
                      attribs[k] = v
                    })
                    o['attribs'] = attribs

                    this.contractEvents.Events.unshift(o)
                  }
                })
              })
            } catch (err) {
                console.log('An error occured:', err)
            }
          }
        })
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#events {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  margin-top: 60px;
}
h1, h2 {
  /* font-weight: normal; */
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: block;
  margin: 0 10px;
}
a {
  color: #007bff;
}
</style>
