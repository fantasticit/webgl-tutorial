// https://github.com/tc39/proposal-global
const getGlobal = () => {
  if (typeof self !== 'undefined') return self
  if (typeof window !== 'undefined') return window
  if (typeof global !== 'undefined') return global
  throw new Error(`unable to locate global object`)
}

export default {
  global: getGlobal()
}
