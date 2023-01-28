---
layout: "blogPost.njk"
pagination:
    data: styleguide
    size: 1
    alias: post
permalink: "styleguide/index.html"
eleventyComputed:
    title: "{{ post.title }}"
---

{% render post.content %}
