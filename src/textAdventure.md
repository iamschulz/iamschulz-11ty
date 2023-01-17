---
layout: "base.njk"
pagination:
    data: textAdventure
    size: 1
    alias: page
permalink: "ta/{{ page.name | slug }}/index.html"
eleventyComputed:
    title: "{{ page.name }}"
---

{% render page.content %}
