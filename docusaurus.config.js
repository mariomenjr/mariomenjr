const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'Mario Menjívar',
  tagline: '@mariomenjr',
  url: 'https://mariomenjr.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'mariomenjr', // Usually your GitHub org/user name.
  projectName: 'mariomenjr', // Usually your repo name.
  i18n: {
    defaultLocale: 'es',
    locales: ['es'],
    localeConfigs: {
      es: {
        label: 'Español',
        direction: 'ltr',
      },
    }
  },
  themeConfig: {
    navbar: {
      title: 'Mario Menjívar',
      logo: {
        alt: 'Mario Menjívar Logo',
        src: 'https://avatars3.githubusercontent.com/u/1946936?s=460&v=4',
      },
      items: [
        {to: '/blog', label: 'Blog', position: 'left'},
        {to: 'https://forms.formium.io/f/5fe2551f0f24900001bd7abb', label: 'Contact', position: 'left'},
        {to: '/acerca', label: 'About', position: 'left'},
        {
          type: 'localeDropdown',
          position: 'right',
        },
        {
          href: 'https://github.com/mariomenjr/mariomenjr',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Community',
          items: [
            {
              label: 'Twitter',
              href: 'https://twitter.com/mariomenjr',
            },
            {
              label: 'YouTube',
              href: 'https://www.youtube.com/channel/UCj7lTb03SFIz-YMm9AlI-SA',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/mariomenjr',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/mariomenjr/mariomenjr',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Mario Menjívar. Built with Docusaurus.`,
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        // docs: {
        //   sidebarPath: require.resolve('./sidebars.js'),
        //   // Please change this to your repo.
        //   editUrl:
        //     'https://github.com/mariomenjr/mariomenjr/edit/master/website/',
        // },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/mariomenjr/mariomenjr/edit/main/',

          /**
           * Blog feed.
           * If feedOptions is undefined, no rss feed will be generated.
           */
          feedOptions: {
            type: 'all', // required. 'rss' | 'feed' | 'all'
            // title: '', // default to siteConfig.title
            // description: '', // default to  `${siteConfig.title} Blog`
            copyright: `Copyright © ${new Date().getFullYear()} Mario Menjívar. Built with Docusaurus.`,
            language: 'es', // possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
          },
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
