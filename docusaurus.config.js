const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'Mario Menjívar',
  tagline: '@mariomenjr',
  url: 'https://your-docusaurus-test-site.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'mariomenjr', // Usually your GitHub org/user name.
  projectName: 'mariomenjr', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'Mario Menjívar',
      logo: {
        alt: 'Mario Menjívar Logo',
        src: 'https://avatars3.githubusercontent.com/u/1946936?s=460&v=4',
      },
      items: [
        {to: '/blog', label: 'Blog', position: 'left'},
        {to: '/contacto', label: 'Contacto', position: 'left'},
        {to: '/acerca', label: 'Acerca', position: 'left'},
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
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/mariomenjr/mariomenjr/edit/master/website/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/mariomenjr/mariomenjr/edit/master/website/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
