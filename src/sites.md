---
pagination:
    data: sites
    size: 1
    alias: site
permalink: "/{{ site.title | slug }}/index.html"
layout: "base.njk"
eleventyComputed:
    title: "{{ site.title }}"
---

{{ site.content }}
