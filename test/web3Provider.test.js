/* eslint-disable no-undef */
const config = require('../src/config')
const assert = require('assert')
const Web3 = require('web3')

const network = config.network
const projectId = config.projectId
const INFURA_WSS = `wss://${network}.infura.io/ws/v3/${projectId}`
const provider = new Web3.providers.WebsocketProvider(INFURA_WSS)
const web3 = new Web3(provider)

describe('Web3', () => {
  it('WebSocketProvider test', async () => {
    const network = await web3.eth.net.getNetworkType().then(data => { return data })
    assert.equal(network, 'main')
  })
})
