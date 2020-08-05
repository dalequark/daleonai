---
layout: post
title: Build Natural-Language-Powered Apps Fast  with Semantic Reactor and TensorFlow.js
description: ''
date: 
feature_image: ''
tags: []
permalink: semantic-ml

---
_In this post, I'll show you how to use beginner-friendly ML tools--Semantic Reactor and TensorFlow.js--to build an app that's powered by natural language._

<!--more-->

Most people are better at describing the world in language than they are at describing the world in code (well... _most_ people). It would be nice, then, if machine learning could help bridge the gap between the two.

That's where "Semantic ML" comes in, an umbrella term for machine learning techniques that capture the semantic meaning of words or phrases. In this post, I'll show you how you can use beginner-friendly tools (Semantic Reactor and Tensorflow.js) to prototype language-powered apps fast. Click here to jump straight to the tools...

Or stick around for some background:

### What are Embeddings?

One simple (but powerful) way Semantic ML can help us build natural-language-powered software is through a technique called embeddings.

In machine learning, embeddings are a learned way of representing data in space (i.e. points plotted on an n-dimensional grid) such that the distances between points are meaningful. Word vectors are one popular example:

![Visualization of word vectors](/images/word2vec-1.png "Visualization of word vectors")

_This image comes from this_ [_this Medium article_](https://medium.com/analytics-vidhya/implementing-word2vec-in-tensorflow-44f93cf2665f)_._

The picture above shows words ("England," "he," "fast") plotted in space such that similar words ("dog" and "dogs", "Italy" and "Rome", "woman" and "queen") are near each other. Each word is represented by a set of coordinates (or a vector), so the word "queen" might be represented by the coordinates \[0.38, 0.48, 0.99, 0.48, 0.28, 0.38\].

_Check out_ [_this neat visualization_](https://projector.tensorflow.org/)_._

Where do these numbers come from? They're learned by a machine learning model through data. In particular, the model learns which words tend to occur in the same spots in sentences. Consider these two sentences:

_My mother gave birth to a son._

_My mother gave birth to a daughter_.

Because the words "daughter" and "son" are often used in similar contexts, the machine learning model will learn that they should be represented close to each other in space.

Word embeddings are extremely useful in natural language processing. They can be used to find synonyms ("semantic similarity"), to do clustering, and as a preprocessing step in a more complicated model.

### Embedding Whole Sentences

It turns out that entire sentences (and even short paragraphs) can be effectively embedded in space too, using a type of model called a [universal sentence encoder](https://tfhub.dev/google/collections/universal-sentence-encoder/1). Using sentence embeddings, we can figure out if two sentences are similar. This is useful, for example, if you're building a chatbot and want to know if a question a user asked (i.e. "When is my alarm?") is semantically similar to a question you, the chatbot programmer, have programmed a response to ("What time is my alarm set for?").

### Semantic Reactor: Prototype with Semantic ML in a Google Sheet

Alright, now on to the fun part--building things!

First, some inspiration: I first became excited by Semantic ML when [Anna Kipnis](https://twitter.com/doubleanna) (former Game Designer at Double Fine, now at Stadia/Google) showed me how she used it to automate video game interactions. Using a sentence encoder model, she built a video game world that infers how the environment should react to player input using ML. Take a look at our interview here:

<iframe width="560" height="315" src="https://www.youtube.com/embed/30y9zk5COqw" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

In Anna's game, players can interact with a virtual fox by asking any question they think of:

"Fox, can I have some coffee?"

Then, using Semantic ML, the game engine (or the [utility system](https://en.wikipedia.org/wiki/Utility_system)) considers all of the possible ways the game might respond:

    Fox turns on lights.
    Fox turns on radio.
    Fox move to you.
    Fox brings you mug.
    
One of the easiest ways to prototype Semantic ML apps is with a new tool out of Google

Here's what it looks like:

![A gif showing how semantic reactor works in a google sheet](/images/screen-shot-2020-08-04-at-11-59-23-am.png "Semantic Reactor plugin")

To use it, create a new Google sheet

[https://tfhub.dev/google/universal-sentence-encoder/](https://tfhub.dev/google/universal-sentence-encoder/ "https://tfhub.dev/google/universal-sentence-encoder/")

In my humble opinion, one of the most under-hyped, user-friendly, useful tools in machine learning is embeddings--specifically text embeddings. We'll get deep dive into what embeddings are in a bit, but in brief: text embeddings let you take words (or phrases and sentences) and tell how similar they are. You can use this technique to find synonyms (i.e. "grandma" and "grand mom" and "bubby"), to do basic [translation](https://ai.stanford.edu/\~wzou/emnlp2013_ZouSocherCerManning.pdf), to cluster similar issues in your customer service queue, to power chatbot logic, to make video game worlds [come alive](https://stadia.dev/intl/fr_ca/blog/creating-game-ai-using-mostly-english/), and a whole lot more.

But perhaps the most exciting thing about embeddings is that you won't want to kill yourself learning how to use them. In this post, I'll show you how to use spreadsheets and pre-trained models to prototype a "Semantic ML"-powered app (no data science experience required). And, if you want to see how this tech can make video game worlds more interactive, check out [my latest interview](https://www.youtube.com/watch?v=MZEXwk_f7Tk) with Anna Kipnis--former Double Fine game developer and Stadia Creative Technologist--who is using the same technology to transform the ways we develop video games.

Let's get started.

In this