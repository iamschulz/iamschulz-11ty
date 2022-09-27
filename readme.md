# iamschulz.com

## install

-   `yarn` / `npm install`
-   add `.env` file with
    -   `NOTION_KEY` - notion integration secret
    -   `NOTION_BLOG_ID` - ID of the notion blog page
    -   `NOTION_SITES_ID` - ID of the notion sites page

## start

-   `yarn build` / `npm run build` - builds page to `./dist`
-   `yarn dev` / `npm run dev` - starts a dev server, watches changes

## use

### add a new blog post

-   add a new page to the notion blog page
-   todo: add a draft property
-   images from notion will be served from static page
-   currently supported content types
    -   formatted text
    -   images
    -   codepen embeds
-   planned supported content types
    -   youtube embeds
    -   twitter embeds, statically served
    -   custom video embeds
    -   tables
-   todo: deploy site from within notion

### add a new site

-   same as blog post, just add to the sites page

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
-   `notion client`: fetch content from the notion API
-   `notion-to-md`: transform notion content to markdown
-   `sass`: CSS preprocessor
-   `lightningcss`: CSS postprocessor
-   `esbuild`: compile and bundle typescript
-   `netlify`: hosting and caching
