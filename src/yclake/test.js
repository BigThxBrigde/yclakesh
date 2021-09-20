async () => {
  const path = require('path')
  const { CSV } = require('./util/csv')
  await CSV.summary({
    file: `${path.join(__dirname, 'summary.csv')}`
  })
}

async () => {
  const UserInfo = require('./dao/db').UserInfo

  var result = await UserInfo.find()

  console.log(result)

  await UserInfo.add({
    params: [['test2', 'test2', '0'], ['test1', 'test1', '0']]
  })

  await UserInfo.add({
    params: [['test3', 'test3', '0']]
  })

  result = await UserInfo.find()
  console.log(result)

  await UserInfo.update({
    update: 'set name=?',
    filter: ' name=?',
    params: ['test3', 'test2']
  })

  result = await UserInfo.find()
  console.log(result)

  await UserInfo.delete({
    filter: "name like 'test%'"
  })

  result = await UserInfo.find()
  console.log(result)
};

() => {
  const { Random } = require('./util/random')
  var result = Random.serialId({
    prefix: '19',
    length: 10,
    start: 0,
    count: 10000
  })
  console.log(result)

  let count = 0
  const data = []
  while (count < 10) {
    data.push(Random.randomCode({ length: 10 }))
    count++
    // console.log(count);
  }

  console.log(data)
}

async () => {
  const UserInfo = require('./dao/db').UserInfo
  const result = await UserInfo.find({
    one: true,
    fields: ['name']
  })
  console.log(result)
};

(() => {
  const _readCount = () => {
    delete require.cache[require.resolve('./dao/count.json')]
    return require('./dao/count.json').start
  }

  const _saveCount = (start) => {
    let count = {}
    count.start = start
    const fs = require('fs')
    const path = require('path')
    fs.writeFileSync(path.join(__dirname, './dao/count.json'), JSON.stringify(count))
  }

  console.log(_readCount())
  _saveCount(100)
  console.log(_readCount())
  _saveCount(0)

  console.log(_readCount())
  _saveCount(8000000)
  console.log(_readCount())
})()

async () => {
  const { services } = require('./dao/service')
  // let result = await services.QRCode.add(200);
  // console.log(result);
  const result = await services.QRCode.find(0, 999)
  result.forEach(e => {
    console.log(e)
  })

  console.log(result != null ? result : 'error')

  const path = require('path')
  const { CSV } = require('./util/csv')
  await CSV.export({
    data: result.data,
    fields: ['Url', 'SerialId', 'IdentifyCode'],
    file: `${path.join(__dirname, 'test_v1.csv')}`
  })
}

async () => {
  const { services } = require('./dao/service')
  const result = await services.QRCode.add(100)
  console.log(result)
}

async () => {
  const { services } = require('./dao/service')
  const result = await services.User.add('admin', 'admin')
  console.log(result)
}

async () => {
  const { services } = require('./dao/service')
  const result = await services.User.validate('admin', 'admin')
  console.log(result)
}
