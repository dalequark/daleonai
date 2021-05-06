---
layout: post
title: "Transformers, Explained: Understand the Model Behind GPT-3, BERT, T5,
  and More"
date: 2021-05-06T15:57:35.230Z
description: A quick intro to Transformers, a new neural network transforming
  SOTA in machine learning.
feature_image: /images/ai-dubs.png
thumbnail_image: /images/ai-dubs.png
permalink: transformers-explained
---
The neat thing about working in Machine Learning is that every three or four years, someone discovers something revolutionary that makes you completely reconsider what's possible--whether it's a model that [beats the world champion in Go](https://deepmind.com/research/case-studies/alphago-the-story-so-far) or that generates [eerily realistic human faces](https://thispersondoesnotexist.com/).

Today, the mind-blowing discovery that's rocking everyone's world is a type of neural network architecture called a Transformer. Transformers are models that can be designed to translate text, write [poems and op eds](https://www.gwern.net/GPT-3), and e[ven generate computer code](https://www.wired.com/story/ai-latest-trick-writing-computer-code/). In fact, lots of the amazing research I write about on daleonai.com is built on Transformers, like [AlphaFold 2](https://daleonai.com/how-alphafold-works), the model that predicts the structures of proteins from their genetic sequences, as well as powerful natural language processing (NLP) models like [GPT-3](https://daleonai.com/how-alphafold-works), BERT, T5, Switch, Meena, and others. It's as if Transformers are a magical machine learning hammer that seems to turn every problem into a nail. You might say they're more than meets the... ugh, forget it.

If you want to stay hip in machine learning and especially NLP, you have to know at least a bit about Transformers. So in this post, we'll talk about what they are, how they work, and why they've been so impactful.

- - -

A Transformer is a type of neural network architecture. To recap, neural nets are a very effective type of model for analyzing complex data types like images, videos, audio, and text. But there are different types of neural networks optimized for different types of data. For example, for analyzing images, we'll typically use [convolutional neural networks](https://en.wikipedia.org/wiki/Convolutional_neural_network) or "CNNs." Vaguely, they're mimic the way the human brain processes visual information.

![](/images/cnn.png "Convolutional Neural Network")

*Convolutional Neural Network, courtesy Renanar2 at Wikicommons*

And [since around 2012](https://qz.com/1034972/the-data-that-changed-the-direction-of-ai-research-and-possibly-the-world/), we've been quite successful at solving vision problems with CNNs, like identifying objects in photos, recognizing faces, and reading handwritten digits. But for a long time, nothing comparably good existed for language tasks (translation, text summarization, text generation, named entity recognition, etc). That was unfortunate, because language is the main way we humans communicate.

Before Transformers were introduced in 2017, the way we used deep learning to understand text was with a type of model called a Recurrent Neural Network or RNN that looked something like this: