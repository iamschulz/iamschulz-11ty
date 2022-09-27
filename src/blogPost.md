---
layout: "blogPost.njk"
pagination:
    data: blogs
    size: 1
    alias: blog
permalink: "{{ blog.title | slug }}/index.html"
eleventyComputed:
    title: "{{ blog.title }}"
---

# {{ blog.title }}

{% render blog.content %}
