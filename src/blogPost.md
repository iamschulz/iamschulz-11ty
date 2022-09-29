---
layout: 'blogPost.njk'
pagination:
    data: blogs
    size: 1
    alias: post
permalink: '{{ post.title | slug }}/index.html'
eleventyComputed:
    title: '{{ post.title }}'
---

{% render post.content %}
