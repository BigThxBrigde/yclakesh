const path = require('path')
module.exports = {
  logConfig: {
    appenders: {
      access: {
        type: 'dateFile',
        filename: path.join(__dirname, '../logs/access-'),
        pattern: 'yyyy-MM-dd.log',
        alwaysIncludePattern: true,
        maxLogSize: 10485760,
        numBackups: 20,
        compress: true,
        layout: {
          type: 'basic'
        }
      },
      file: {
        type: 'dateFile',
        filename: path.join(__dirname, '../logs/server-'),
        pattern: 'yyyy-MM-dd.log',
        alwaysIncludePattern: true,
        maxLogSize: 10485760,
        numBackups: 20,
        compress: true,
        layout: {
          type: 'basic'
        }
      },
      console: {
        type: 'console',
        layout: {
          type: 'colored'
        }
      },
      error: {
        type: 'logLevelFilter',
        appender: 'file',
        level: 'error'
      }
    },
    categories: {
      default: {
        appenders: [
          'access',
          'file',
          'console'
        ],
        level: 'debug'
      }
    }
  }
}
