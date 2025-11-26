---
layout: post
title: Build a Machine Learning Model in 10 Minutes
date: 2020-10-05T20:05:17.295Z
description: Seriously. No excuses!
feature_image: /images/build_ml.jpg
thumbnail_image: /images/build_ml_thumb.jpeg
tags:
  - machine learning
  - tensorflow.js
permalink: ml-model-ten-mins
---
I like to divide my machine learning education into two eras:

I spent the first era learning how to build models with tools like [scikit-learn](https://scikit-learn.org/) and [TensorFlow](tensorflow.org), which was hard and took forever. I spent most of that time feeling insecure about all the things I didn't know.

The second era--after I kind of knew what I was doing--I spent wondering why building ML models was so damn hard. After my insecurity cleared, I took a critical look at the machine learning tools we used today and realized this stuff is a lot harder *than it needs to be*. 

That's why I think the way we learn ML today [is about to change](https://daleonai.com/software-developers-youre-learning-machine-learning-upside-down).

It's also why I'm always delighted when I discover a tool that makes model-building fun, intuitive, and friction-less. That couldn't be more true of [Teachable Machine](https://teachablemachine.withgoogle.com/). It's a free program, build by Google, that lets you train deep learning models right from your browser. It's so easy that even elementary school kids can use it!

Today, you can train image, pose, and sound models with Teachable Machine.

![Screenshot of teachable machines UI](/images/screen-shot-2020-10-05-at-4.19.01-pm.png "Build an image, audio, or pose model with Teachable Machine")

Under the hood, it uses [TensorFlow.js](https://www.tensorflow.org/js) to train a model, which is nice for a couple of reasons:

\- Training happens locally, in the browser, so none of your data gets sent the cloud. Go data privacy!

\- When training is done, Teachable Machine lets you export your model so you can use it later, in your own app, from Javascript.

\- By design, TensorFlow.js uses your GPU (if you have one) to train models, so it's kinda speedy!

If you want the whole scoop, check out my latest episode of #MakingWithML:

<iframe width="560" height="315" src="https://www.youtube.com/embed/i9tjzr1KME0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

_Want more episode of Making with ML? Find them [here](bit.ly/gmakingwithml)._