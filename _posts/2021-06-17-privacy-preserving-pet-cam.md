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
*Introducing PetCam: a non-invasive machine-learning-powered pet tracker that runs on an old smartphone. This project is a collaboration between me and [Jason Mayes](https://twitter.com/jason_mayes), who came up with the idea. Also, funny story, uh... my colleague Markku Lepistö built (almost) THE EXACT SAME PROJECT at the same time on his own YouTube show, Level Up, [which you can see here](https://www.youtube.com/watch?v=--VDgKKqZc4). We use old smartphones. He uses a Raspi and Coral board.*

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

Phew, this project is kind of a chonker, isn't it? Two different frontends, isn't that a little extra? As always, you can find all of the code to build this app yourself here \[TODO]. Or, if you just are about the pet-tracking frontend, you can find the code and a live demo in the [Glitch link](https://glitch.com/edit/#!/pet-cam?path=README.md%3A1%3A0).

Now, since this project is so big and my attention span is so small, I'm not going to bore you with all the little minutiae of how Jason and I set up authentication and installed TensorFlow and deployed a cloud function and blahdy-blah. You can figure most of that stuff out yourself by reading the code \[TODO], reading the README \[TODO], watching our YouTube video \[TODO], or (please don't murder me) by *googling around*.

Instead, I just want to cover each component at 5,000 feet and focus mainly on the tricky, unexpected hurdles Jason and I had to solve when we built this thing, so that you don't have to solve them yourself and so we can feel smart.

Now, down to the code mines!

## Tracking pets (or people or cars or Amazon packages)

Have you ever tried doing [object detection](https://en.wikipedia.org/wiki/Object_detection) on your webcam, in the browser, using Javascript?

![](/images/detected-with-yolo-schreibtisch-mit-objekten.jpg)

*Image by MTheiler from Wikipedia*

Turns out it's really easy. Too easy, if you ask me! Soon your baby chickens will be building web apps to track *you*.

You can set this up in a few lines of code:

<script src="https://gist.github.com/dalequark/c0e9c83e338508a96cc9c12d8d30daf5.js"></script>

What this code does first is load a pre-trained, general purpose [COCO-SD](https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd) computer vision TensorFlow.js model. COCO-SSD recognizes [80 types of objects](https://github.com/tensorflow/tfjs-models/blob/master/coco-ssd/src/classes.ts), including but not limited to: giraffe, tie, wine glass, broccoli, hair dryer.

Using the model is as simple as calling \`model.detect(video)\`, where \`video\` is a pointer to your webcam stream. (That's \`video id="webcam" autoplay></video>\` in HTML land). It makes more sense when you look at the code [here](https://glitch.com/edit/#!/pet-cam?path=index.html%3A25%3A9) in Glitch.

To analyze a stream of video rather than just a single frame, run \`model.detect\` in a loop. Voila! You have real-time object detection.

### How to Calculate Bounding Box Intersections/Distances

Jason and I designed this app so that when two objects you care about intersect--a dog and a water bowl, a cat and your laptop, you and your refrigerator--the app triggers an event, i.e. "HUMAN AT THE FRIDGE." We then save that event to a [Firestore](https://firebase.google.com/products/firestore?gclid=Cj0KCQjw5auGBhDEARIsAFyNm9GcM3cLF2jvupM-V8VPweUPEwP_8hCXXisbuyqvDnWFXlRxc7kSzZoaAh1QEALw_wcB&gclsrc=aw.ds) backend so that we can view a log of all past events in the future, and trigger a Slack notification. By intersect, I mean when two bounding boxes around the detected objects intersect:

![](/images/screen-shot-2021-06-17-at-3.55.55-pm.png)

In this picture, my adorable little chick Millie (RIP) is "intersecting" with her water dish.

How do you calculate how close two bounding boxes are to each other? As someone who, you know, regularly plays n-dimensional chess in my head (kidding, I can't even add three digit numbers in there!), I thought figuring out the "algorithm" for calculating bounding box distance would be simple. I've since come to believe that if you think something is going to be simple, you've screwed yourself for sure.

 Actually, the code for calculating bounding-box distance isn't so bad:

<script src="https://gist.github.com/dalequark/85213496b784a1c0cabeb988284cb509.js"></script>

TODO: EXPLAIN

### Knowing When to Send Alerts