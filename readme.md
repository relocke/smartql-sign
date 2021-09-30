![img](https://raw.githubusercontent.com/relocke/smartql-sign/master/logo.svg)

A universal JavaScript tool for pushing SmartQL mutations to the blockchain.

# Support

- [Node.js](https://nodejs.org/en/) `>= 14`
- [Browser list](https://github.com/browserslist/browserslist) `defaults` `not IE 11`.

# API

- [namespace ResoruceCost](#namespace-resorucecost)
- [namespace TxnReceipt](#namespace-txnreceipt)
- [function push_mutation](#function-push_mutation)

## namespace ResoruceCost

Recource cost for transaction.

| Parameter         | Type   | Description                      |
| :---------------- | :----- | :------------------------------- |
| `cpu_usage_us`    | number | CPU time usage in micro seconds. |
| `net_usage_words` | number | Network usage cost (bytes).      |
| `status`          | string | Status of the transaction.       |

---

## namespace TxnReceipt

| Parameter | Type | Description |
| :-- | :-- | :-- |
| `transaction_id` | string | id to refrence the transaction. |
| `block_num` | string | What block the transaction is located in. |
| `block_time` | string | Transaction time (GMT). |
| `producer_block_id` | string | The producers ID. |
| `resource_cost` | [ResoruceCost](#namespace-resorucecost) | Network cost of the transaction. |
| `elapsed` | number | Elapsed. |
| `net_usage` | number | Network usage |
| `scheduled` | boolean | Scheduled. |
| `action_traces` | string | JSON representation of the actions performed. |

---

## function push_mutation

Push a SmartQL mutation to the blockchain.

| Parameter | Type | Description |
| :-- | :-- | :-- |
| `arg` | object | Argument |
| `arg.chain_id` | string | Hash representing the ID of the chain. |
| `arg.transaction_header` | string | Meta data about the transaction. |
| `arg.transaction_body` | string | The serialized transaction data. |
| `private_keys` | Array\<string> | List of wif private keys to transaction. |

**Returns:** [TxnReceipt](#namespace-txnreceipt) — transaction receipt.
