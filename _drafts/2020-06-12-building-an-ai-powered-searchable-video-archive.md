---
layout: post
title: Building an AI-Powered Searchable Video Archive
description: Learn how to use machine learning / AI to build a queryable video archive
  on Google Cloud.
date: 2020-06-12 20:00:00 +0000
feature_image: "/images/ai_video_archiv_header.png"
tags:
- google cloud
- computer vision
- machine learning

---
_In this post, I'll show you how to build an AI-powered, searchable video archive using machine learning and Google Cloud--no experience required._

One of my favorite apps ever is definitely Google Photos. In addition to backing up my precious pics to the cloud, it also makes all of my photos and videos searchable using machine learning. So if I type "pool" in the Photos app, it returns all everything it recognizes as a pool:

![The Google Photo App showing results for the query "pool".](/images/screen-shot-2020-06-03-at-11-53-29-am.png "Google Photos Pool Search")

This is all well and good if you just want to use _somebody else's software_. But here at daleonai.com, we roll our own code, which is exactly what we'll look at today: how to build your own searchable, AI-powered video archive.

There are lots of reasons you'd want to build your own searchable video app. For one, it's fun. For two, you can add features Google Photos doesn't currently support, especially for videos. Like searching by what people say (transcripts), in case you need to find all the  clips where someone says, "well now we have it on film," or "oh crap." For three, building your own app allows you to more easily integrate with your other software and control how your data is stored and handled. For example, I built my archive's backend on Google Cloud, which let me take advantage of Google Cloud's [privacy, security, and compliance guarantees](https://cloud.google.com/security "Google cloud security and privacy").

My searchable video archive ended up looking like this:

![Custom-build searchable video archive built in Flutter](/images/ui_preview.png "Custom-build searchable video archive built in Flutter")

I used it to store and index all of my family home videos (\~126 GB). Using machine learning, specifically the [Video Intelligence API](https://cloud.google.com/video-intelligence "Google Cloud Video Intelligence API"), I was able to do all sorts of analysis, including automatically splitting long videos, identifying objects and scenes, transcribing audio, and extracting on-screen text.

The app ended up being extremely good at searching for cute moments. Using computer vision, it recognized scenes and objects like "wedding," "firework", "performance," "baby laughing", "home improvement," "roller coaster," and even Disney World:

![](/images/screen-shot-2020-06-12-at-4-18-52-pm.png)

It could also search transcripts. This is how I found the clip of my very first steps, because in these clips, my parents say something like, "Look, Dale is taking her first steps!":

![](/images/screen-shot-2020-06-04-at-6-04-46-pm.png)

Finally, the tool was able to search any on-screen text. For example, it read the string "Happy 1st Birthday Dale" right off my birthday cake:

![](/images/screen-shot-2020-06-09-at-5-08-25-pm.png)

See all the code at [github.com/google/making_with_ml](github.com/google/making_with_ml.com).