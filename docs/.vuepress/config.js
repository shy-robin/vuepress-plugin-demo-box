module.exports = {
  title: 'vuepress-plugin-demo-box',
  description: 'Vuepress plugin for demo block',
  themeConfig: {
    repo: 'https://www.github.com/shy-robin/vuepress-plugin-demo-box',
    nav: [
      {
        text: '指南',
        link: '/guide/',
      },
    ],
    sidebar: {
      '/guide/': ['usage', 'principle', 'example', 'resource'],
    },
  },
  plugins: [
    '@vuepress/plugin-back-to-top',
    '@vuepress/plugin-medium-zoom',
    [
      require('../../src'),
      {
        component: 'DemoBox',
        cpnLibUrl: 'https://cdn.jsdelivr.net/npm/shy-robin-demo-ui',
        cpnStyleUrl:
          'https://cdn.jsdelivr.net/npm/shy-robin-demo-ui@0.1.5/lib/demo-ui.css',
      },
    ],
  ],
}
