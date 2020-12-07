---
layout: post
title: "Transformers in 5 Minutes: Explaining the Tech Behind BERT, GPT-3, and
  AlphaFold 2"
date: 2020-12-04T17:38:46.694Z
description: Transformers and attention are the new gold standard in modern NLP.
  Here's how they work
feature_image: /images/about.jpg
thumbnail_image: /images/about.jpg
tags:
  - nlp
permalink: how-transformers-bert-gpt3-attention-works
---
You know that expression *When you have a hammer, everything looks like a nail*? Well, in machine learning, it seems like we really have discovered a magical hammer for which everything is, in fact, a nail. It's called the Transformer, and it's the neural network architecture that underlies tons of recent breakthroughs in machine learning, like BERT (the NLP model that [underlies Google Search](https://blog.google/products/search/search-language-understanding-bert/)), [GPT-3](https://daleonai.com/gpt3-explained-fast) (the scary-good poem/essay/op-ed/code/html/SQL writing bot made by OpenAI), and, now [AlphaFold 2](https://deepmind.com/blog/article/alphafold-a-solution-to-a-50-year-old-grand-challenge-in-biology) (the model that cracked the protein-folding problem). It's fair to say that today, if you want to work in machine learning, you have to at *least* know how to use Transformers and, better yet, know how they work.

In this post, I'll try to give you an intuition for how Transformers work in under five minutes. *Cracks knuckles*.

## Where did we come from?

But first, some background. Originally, transformers were designed as NLP models (though now they've been applied to vision, audio, and even protein folding), specifically to do translation. Before they were invented, the way people built deep learning models that understood text was with Recurrent Neural Networks (RNNs). If you've ever heard of a GRU or LSTM, these are types of recurrent neural networks.

![Diagram of RNN](/images/rnn-1.png "Simplified picture of a recurrent neural network")

RNNs process text as sequences. They take as input the first word in a sentence, do some processing, look at the second word in the second, do some processing, look at the third word, and so on, sequentially. Eventually the spit out a translation or a sentiment score or a label depending on what task you trained your RNN to do.

But RNNs were notoriously annoying to work with. They had these mathematical quirks called vanishing and exploding gradients which made them hard to train. They didn't have very good long-term memory, meaning if you used an RNN to analyze a long paragraph, it would often forget what it'd read in the beginning by the time it got to the end.

Maybe the biggest problem with RNNs, though, was that they were really slow to train. Since RNNs analyzed one word at a time, they were hard to parallelize, which meant they couldn't take advantage of fancy processors like GPUs or TPUs.

The Transformer fixes a lot of those limitations, but the most important one is that parallelization issue. Because Transformers can be easily parallelized, they can be scaled efficiently by adding more computational power, which means you can start training them on really massive datasets and get mind-boggling results (this, in fact, is why GPT-3 is so impressively good--it was trained on an enormous dataset!). 

## How Do Transformers Work?

Okay, so how do these bad boys work? It should be pretty easy to glean from this diagram from the original paper:

![Transformer architecture](/images/screen-shot-2020-12-04-at-1.11.31-pm.png "Transformer architecture")