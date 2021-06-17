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

### 2. Pet “Diary” Frontend

This is a second frontend app that lets you view a log of all the activities your PetCam detected.

![](/images/screen-shot-2021-06-17-at-1.33.01-pm.png)

### 3. Firebase Backend (+ Slack API)

The serverless "backend" does two things: it stores a log of events and photos and also powers Slack notifications:

![](/images/screen-shot-2021-06-17-at-3.51.41-pm.png)

This is all powered by [Firebase](http://firebase.com/), Google’s lightweight tool suite for building serverless backends, plus the Slack API.

### 3a. AutoML Vision Chicken-Detection Model

Okay, this part is really a "nice-to-have." For PetCam 1.0, we'll use a pre-built machine learning model (Coco SSD) that analyzes lots of animals by default. But it doesn't recognizes baby chicks (my new and only pet) that well. So in this third part, we'll build a custom TensorFlow chicken-detection model using Google Cloud AutoML:

![](/images/screen-shot-2021-06-17-at-3.56.07-pm.png)

Phew, this project is kind of a chonker, isn't it? Two different frontends, isn't that a little extra? As always, you can find all of the code to build this app yourself here \[TODO]. Or, if you just are about the pet-tracking frontend, you can find the code and a live demo in the [Glitch link](https://glitch.com/edit/#!/pet-cam?path=README.md%3A1%3A0).

Now, since this project is so big and my attention span is so small, I'm not going to bore you with all the little minutiae of how Jason and I set up authentication and created a GCP account and deployed a cloud function and blahdy-blah. You can figure most of that stuff out yourself by reading the code \[TODO], reading the README \[TODO], or watching our YouTube video \[TODO].

Instead, I just want to cover each piece at 5,000 feet and focus mainly on the tricky, unexpected hurdles Jason and I had to solve when we built this thing, so that you don't have to solve them yourself and so I can feel smart.

Now, to the code mines!

## Tracking pets (or cars or