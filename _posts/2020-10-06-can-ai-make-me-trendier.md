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

I returned the pricey clothing and decided to build my own (cheaper!) AI-powered stylist. In this post, I'll show you how you can, too.

My AI Stylist was half based on this smart closet from the movie *Clueless*:

<iframe src="https://giphy.com/embed/l0IulEDITBSPyt1BK" width="480" height="270" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>

and half based on the idea that one way to dress fashionably is to copy fashionable people. Particularly, fashionable people on Instagram.

The app pulls in the Instagram feeds of a bunch of fashion "influencers" on Instagram and combines them with pictures of clothing you already own to recommend you outfits. Here's what it looks like: 

![Screenshot of the AI Stylist](/images/mismatch_ui.png "AI Stylist UI")

(You can also check out the live app [here](http://mismatch.daleonai.com/).)

On the left pane--the closet screen--you can see all the clothing items I already own. On the right pane, you'll see a list of Instagram accounts I follow for inspiration. In the middle pane (the main screen), you can see the actual outfit recommendations the AI made for me. The Instagram inspiration picture is at the top, and items for my closet are shown below:

![Screenshot of swiping through outfit recommendations in the app](/images/mismatch.gif "Outfits recommended by the AI Stylist")

Here my style muse is Laura Medalia, an inspiring software developer who's [@codergirl_](https://www.instagram.com/codergirl_/) on Instagram (make sure to follow her for fashion and working in tech tips!).

The whole app took me about a month to build and cost ~$7.00 in Google Cloud credits (more on pricing later). Let's dive in.



## The Architecture

I built this app using a combination of [Google Cloud Storage](https://cloud.google.com/storage/?utm_source=google&utm_medium=cpc&utm_campaign=na-US-all-en-dr-bkws-all-all-trial-e-dr-1009135&utm_content=text-ad-none-any-DEV_c-CRE_79747411687-ADGP_Hybrid+%7C+AW+SEM+%7C+BKWS+%7C+US+%7C+en+%7C+EXA+~+Google+Cloud+Storage-KWID_43700007031545851-kwd-11642151515&utm_term=KW_google%20cloud%20storage-ST_google+cloud+storage&gclid=CjwKCAjww5r8BRB6EiwArcckC8WRFN95onXmZi1ly_pfNslOQMjZ6Ex03ypCr7irmeuzPsrDydBL8xoCUV8QAvD_BwE) and [Firebase](firebase.com) for the backend, [React](https://reactjs.org/) for the frontend, and the [Google Cloud Vision API](http://cloud.google.com/vision) for the ML bits.