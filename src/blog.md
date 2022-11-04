---
layout: "blogListing.njk"
title: "Blog"
pagination:
    data: blogs
    size: 10
    alias: posts
permalink: "blog/{% if pagination.pageNumber > 0 %}{{ pagination.pageNumber + 1 }}/{% endif %}index.html"
---
