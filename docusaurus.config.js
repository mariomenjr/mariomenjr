const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: "Mario Menjívar",
  tagline: "@mariomenjr",
  url: "https://mariomenjr.com",
  baseUrl: "/",
  trailingSlash: false,
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  organizationName: "mariomenjr", // Usually your GitHub org/user name.
  projectName: "mariomenjr", // Usually your repo name.
  i18n: {
    defaultLocale: "es",
    locales: ["es"],
    localeConfigs: {
      es: {
        label: "Español",
        direction: "ltr",
      },
    },
  },
  themeConfig: {
    navbar: {
      title: "mariomenjr.com",
      logo: {
        alt: "mariomenjr.com logo",
        src: "https://avatars3.githubusercontent.com/u/1946936?s=460&v=4",
      },
      items: [
        { to: "/blog", label: "Blog", position: "left" },
        {
          href: "mailto:mariomenjr@gmail.com?subject=mariomenjr.com",
          label: "Email",
          position: "left",
        },
        {
          type: "localeDropdown",
          position: "right",
        },
        {
          href: "https://github.com/mariomenjr/mariomenjr",
          label: "GitHub",
          position: "right",
        },
        {
          href: "https://linkedin.com/in/mariomenjr",
          label: "LinkedIn",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Community",
          items: [
            {
              label: "Twitter",
              href: "https://twitter.com/mariomenjr",
            },
            {
              label: "GitHub",
              href: "https://github.com/mariomenjr",
            },
            {
              label: "LinkedIn",
              href: "https://linkedin.com/in/mariomenjr",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "Blog",
              to: "/blog",
            },
            {
              label: "Resume",
              href: "https://docs.google.com/document/d/1EjOqIIqDXXIl7ms5COV55TbI8xFFvzZHD_7QwmTcqT4/edit?usp=sharing"
            },
            {
              label: "Email",
              href: "mailto:mariomenjr@gmail.com?subject=mariomenjr.com",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Mario Menjívar. Built with Docusaurus.`,
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
      additionalLanguages: [`csharp`],
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        // By https://github.com/facebook/docusaurus/issues/3632#issuecomment-747346425
        gtag: {
          trackingID: "UA-174920898-1",
          // Optional fields.
          anonymizeIP: true, // Should IPs be anonymized?
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
        // docs: {
        //   sidebarPath: require.resolve('./sidebars.js'),
        //   // Please change this to your repo.
        //   editUrl:
        //     'https://github.com/mariomenjr/mariomenjr/edit/master/website/',
        // },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl: "https://github.com/mariomenjr/mariomenjr/edit/main/",

          /**
           * Blog feed.
           * If feedOptions is undefined, no rss feed will be generated.
           */
          feedOptions: {
            type: "all", // required. 'rss' | 'feed' | 'all'
            // title: '', // default to siteConfig.title
            // description: '', // default to  `${siteConfig.title} Blog`
            copyright: `Copyright © ${new Date().getFullYear()} Mario Menjívar. Built with Docusaurus.`,
            language: "es", // possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
          },
        },
        sitemap: {
          changefreq: "weekly",
          priority: 0.5,
        },
      },
    ],
  ],
};
