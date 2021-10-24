import { ok, rejects } from 'assert'
import fetch from 'isomorphic-fetch'
import TestDirector from 'test-director' /* eslint-disable-line */
import { push_mutation, push_transaction } from '../index.js'

const tests = new TestDirector()
const query = /* GraphQL */ `
  mutation {
    eosio_token(
      actions: [
        {
          transfer: {
            to: "b1"
            from: "eosio"
            memo: ""
            quantity: "0.0001 EOS"
            authorization: { actor: "eosio" }
          }
        }
      ]
    ) {
      chain_id
      transaction_header
      transaction_body
    }
  }
`

const malformed_query = `
  mutation {
    eosio_token(
      actions: [
        {
          transfer: {
            to: "b1"
            from: "eosio"
            memo: ""

  }
`

const fetch_mutation = async api => {
  const req = await fetch(api, {
    method: 'post',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      query
    })
  })
  const {
    data: { eosio_token }
  } = await req.json()

  return eosio_token
}

tests.add('push_mutation', async () => {
  rejects(() => push_mutation({ query: malformed_query, private_keys: [] }))
  const p = await push_mutation({ query, private_keys: [] })
  ok(p.errors[0].message.code == 3090003)
})

tests.add('push_transaction', async () => {
  const jungle = await fetch_mutation('https://jungle.relocke.io?1=eosio.token')
  const EOS = await fetch_mutation('https://eos.relocke.io?1=eosio.token')
  const pks = ['5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'] // Invalid key
  const { errors: jungle_errors } = await push_transaction(jungle, pks)
  const { errors: eos_errors } = await push_transaction(EOS, pks)

  ok(jungle_errors[0].message.name == 'unsatisfied_authorization', 'Jungle')
  ok(eos_errors[0].message.name == 'unsatisfied_authorization', 'EOS')

  rejects(
    () => push_transaction({ ...jungle, chain_id: 'not a real chain ID' }, pks),
    'Invalid chain id'
  )
  rejects(() => push_transaction(jungle))
})

tests.run()
