---
layout: post
title: I Built an AI Stylist Inspired by Social Media
date: 2020-10-28T19:16:29.745Z
description: I let an AI pick out my outfits using computer vision and pictures
  of social media fashion influencers.
feature_image: /images/ai-stylist.png
thumbnail_image: /images/ai-stylist-thumb.png
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

Here my style muse is Laura Medalia, an inspiring software developer who's [@codergirl_](https://www.instagram.com/codergirl_/) on Instagram (make sure to follow her for fashion and tips for working in tech!).

The whole app took me about a month to build and cost ~$7.00 in Google Cloud credits (more on pricing later). Let's dive in.

## The Architecture

I built this app using a combination of [Google Cloud Storage](https://cloud.google.com/storage/?utm_source=google&utm_medium=cpc&utm_campaign=na-US-all-en-dr-bkws-all-all-trial-e-dr-1009135&utm_content=text-ad-none-any-DEV_c-CRE_79747411687-ADGP_Hybrid+%7C+AW+SEM+%7C+BKWS+%7C+US+%7C+en+%7C+EXA+~+Google+Cloud+Storage-KWID_43700007031545851-kwd-11642151515&utm_term=KW_google%20cloud%20storage-ST_google+cloud+storage&gclid=CjwKCAjww5r8BRB6EiwArcckC8WRFN95onXmZi1ly_pfNslOQMjZ6Ex03ypCr7irmeuzPsrDydBL8xoCUV8QAvD_BwE), [Firebase](firebase.com), and Cloud Functions for the backend, [React](https://reactjs.org/) for the frontend, and the [Google Cloud Vision API](http://cloud.google.com/vision) for the ML bits. I divided the architecture into two bits.

First, there's the *batch process*, which runs every hour (or however frequently you like) in the Cloud:

![Diagram of batch process for making outfit recommendations](/images/pxl_20201014_203905793.jpg "The \\"batch process\\" makes outfit recommendations using AI")

"Batch process" is just a fancy way of saying that I wrote a Python script which runs on a scheduled interval (more on that later). The process:

1. Pulls photos from social media
2. Uses the Vision API's [Product Search](https://cloud.google.com/vision/product-search/docs) feature to find similar items in my closet
3. Scores the matches (i.e. of all the social media pictures, which can I most accurately recreate given clothing in my closet?)
4. Writes the matches to [Firestore](https://firebase.google.com/docs/firestore)

This is really the beefy part of the app, where all the machine learning magic happens. The process makes outfit recommendations and writes them to Firestore, which is my favorite ever lightweight database for app development (I use it in almost all my projects). 

The actual *app* (in this case, just a responsive web app) is simple: it just reads the outfit recommendations from Firestore and displays them in a pretty interface:

![Architecture diagram of a web app reading from Firestore](/images/pxl_20201014_204154884.jpg "The web app just displays data from Firestore")

Let's take a look!

## Grabbing Social Media Data

Ideally, I wanted my app to pull pictures from Instagram automatically, based on which accounts I told it to follow. Unfortunately, Instagram doesn't have an API (and using a [scraper](https://github.com/arc298/instagram-scraper) would violate their TOS). So I specifically asked Laura for permission to use her photos. I downloaded them to my computer and then uploaded them to a [Google Cloud Storage bucket](https://cloud.google.com/storage/?utm_source=google&utm_medium=cpc&utm_campaign=na-US-all-en-dr-bkws-all-all-trial-e-dr-1009135&utm_content=text-ad-none-any-DEV_c-CRE_79747411447-ADGP_Hybrid+%7C+AW+SEM+%7C+BKWS+%7C+US+%7C+en+%7C+EXA+~+Google+Cloud+Storage-KWID_43700007031545851-kwd-11642151515&utm_term=KW_google%20cloud%20storage-ST_google+cloud+storage&gclid=CjwKCAjw5p_8BRBUEiwAPpJO6xIv5t69bTUdDMVgY_7hC04hj1xyRz-o90_T3a332_F-QUqmofOeqhoCneUQAvD_BwE):

```shell
# Create a cloud storage bucket
gsutil mb gs://inspo-pics-bucket

# Upload inspiration pics 
gsutil cp path/to/inspo/pics/*.jpg gs://inspo-pics-bucket
```

## Filtering for Fashion Pics

I like Laura's account for inspiration because she usually posts pictures of herself in head-to-toe outfits (shoes included). But some pics on her account are more like this:

![Dog in front of a laptop](/images/doggy.jpg "Laura's cute pooch")

Adorable, yes, but I don't think I can personally pull off the dressed-in-only-a-collar look. So I needed some way of knowing which pictures contained outfits (worn by people) and which didn't.

For that, I turned to my trusty steed, the [Google Cloud Vision API](cloud.google.com/vision) (I use it in lots of different ways for this project). First, I used its **classification** feature, which assigns labels to an image. Here's the labels it gives me for a picture of myself, trying to pose as an influencer:

![Screenshot of the Vision API analyzing an outfit](/images/screen-shot-2020-10-15-at-11.43.18-am.png "The Vision API returns lots of labels for this photo")

The labels are ranked by how confident the model is that they're relevant to the picture. Notice there's one label called "Fashion" (confidence 90%). To filter Laura's pictures, I labeled them all with the Vision API and removed any image that didn't get a "Fashion" label. Here's the code:

```python
from google.cloud import vision
from google.cloud.vision import types

# Path to all my inspo pics in the cloud
uris = [
  "gs://inspo-pics-bucket/pic1.jpg", 
  "gs://inspo-pics-bucket/pic2.jpg",
  ...
 ]

# Create a Vision API Client
client = vision.ImageAnnotatorClient()

# Keep track of all the fashion pics
fashionPics = []

for uri in uris:
  image_source = vision.types.ImageSource(image_uri="gcs/path/to/file")
  labels = client.label_detection(image=image).label_annotations
  # Only save images that have the label "Fashion"
  if any([x.description == "Fashion" for x in labels]):
    fashionPics.append(uri)
```

If you want the full code, check out this file. TODO: ADD FILE

## Digitizing my Closet

Because I wanted to get outfit inspiration ideas from my own closet, I had to take pictures of every clothing Item I own.

I did even more filtering using the **object detection** feature of the Cloud Vision API, which identifies individual objects (and their locations) in photos:

![Screenshot of using the Vision API to detect clothing item locations](/images/screen-shot-2020-10-15-at-11.43.07-am.png "The Vision API tags my top, shoes, and shorts.")

As you can see, this feature tags both *what* clothing items I'm wearing but also *where* they're located in the picture (i.e. the API returns the pixel coordinates of bounding boxes for each of my shoes). You can find a list of all the clothing-related tags the API returns here (TODO: ADD LINK). More on how I used that feature in a second.