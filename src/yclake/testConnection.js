const { DB } = require('./dao/db')
const { log } = require('./util/log')
const doTest = async () => {
  const result = await DB.query({
    sql: 'select * from user_info'
  })
  log.debug(result)
}
doTest()
