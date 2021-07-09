---
layout: post
title: Why are there so many kinds of neural network architectures?
date: 2020-11-23T23:18:38.583Z
description: An intuitive explanation of why we need so many different types of
  neural networks
feature_image: /images/404.jpg
thumbnail_image: /images/about.jpg
tags:
  - machine learning
permalink: neural-network-zoo
---
Feed forward neural networks, CNNs, LSTMs, transformers--we have a veritable zoo of neural network architectures with more published by the day. But why?

![](/images/nn_zoo.png "Neural Network Zoo poster from the Asimov Institute")

When you first learn deep learning, you're introduced to the simplest type of neural network, a feed-forward net that looks like this:

![vanilla neural network](/images/vanilla_nn.gif "Feed-forward neural network picture from Wikipedia")

For your first lesson, you might build one of these nets to analyze tabular data (like the kind in a spreadsheet) or recognize handwritten digits.

But as soon as you want to analyze more complicated data types, you learn you'll need to use different neural network architectures. For images, you're taught to use Convolutional Neural Networks (CNNs) that look like this:

![](/images/convolutions.gif "Convolutional Network diagram by Wikipedia")

For text, you're introduced to Recurrent Neural Networks (RNNs), although those are quickly being abandoned in favor of the [Transformer](http://jalammar.github.io/illustrated-transformer/) architecture (which is, well, a little more complicated):

![](/images/transformer_architecture.png "Transformer architecture from the original Attention is All You Need paper")

But the inquisitive beginner might wonder, why do we use all these different architectures? Why not just throw all data types--text, speech, images, waveforms--straight into a simple vanilla neural network?

Here's a fun fact: the simplest neural networks (feed-forward nets with only a single hidden layer) are [universal function approximators](http://neuralnetworksanddeeplearning.com/chap4.html). That means that for any continuous function at all (i.e. any smooth line on a graph), there exists a simple neural network that perfectly fits it. This also implies that for any complicated neural network you could build--an LSTM or CNN or Transformer--there exists some simpler neural network that approximates it arbitrarily well.

Why, then, *can't* we just solve all problems with feed forward neural networks?

The answer is that, even though some very ef