import { AsyncLocalStorage } from 'node:async_hooks'
import { randomInt } from 'node:crypto'

const asyncLocalStorage = new AsyncLocalStorage<string>()

async function AsyncTaskContextWrapper<T>(task: () => Promise<T>) {
  return asyncLocalStorage.run((randomInt(9999)).toString().padStart(4), task)
}

function GetAsyncContext() {
  return asyncLocalStorage.getStore() ?? ''
}

export { AsyncTaskContextWrapper, GetAsyncContext }