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

TODO: ADD PIC

Let’s say you wanted to translate a sentence from English to French. An RNN would take as input an English sentence, process the words one at a time, and then, sequentially, spit out their French counterparts. The key word here is “sequential.” In language, the order of words matters and you can’t just shuffle them around. The sentence:

"Jane went looking for trouble."

means something very different from the sentence:

“Trouble went looking for Jane”

So any model that’s going to understand language must capture word order, and recurrent neural networks did this by processing at one word at a time, in a sequence.

But RNNS had issues. First, they struggled to handle large sequences of text, like long paragraphs or essays. By the time got to the end of a paragraph, they'd forget what happened at the beginning. An RNN-based translation model, for example, might have trouble remembering the gender of the subject of a long paragraph.

Worse, RNNs were hard to train. They were notoriously susceptible to what's called the [vanishing/exploding gradient problem](https://towardsdatascience.com/the-exploding-and-vanishing-gradients-problem-in-time-series-6b87d558d22) (sometimes you simply had to restart training and cross your fingers). Even more problematic, because they processed words sequentially, RNNs were hard to parallelize. This meant you couldn't just speed up training by throwing more GPUs at the them, which meant, in turn, you couldn't train them on all that much data.



## Enter Transformers

This is where Transformers changed everything. They were developed in 2017 by researchers at Google and the University of Toronto, initially designed to do translation. But unlike recurrent neural networks, Transformers could be very efficiently parallelized. And that meant, with the right hardware, you could train some really big models.

How big?

Bigly big.

GPT-3, the especially impressive text-generation model that writes almost as well as a human was trained on some *45 TB* of text data, including almost all of the public web.

So if you remember anything about Transformers, let it be this: combine a model that scales well with a huge dataset and the results will likely blow you away.



## How do Transformers Work?