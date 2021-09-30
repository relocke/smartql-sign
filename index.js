'use strict'
const { sign_txn } = require('eos-ecc')
const fetch = require('isomorphic-fetch')

const JUNGLE =
  '2a02a0053e5a8cf73a56ba0fda11e4d92e0238a4a2aa74fccf46d5a910746840'
const EOS = 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'

/**
 * Recource cost for transaction.
 * @kind namespace
 * @name ResoruceCost
 * @param {number} cpu_usage_us CPU time usage in micro seconds.
 * @param {number} net_usage_words Network usage cost (bytes).
 * @param {string} status Status of the transaction.
 */

/**
 * @kind namespace
 * @name TxnReceipt
 * @param {string} transaction_id id to refrence the transaction.
 * @param {string} block_num What block the transaction is located in.
 * @param {string} block_time Transaction time (GMT).
 * @param {string} producer_block_id The producers ID.
 * @param {ResoruceCost} resource_cost Network cost of the transaction.
 * @param {number} elapsed Elapsed.
 * @param {number} net_usage Network usage
 * @param {boolean} scheduled Scheduled.
 * @param {string} action_traces JSON representation of the actions performed.
 */

/**
 * Push a SmartQL mutation to the blockchain.
 * @kind function
 * @name push_mutation
 * @param {object} arg Argument
 * @param {string} arg.chain_id Hash representing the ID of the chain.
 * @param {string} arg.transaction_header Meta data about the transaction.
 * @param {string} arg.transaction_body The serialized transaction data.
 * @param {Array<string>} private_keys List of wif private keys to transaction.
 * @returns {TxnReceipt} transaction receipt.
 */
async function push_mutation(
  { chain_id, transaction_header, transaction_body },
  private_keys
) {
  if (!private_keys && !Array.isArray(private_keys))
    throw new TypeError('Private key must be an array of WIF keys')

  const signatures = await Promise.all(
    private_keys.map(wif_private_key =>
      sign_txn({
        hex: chain_id + transaction_header + transaction_body,
        wif_private_key
      })
    )
  )

  let api
  switch (chain_id) {
    case JUNGLE:
      api = 'https://jungle.relocke.io'
      break
    case EOS:
      api = 'https://eos.relocke.io'
      break
    default:
      throw new Error(`We do not support the chain id “${chain_id}”`)
  }

  const res = await fetch(api, {
    method: 'post',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      variables: {
        signatures,
        packed_trx: transaction_header + transaction_body
      },
      query: /* GraphQL */ `
        mutation ($packed_trx: String, $signatures: [String]) {
          push_transaction(packed_trx: $packed_trx, signatures: $signatures) {
            transaction_id
            block_num
            block_time
            producer_block_id
            elapsed
            net_usage
            scheduled
            action_traces
          }
        }
      `
    })
  })

  return res.json()
}

module.exports = push_mutation
