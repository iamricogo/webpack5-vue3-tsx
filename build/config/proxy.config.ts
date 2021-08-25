export default {
  // '/api': {
  //   target: 'http://172.31.38.133:8080/',
  //   changeOrigin: true,
  //   pathRewrite: {
  //     '/api': '/mfoyou-agent-web'
  //   }
  // }

  ...['/api'].reduce((pre, cur) => {
    pre[cur] = {
      target: 'https://tt.cg5.co/',
      changeOrigin: true
    }
    return pre
  }, {})
}
