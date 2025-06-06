import { createAccount, createAddressFromString } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { setupVM } from './utils.ts'

describe('VM Copy Test', () => {
  it('should pass copy of state manager', async () => {
    const vm = await setupVM()
    const account = createAccount({
      balance: 100n,
      nonce: 5n,
    })
    const address = createAddressFromString(`0x` + '1234'.repeat(10))
    await vm.stateManager.putAccount(address, account)

    assert.isDefined(await vm.stateManager.getAccount(address), 'account exists before copy')

    await vm.stateManager.checkpoint()
    await vm.stateManager.commit()

    const vmCopy2 = await vm.shallowCopy()

    assert.isDefined(
      await vmCopy2.stateManager.getAccount(address),
      'committed checkpoints will be copied',
    )
  })
})
