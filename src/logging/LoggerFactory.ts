import { type ILogObj, Logger } from 'tslog'

const LOG_SILLY = 0
const LOG_TRACE = 1
const LOG_DEBUG = 2
const LOG_INFO = 3
const LOG_WARN = 4
const LOG_ERROR = 5
const LOG_FATAL = 6

let _logLevel = LOG_INFO
let rootLogger: Logger<ILogObj> | null = null

const LoggerFactory = {
  setLogLevel: function (logLevel: number) {
    _logLevel = logLevel
  },

  createLogger: function (module: string) {
    if (rootLogger == null) {
      rootLogger = new Logger({ minLevel: _logLevel })
    }

    return rootLogger.getSubLogger({ name: module })
  }
}

export {
  LoggerFactory,
  LOG_SILLY,
  LOG_TRACE,
  LOG_DEBUG,
  LOG_INFO,
  LOG_WARN,
  LOG_ERROR,
  LOG_FATAL
}
