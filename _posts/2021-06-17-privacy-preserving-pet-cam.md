---
layout: post
title: Privacy-Preserving Pet Cam
date: 2021-06-17T18:18:32.533Z
description: Build a smart camera that tracks your pets (and whatever else)
  using privacy-preserving, on-device ML.
feature_image: /images/pet-cam.png
thumbnail_image: /images/pet-cam-small.png
tags:
  - computervision
  - tensorflow.js
  - tensorflow
  - automl
  - machinelearning
  - videointelligence
permalink: ai-pet-cam
---
*Introducing PetCam: a non-invasive machine-learning-powered pet tracker that runs on an old smartphone. This project is a collaboration between me and [Jason Mayes](https://twitter.com/jason_mayes), who came up with the idea. Also, funny story, uh... my colleague Markku Lepistö built (almost) THE EXACT SAME PROJECT at the same time on his own YouTube show, Level Up, [which you can see here](https://www.youtube.com/watch?v=--VDgKKqZc4). We use old smartphones. He uses a [Coral development board](https://coral.ai/products/dev-board/). Choose your own adventure.*

## Architecture

This project is divided into three main parts:

### 1. Pet-Detecting Frontend

This is the bit that uses your camera and a TensorFlow.js machine learning model to analyze your pets’ behavior. It’s built in simple Javascript and runs in the browser, and you can try it out yourself right now [here](https://glitch.com/edit/#!/pet-cam?path=README.md%3A1%3A0).

![Pet tracking frontend app](/images/screen-shot-2021-06-17-at-1.37.35-pm.png "Pet tracking frontend app")

It uses a TensorFlow.js machine learning model that analyzes data from your phone's camera (or webcam) in the browser, without ever sending data back to the cloud (this is what makes it "privacy-preserving"). However, to save these events in a log (i.e. "cat on the couch"), we do send photos and event strings to Firestore so that we can later view events in a diary (more on that next).

### 2. Pet “Diary” Frontend

The "diary" second frontend app that lets you view a log of all the activities your PetCam detected. It basically loads data saved in Firestore into a pretty UI:

![](/images/screen-shot-2021-06-17-at-1.33.01-pm.png)

### 3. Firebase Backend (+ Slack API)

The serverless "backend" does two things: it stores a log of events and photos and also powers Slack notifications. So, when your pet does something neat, you get a Slack ping about it:

![](/images/screen-shot-2021-06-17-at-3.51.41-pm.png)

This is all powered by [Firebase](http://firebase.com/), Google’s lightweight tool suite for building serverless backends, plus the Slack API.

### 3a. AutoML Vision Chicken-Detection Model

Okay, this part is really a "nice-to-have." For PetCam 1.0, we'll use a pre-built machine learning model (Coco SSD) that analyzes lots of animals by default. But it doesn't recognizes baby chicks (my new and only pets) that well. So in this third part, we'll build a custom TensorFlow chicken-detection model using Google Cloud AutoML:

![](/images/screen-shot-2021-06-17-at-3.56.07-pm.png)

Phew, this project is kind of a chonker, isn't it? Two different frontends, isn't that a little extra? As always, you can find all of the code to build this app yourself [here](https://github.com/google/making_with_ml/tree/master/petcam) in the Making with ML repo. Or, if you just are about the pet-tracking frontend, you can find the code and a live demo in the [Glitch link](https://glitch.com/edit/#!/pet-cam?path=README.md%3A1%3A0).

Now, since this project is so big and my attention span is so small, I'm not going to bore you with all the little minutiae of how Jason and I set up authentication and installed TensorFlow and deployed a cloud function and blahdy-blah. You can figure most of that stuff out yourself by [reading the code](https://github.com/google/making_with_ml/tree/master/petcam), reading the [README](https://github.com/google/making_with_ml/blob/master/petcam/README.md), watching our YouTube video \[TODO], or (please don't murder me) by *googling around*.

Instead, I just want to cover each component at 5,000 feet and focus mainly on the tricky, unexpected hurdles Jason and I had to solve when we built this thing, so that you don't have to solve them yourself and so we can feel smart.

Now, to the code mines!

## Tracking pets (or people or cars or Amazon packages)

Have you ever tried doing [object detection](https://en.wikipedia.org/wiki/Object_detection) on your webcam, in the browser, using Javascript?

![](/images/detected-with-yolo-schreibtisch-mit-objekten.jpg)

*Image by MTheiler from Wikipedia*

Turns out it's really easy. Too easy, if you ask me! Soon your cats will be building web apps to track *you*.

You can set this up in a few lines of code:

<script src="https://gist.github.com/dalequark/c0e9c83e338508a96cc9c12d8d30daf5.js"></script>

What this code does first is load a pre-trained, general purpose [COCO-SD](https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd) computer vision TensorFlow.js model. COCO-SSD recognizes [80 types of objects](https://github.com/tensorflow/tfjs-models/blob/master/coco-ssd/src/classes.ts), including but not limited to: giraffe, tie, wine glass, broccoli, hair dryer.

Using the model is as simple as calling \`model.detect(video)\`, where \`video\` is a pointer to your webcam stream. (That's \`video id="webcam" autoplay></video>\` in HTML land). It makes more sense when you look at the code [here](https://glitch.com/edit/#!/pet-cam?path=index.html%3A25%3A9) in Glitch.

To analyze a stream of video rather than just a single frame, run \`model.detect\` in a loop. Voila! You have real-time object detection.

### How to Calculate Bounding Box Intersections/Distances

Jason and I designed this app so that when two objects you care about intersect--a dog and a water bowl, a cat and your laptop, you and your refrigerator--the app triggers an event, i.e. "HUMAN AT THE FRIDGE." We then save that event to a [Firestore](https://firebase.google.com/products/firestore?gclid=Cj0KCQjw5auGBhDEARIsAFyNm9GcM3cLF2jvupM-V8VPweUPEwP_8hCXXisbuyqvDnWFXlRxc7kSzZoaAh1QEALw_wcB&gclsrc=aw.ds) backend so that we can view a log of all past events in the future, and trigger a Slack notification (more on the backend in a bit). By intersect, I mean when two bounding boxes around the detected objects intersect:

![](/images/screen-shot-2021-06-17-at-3.55.55-pm.png)

In this picture, my adorable little chick Millie (RIP) is "intersecting" with her water dish, and therefore I conclude she's probably drinking.

How do you calculate how close two bounding boxes are to each other? For this project, we wanted to know not just whether or not two bounding boxes ("bboxes") intersect, but also, if they don't, how far apart are they? Here's the code:

<script src="https://gist.github.com/dalequark/85213496b784a1c0cabeb988284cb509.js"></script>

TODO: EXPLAIN

### Knowing When to Send Alerts

Once I figured out that box-intersection code (with some, er, assistance) I felt brilliant! But then Jason and I discovered a less sexy but far more troubling problem we didn't know how to solve: how do you know when to save an event and send the user an alert?

Recall that to do real-time object detection and tracking, we run code to analyze our webcam image and detect an intersection multiple times a second, in a loop. So, if your corgi Rufus is just chilling on the couch, we'll compute that the "dog" bounding box intersects with the "couch" bounding box multiple times a second. Obviously, we only want to count this as an "event" the first time this happens, when Rufus jumps on the couch, but not after. Then if Rufus leaves and comes back later, we can fire the event again. So maybe we a variable that keeps track of whether we've sent a notification to the user, and resets it when Rufus leaves the couch.

Except it's more complicated than that, because what if Rufus is kind of hovering in front of the couch, or running around it, so our code detects him as "on" and "off" the couch many times in the same few seconds? We don't want to spam our user with notifications for events that aren't really "unique." We need to do some sort of "debouncing," limiting how frequently we can send alerts. Seems simple, right--like we should just add a cool down period so we don't send users too many notifications too close in time? This is, in fact, what Jason and I did, and in code it looks like this.

`// Min number of seconds before we send another alert.`

`const MIN_ALERT_COOLDOWN_TIME = 60;`

`if (sendAlerts) {`

`sendAlerts = false;`

`sendAlert(naughtyAnimals);`

`setTimeout(cooldown, MIN_ALERT_COOLDOWN_TIME * 1000);`

`}`

Except a cool down period is not enough! Because what if you have *two* dogs, or many dogs, running on and off the couch? Because if Rufus jumps up and then Milo jumps up right after him, those are two unique events, and we want to alert the user for both. Suddenly you have to know *which* dogs are moving around and keep track of their state and you have a hair "multi-object tracking" problem, which sounds like someone's PhD thesis, and [it is](https://whluo.github.io/papers/Luo-W-2016-PhD-Thesis.pdf)! (Actually, you do get this functionality for free via the [Google Cloud Video Intelligence API](https://cloud.google.com/video-intelligence), but we're stuck here in TensorFlow.js land and it's hard).

This realization really had me sweating, and for a while, Jason and I thought we were screwed. But then we ended up doing what one always does when out of one's technical depth: solving a not-as-good but much, much simpler problem. Our compromise was this: for a single object type (i.e. "dog," "cat," "bottle") we would keep track of the number of those objects in a frame, and only notify the user when that number went up (i.e. 3 dogs -> 4 dogs in frame). When that happened, we would increment our dog counter. But we wouldn't *decrement* the dog counter until all dogs were out of the frame. It's kind of nonintuitive, but take a quick look at the code:

<script src="https://gist.github.com/dalequark/017d7ca83c21b9a894833c3335e0cc67.js"></script>

Let's quickly try to understand how this notification "algorithm" works:



| Scenario                           | Send Alert?                                         |
| ---------------------------------- | --------------------------------------------------- |
| 1 dog -> 2 dogs                    | Yes                                                 |
| 2 dogs -> 3 dogs                   | Yes                                                 |
| 3 dogs -> 2 dogs                   | No                                                  |
| 2 dogs -> 1 dog -> 2 dogs          | No                                                  |
| 2 dogs -> 1 dog -> 0 dogs -> 1 dog | Yes (for the very last dog that jumps on the couch) |