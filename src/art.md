---
layout: "artListing.njk"
title: "Art"
pagination:
    data: arts
    size: 10
    alias: posts
permalink: "art/{% if pagination.pageNumber > 0 %}{{ pagination.pageNumber + 1 }}/{% endif %}index.html"
---
