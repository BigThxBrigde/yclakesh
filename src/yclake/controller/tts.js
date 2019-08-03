const AipSpeechClient = require('baidu-aip-sdk').speech
const config = require('../config.json')
const client = new AipSpeechClient(config.tts.appId, config.tts.apiKey, config.tts.secretKey)

const tts = async (ctx, next) => {
  const params = ctx.request.body
  const result = await client.text2audio(params.text, config.tts.options)
  if (!result.data) {
    ctx.body = {
      success: false,
      error: result.error_msg
    }
  } else {
    ctx.body = {
      success: true,
      // data: result.data
      data: `data:audio/wav;base64,${Buffer.from(result.data).toString('base64')}`
    }
  }
}

module.exports = {
  tts
}
