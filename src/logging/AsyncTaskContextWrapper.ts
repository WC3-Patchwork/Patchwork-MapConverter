import { AsyncLocalStorage } from 'node:async_hooks'

const dictionary = 'ABCDEFGHIJKLMNOPRSTUVQXYZabcdefghijklmnoprsqtvuwxyz0123456789'
const usedContexts = new Set<string>()
const asyncLocalStorage = new AsyncLocalStorage<string>()

// returns an ID which can be 61^4 possibilities - the likelyhood someone has a map with that many files is improbable
async function getNewContext(): Promise<string> {
  let context: string
  do {
    context = [0, 0, 0, 0].map(() => dictionary.charAt(Math.floor(Math.random() * dictionary.length))).join('')
  }
  while (usedContexts.has(context))
  usedContexts.add(context)
  return context
}

function releaseContext(context: string) {
  usedContexts.delete(context)
}

async function AsyncTaskContextWrapper<T>(task: () => Promise<T>) {
  return asyncLocalStorage.run(await getNewContext(), async () => {
    const result = await task()
    releaseContext(asyncLocalStorage.getStore() as unknown as string)
    return result
  })
}

function GetAsyncContext() {
  return asyncLocalStorage.getStore() ?? '----'
}

export { AsyncTaskContextWrapper, GetAsyncContext }