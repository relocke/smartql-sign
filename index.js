'use strict'

/**
 * Digitally sign and push a sign and push SmartQL mutation.
 * @param {object} arg Argument
 * @param {string} arg.chain_id
 * @param {string} arg.transaction_header
 * @param {string} arg.transaction_body
 * @param {Array<string>} private_keys
 */
async function sign(
  { transaction_header, chain_id, transaction_body },
  private_keys
) {}
