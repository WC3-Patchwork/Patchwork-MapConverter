export default function PromiseSupplier<T>(): [Promise<T>, (value: T) => void, (reason: string | undefined) => void] {
  let promiseResolve: ((value: T) => void) | null = null
  let promiseReject: ((reason: string | undefined) => void) | null = null
  const promise = new Promise<T>((resolve, reject) => {
    promiseResolve = resolve
    promiseReject = reject
  })
  return [promise, promiseResolve as unknown as (value: T) => void, promiseReject as unknown as (reason: string | undefined) => void]
}