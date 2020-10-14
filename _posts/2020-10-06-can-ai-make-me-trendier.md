---
layout: post
title: Can AI make me trendier?
date: 2020-10-06T19:16:29.745Z
description: asdfasdf
feature_image: /images/404.jpg
thumbnail_image: /images/about.jpg
tags:
  - computer vision
  - machine learning
  - google cloud
permalink: social-media-fashion-ai
---
Last year, in a universe where it still made sense to owns pants, I decided to hire a personal stylist. 

In our first appointment, the stylist came to my apartment and took pictures of every clothing item I owned.

In our second appointment, she met me at Nordstrom's, where she asked me to try on a $400 casual dress, a $700 blazer, and $300 sneakers. (I never thought to ask if she worked on commission.)

But only after our third and final appointment, when she finally sent me a folder full of curated "looks" made from my new and old clothing items, did it finally fall into place for me: I'd just blown a *lot* of money.

I had a suspicion we were on different pages when, as we walked through the shoes section at Nordstrom, the stylist said, "The problem with you people in tech is that you're always looking for some kind of theory or strategy or formula for fashion*.* But there is no formula--it's about *taste*.*"*

Pfffft. We'll see about *that*! 

I returned the pricey clothing and decided to build my own (cheaper!) AI-powered stylist, and in this post, I'll show you how you can, too.

My stylist was half based on this smart closet from the movie *Clueless*:

<iframe src="https://giphy.com/embed/l0IulEDITBSPyt1BK" width="480" height="270" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>




In this post, I'll show you how to build your own AI-powered stylist that makes you outfit recommendations based on your own closet and never makes you feel insecure. It's inspired by a strategy for dressing I learned post-stylist, which is that the best way to look like a stylish person is to copy the way stylish people dress ("*Good artists copy," etc*).

For example, I started following a bunch of fashion "influencers" on Instagram and replicating their looks. The AI Stylist app does the same thing--it combines a stream of fashion influencer pictures from Instagram with pictures of my own clothes, letting me know which outfits I can recreate. Check out the live app [here](http://mismatch.daleonai.com/). This is what the UI looks like:

![Screenshot of the AI Stylist](/images/mismatch_ui.png "AI Stylist UI")

In the left pane, you'll see the "closet" view; in the middle, the "recommendation" view; on the right, the config view;