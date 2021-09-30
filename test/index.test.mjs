import { ok, rejects } from 'assert'
import fetch from 'isomorphic-fetch'
import TestDirector from 'test-director' /* eslint-disable-line */
import push_mutation from '../index.js'

const tests = new TestDirector()

const fetch_mutation = async api => {
  const req = await fetch(api, {
    method: 'post',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      query: /* GraphQL */ `
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
    })
  })
  const {
    data: { eosio_token }
  } = await req.json()

  return eosio_token
}

tests.add('push_mutation', async () => {
  const jungle = await fetch_mutation('https://jungle.relocke.io?1=eosio.token')
  const EOS = await fetch_mutation('https://eos.relocke.io?1=eosio.token')
  const pks = ['5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'] // Invalid key
  const { errors: jungle_errors } = await push_mutation(jungle, pks)
  const { errors: eos_errors } = await push_mutation(EOS, pks)

  ok(jungle_errors[0].message.name == 'unsatisfied_authorization', 'Jungle')
  ok(eos_errors[0].message.name == 'unsatisfied_authorization', 'EOS')

  rejects(
    () => push_mutation({ ...jungle, chain_id: 'not a real chain ID' }, pks),
    'Invalid chain id'
  )
  rejects(() => push_mutation(jungle))
})

tests.run()
