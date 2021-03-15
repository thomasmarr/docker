const config = {
  gatsby: {
    pathPrefix: '/',
    siteUrl: 'https://docker.thomasmarr.dev',
    gaTrackingId: null,
    trailingSlash: false,
  },
  header: {
    logo: '/logo.png',
    logoLink: '/',
    title:
      "<a href='/'>thomasmarr.dev</a>",
    githubUrl: 'https://github.com/thomasmarr/docker',
    helpUrl: '',
    tweetText: '',
    social: `
		  `,
    links: [{ text: '', link: '' }],
    search: {
      enabled: true,
      indexName: 'DOCKER_THOMASMARR_DEV',
      algoliaAppId: process.env.GATSBY_ALGOLIA_APP_ID,
      algoliaSearchKey: process.env.GATSBY_ALGOLIA_SEARCH_KEY,
      algoliaAdminKey: process.env.ALGOLIA_ADMIN_KEY,
    },
  },
  sidebar: {
    forcedNavOrder: [
      '/fundamentals', // add trailing slash if enabled above
      '/docker',
    ],
    collapsedNav: [
    ],
    links: [{ text: 'Docker', link: 'https://docker.com' }, { text: 'Docker Documentation', link: 'https://docs.docker.com/reference/'}, { text: 'Docker Hub', link: 'https://hub.docker.com'}],
    frontline: false,
    ignoreIndex: true,
    title:
      "<a href='https://hasura.io/learn/'>graphql </a><div class='greenCircle'></div><a href='https://hasura.io/learn/graphql/react/introduction/'>react</a>",
  },
  siteMetadata: {
    title: 'Gatsby Gitbook Boilerplate | Hasura',
    description: 'Documentation built with mdx. Powering hasura.io/learn ',
    ogImage: null,
    docsLocation: 'https://github.com/thomasmarr/docker/tree/master/content',
    favicon: 'https://graphql-engine-cdn.hasura.io/img/hasura_icon_black.svg',
  },
  pwa: {
    enabled: false, // disabling this will also remove the existing service worker.
    manifest: {
      name: 'Gatsby Gitbook Starter',
      short_name: 'GitbookStarter',
      start_url: '/',
      background_color: '#6b37bf',
      theme_color: '#6b37bf',
      display: 'standalone',
      crossOrigin: 'use-credentials',
      icons: [
        {
          src: 'src/pwa-512.png',
          sizes: `512x512`,
          type: `image/png`,
        },
      ],
    },
  },
};

module.exports = config;
