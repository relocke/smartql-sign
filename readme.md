![img](https://raw.githubusercontent.com/relocke/smartql-sign/master/logo.svg)

A universal JavaScript tool for pushing SmartQL mutations to the blockchain.

# Support

- [Node.js](https://nodejs.org/en/) `>= 14`
- [Browser list](https://github.com/browserslist/browserslist) `defaults` `not IE 11`.

# Set up

```shell
npm i smartql-sign
```

# API

- [namespace ResoruceCost](#namespace-resorucecost)
- [namespace TranctionReceipt](#namespace-tranctionreceipt)
- [function push_mutation](#function-push_mutation)
- [function push_transaction](#function-push_transaction)

## namespace ResoruceCost

Recource cost for transaction.

| Parameter         | Type   | Description                      |
| :---------------- | :----- | :------------------------------- |
| `cpu_usage_us`    | number | CPU time usage in micro seconds. |
| `net_usage_words` | number | Network usage cost (bytes).      |
| `status`          | string | Status of the transaction.       |

---

## namespace TranctionReceipt

| Parameter | Type | Description |
| :-- | :-- | :-- |
| `transaction_id` | string | ID to refrence the transaction. |
| `block_num` | number | The block the transaction is located in. |
| `block_time` | string | Transaction time (GMT). |
| `producer_block_id` | string | The producers ID. |
| `resource_cost` | [ResoruceCost](#namespace-resorucecost) | Network cost of the transaction. |
| `elapsed` | number | Elapsed time in µs used. |
| `net_usage` | number | Network usage. |
| `scheduled` | boolean | Scheduled. |
| `action_traces` | string | JSON representation of the executed transaction. |

---

## function push_mutation

Pushes a GraphQL mutation to the blockchain.

| Parameter | Type | Description |
| :-- | :-- | :-- |
| `arg` | object | Argument. |
| `arg.query` | string | GraphQL query string. |
| `arg.variables` | object | GraphQL variabes. |
| `arg.private_keys` | Array\<string> | List of wif private keys to sign the transaction with. |
| `blockchain` | string? | Specifiy what EOSIO chain you want to connet to. |

**Returns:** [TranctionReceipt](#namespace-tranctionreceipt) — Transaction receipt.

### Examples

_Ways to `require`_

> ```js
> const { push_mutation } = require('smartql-sign')
> ```

_Ways to `import`_

> ```js
> import { push_mutation } from 'smartql-sign'
> ```

_Push a mutation_

> ```js
> push_mutation({
>   query: `
>     mutation {
>       eosio_token(
>         actions: {
>           transfer: {
>             to: "pur3miish111"
>             from: "relocke"
>             quantity: "1.0000 EOS"
>             memo: "sent with SmartQL"
>             authorization: { actor: "relocke" }
>           }
>         }
>       ) {
>         chain_id
>         transaction_header
>         transaction_body
>       }
>     }
>   `,
>   private_keys: ['5…']
> }).then(console.log)
> ```
>
> > The logged output was the `TranctionReceipt` object.

---

## function push_transaction

Push a transaction to the Blockchain.

| Parameter | Type | Description |
| :-- | :-- | :-- |
| `arg` | object | Argument |
| `arg.chain_id` | string | Hash representing the ID of the chain. |
| `arg.transaction_header` | string | Meta data about the transaction (TaPoS, bandwidth allocation). |
| `arg.transaction_body` | string | The serialized transaction data. |
| `private_keys` | Array\<string> | List of wif private keys to sign the transaction with. |

**Returns:** [TranctionReceipt](#namespace-tranctionreceipt) — transaction receipt.

### Examples

_Ways to `require`_

> ```js
> const { push_transaction } = require('smartql-sign')
> ```

_Ways to `import`_

> ```js
> import { push_transaction } from 'smartql-sign'
> ```
