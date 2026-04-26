---
layout: layouts/base.njk
title: About
permalink: /about/
eleventyExcludeFromCollections: true
---

<div class="about-layout">
<div class="about-prose">

# about

<p class="lead">I&rsquo;m <strong>Jason Duffett</strong>. By day I work on infrastructure &mdash; networks, certificates, the boring plumbing that keeps software reachable. By night I play the ukulele, badly but happily.</p>

This site is where the two halves meet. The [tech]({{ '/tech/' | rel }}) posts are working notes from problems I&rsquo;ve actually solved; the [music]({{ '/music/' | rel }}) posts are arrangements and recordings I want to keep somewhere other than a hard drive. The [misc]({{ '/misc/' | rel }}) ones are everything else &mdash; mostly beer, occasionally Tumblr meta from a previous life.

Written in Markdown, rendered by [Eleventy](https://www.11ty.dev/), deployed to AWS CloudFront by [composureCDK](https://github.com/laazyj/composureCDK).

No cookies, no analytics, no tracking. If you want to hear about new posts, the [RSS feed]({{ '/feed.xml' | rel }}) is the right door.

</div>
<figure class="hero-sketch about-sketch">
  <img src="{{ '/assets/sketch-profile.jpeg' | rel }}" alt="Hand-drawn self-portrait of Jason &mdash; wild hair, stubble, skull t-shirt, blue jeans." />
</figure>
</div>
