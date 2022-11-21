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
    'vuepress-plugin-typescript',
    '@vuepress/plugin-back-to-top',
    '@vuepress/plugin-medium-zoom',
    [
      require('vuepress-plugin-demo-box'),
      {
        cpnLibUrl: 'https://cdn.jsdelivr.net/npm/shy-robin-vue2-composition-ui',
        cpnStyleUrl:
          'https://cdn.jsdelivr.net/npm/shy-robin-vue2-composition-ui/dist/vue2-composition-ui.css',
      },
    ],
  ],
}
