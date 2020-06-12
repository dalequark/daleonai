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

The app ended up being extremely good at searching for cute moments. Using computer vision, it recognized scenes and objects like "wedding," "firework", "performance," "baby laughing", "home improvement," "roller coaster," and even "Disney World":

![](/images/screen-shot-2020-06-12-at-4-18-52-pm.png)

It could also search transcripts. This is how I found the clip of my very first steps, because in these clips, my parents say something like, "Look, Dale is taking her first steps!":

![A picture of a baby learning to walk](/images/screen-shot-2020-06-04-at-6-04-46-pm.png "Dale's First Steps")

Finally, the tool was able to search any on-screen text, like the words "Mets" and "New York" on these players' shirts or the "Bud" poster in the background:

![A picture of a Mets baseball game](/images/screen-shot-2020-06-12-at-4-53-42-pm.png "Mets baseball game")

The video archive ended up being a pretty good Father's Day gift, especially since I wasn't actually able to see my dad in person this year.

In this post, I'll show you how you can build your own archive, just like this. But if you want to skip straight to the code, check out the Making with ML [Github repo](https://github.com/dalequark/making_with_ml/tree/master/discord_moderator).

## Machine Learning Architecture for Video Processing

The app is divided into two bits, the frontend and the backend. The backend was built using a combination of [Google Cloud](cloud.google.com "cloud.google.com"), [Firebase](firebase.google.com "firebase.google.com"), and a tool called [Algolia](algolia.com "algolia.com") (for search). The frontend was built with [Flutter](flutter.dev "flutter.dev"), a framework for building web and mobile apps, but could have easily been a React or Angular or iOS or Android app.

The backend architecture looked something like this:

![Architecture diagram for video archive backend.](/images/serverless_architecture.png "Architecture diagram for video archive backend.")

I use this kind of architecture or pipeline all the time when I build apps that tag or index data with machine learning. It works like this:

1. First, data (in this case, an individual video) is uploaded to a [Google Cloud Storage](https://cloud.google.com/storage) bucket.
2. Uploading kicks off a [Cloud Function](https://cloud.google.com/functions) (this is like an AWS lambda, i.e. a small chunk of code that runs in the cloud)
3. The cloud functions calls the [Video Intelligence API](https://cloud.google.com/video-intelligence) to kick off video analysis
4. The Video Intelligence API writes its results as JSON to a second storage bucket
5. _That_ written data, in turn, kicks off a _second_ cloud function that parses the JSON and writes it to a more convenient data store--in this case [Firestore](https://firebase.google.com/docs/firestore) and [Algolia](algolia.com).

From here, my frontend Flutter app could talk to the backend and search for user queries. If these technologies are unfamiliar to you, fear not--I'll go into depth in a bit.

There are also a couple of steps I couldn't fit in that diagram. For example, I did a bit of preprocessing with the Video Intelligence API on some very long video files that split them into smaller clips, and that also identified any timestamps shown on screen. Also, I wrote a Cloud Function specifically for taking an uploaded video and generating a thumbnail for it (check out the code for that here TODO: ADD LINK).

### Using the Video Intelligence API

1. gsutil cp path/to/your/video gs://your_bucket_name