# iamschulz.com

_eleventy X notion edition_

## install

-   use node 17
-   `yarn` / `npm install`
-   add `.env` file with
    -   `NOTION_KEY` - notion integration secret
    -   `NOTION_BLOG_ID` - ID of the notion blog page
    -   `NOTION_ART_ID` - ID of the notion art page
    -   `NOTION_DEMO_ID` - ID of the notion demo DB

## start

-   `yarn build` / `npm run build` - builds page to `./dist`
-   `yarn dev` / `npm run dev` - starts a dev server, watches changes

## use

### add a new blog post

-   add a new page to the notion blog page
-   images from notion will be served from static page
-   currently supported content types
    -   formatted text
    -   images
    -   tables
    -   youtube embeds
    -   codepen embeds

### add a new site

-   add a markdown file in the repo

### deploy page

-   Deployment link in Notion triggers a dreampipe webhook, which sends a deployment request to netlify
    [![Netlify Status](https://api.netlify.com/api/v1/badges/d5df8844-fba4-41f2-9549-cf1e61035bf0/deploy-status)](https://app.netlify.com/sites/iamschulz-11ty/deploys)
-   Specify a notion article id as env variable `INCOMING_HOOK_BODY` to request the page uncached

## develop

### add new notion content type

-   create new shortcode adapter to transform notions embed format to something eleventy can read (see `src/_helpers/imageToShortCode.js`)
-   add adapter to API data endpoint (see `src/_data/blogs.js`)
-   add function to resolve shortcode to transform the shortcode to HTML (see `src/_shortcodes/image.js`)
-   register shortcode in `.eleventy.js`

## tools

-   `dotenv`: provide API keys
-   `eleventy`: static site generator
-   `eleventy-img`: crawl, optimize and output images
-   `eleventy-toc`: create table of content from markdown
-   `eleventy-plugin-rss`: create rss feeds
-   `notion client`: fetch content from the notion API
-   `notion-to-md`: transform notion content to markdown
-   `quicklink`: preload pages
-   `sass`: CSS preprocessor
-   `lightningcss`: CSS postprocessor
-   `esbuild`: compile and bundle typescript
-   `netlify`: hosting and caching
-   `pipedream`: deployment link from notion to netlify
