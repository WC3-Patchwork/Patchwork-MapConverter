import { type ILogObj, IMeta, Logger } from 'tslog'
import { GetAsyncContext } from './AsyncTaskContextWrapper'

const LOG_SILLY = 0
const LOG_TRACE = 1
const LOG_DEBUG = 2
const LOG_INFO = 3
const LOG_WARN = 4
const LOG_ERROR = 5
const LOG_FATAL = 6

let minLogLevel = LOG_DEBUG
const loggerInstances: Record<string, Logger<ILogObj>> = {}

type AppLogger = Logger<ILogObj>

const LoggerFactory = {
  setLogLevel: function (logLevel: number) {
    minLogLevel = logLevel
    Object.values(loggerInstances).forEach((logger) => {
      logger.settings.minLevel = logLevel
    })
  },

  createLogger: function (module: string): AppLogger {
    const logger = new Logger<ILogObj>({
      name                           : module,
      minLevel                       : minLogLevel,
      hideLogPositionForProduction   : true,
      type                           : 'pretty',
      prettyLogTemplate              : '{{yyyy}}.{{mm}}.{{dd}} {{hh}}:{{MM}}:{{ss}}:{{ms}}\t{{logLevelName}}\t[{{asyncId}}]\t{{filePathWithLine}}{{nameWithDelimiterPrefix}}\t',
      prettyErrorTemplate            : '\n{{errorName}} {{errorMessage}}\nerror stack:\n{{errorStack}}',
      prettyErrorStackTemplate       : '  • {{fileName}}\t{{method}}\n\t{{filePathWithLine}}',
      prettyErrorParentNamesSeparator: ':',
      prettyErrorLoggerNameDelimiter : '\t',
      overwrite                      : {
        addPlaceholders: (_: IMeta, placeholderValues: Record<string, string | number>) => {
          placeholderValues.asyncId = GetAsyncContext()
        }
      }
    })
    loggerInstances[module] = logger
    return logger
  }
}

export { LoggerFactory, LOG_SILLY, LOG_TRACE, LOG_DEBUG, LOG_INFO, LOG_WARN, LOG_ERROR, LOG_FATAL }
export type { AppLogger }