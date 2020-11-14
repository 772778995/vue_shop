module.exports = {
  chainWebpack: config => {
    // 生产环境
    config.when (process.env.NODE_ENV === 'production', config => {
      config.entry('app').clear().add('./src/build.js')
    })
    // 开发环境
    config.when (process.env.NODE_ENV === 'development', config => {
      config.entry('app').clear().add('./src/dev.js')
    })
  }
}
