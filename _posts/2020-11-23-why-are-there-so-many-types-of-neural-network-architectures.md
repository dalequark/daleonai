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
CNNs, LSTMs, transformers, BERT--we have a veritable zoo of neural network architectures with more out by the day. But why?

![](/images/nn_zoo.png "Neural Network Zoo poster from the Asimov Institute")

When you first learn deep learning, you're introduced to the simples type of neural network: a feed-forward neural network.  

Here's a fun fact: the simplest neural networks (feed-forward nets with only a single hidden layer) are [universal function approximators](http://neuralnetworksanddeeplearning.com/chap4.html). That means that for any continuous function at all (i.e. any smooth line on a graph), there exists a simple neural network that perfectly fits it.

One implication of this fact is that for any complicated neural network you could build--an LSTM or CNN or Transformer or whatever--there exists some simpler neural network that approximates it arbitrarily well.

I'm getting at a simple question