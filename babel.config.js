// 这是项目发布阶段需要用到的babel插件
const prodPlgins = []
if (process.env.NODE_ENV === 'production') {
  prodPlgins.push('transform-remove-console')
}

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    ['import', {
      libraryName: 'vant',
      libraryDirectory: 'es',
      style: true
    }, 'vant'],
    // 发布产品时插件数组
    ...prodPlgins,
    '@babel/plugin-syntax-dynamic-import'
  ]
}
