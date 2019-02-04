module.exports = {
  outputDir:  '../',
  assetsDir:  'static',
  publicPath: './',
  pages:      {
    index: {
      // entry for the page
      entry:    'src/main.js',
      // the source template
      template: 'public/index.html',
      // output as outputDir/index.html
      filename: 'index.html',
      // when using title option,
      // template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
      // title: 'Index Page',
      // chunks to include on this page, by default includes
      // extracted common chunks and vendor chunks.
      // chunks:   ['chunk-vendors', 'chunk-common', 'index']
    },
    login: {
          // entry for the page
          entry:    'src/login.js',
          // the source template
          template: 'public/index.html',
          // output as outputDir/login.html
          filename: 'login.html',
          // when using title option,
          // template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
          // title: 'Index Page',
          // chunks to include on this page, by default includes
          // extracted common chunks and vendor chunks.
          // chunks:   ['chunk-vendors', 'chunk-common', 'login']
        },
    trelloAuth: {
              // entry for the page
              entry:    'src/trello-auth.js',
              // the source template
              template: 'public/index.html',
              // output as outputDir/login.html
              filename: 'trello_auth_token.html',
              // when using title option,
              // template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
              // title: 'Index Page',
              // chunks to include on this page, by default includes
              // extracted common chunks and vendor chunks.
              // chunks:   ['chunk-vendors', 'chunk-common', 'login']
            },
  },
  css:        {
    loaderOptions: {
      sass: {
        data: `
          @import "@/scss/theme.scss";
        `
      }
    }
  }
};
