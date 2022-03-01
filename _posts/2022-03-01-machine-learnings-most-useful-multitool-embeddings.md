---
layout: post
title: "Machine Learning's Most Useful Multitool: Embeddings"
date: 2022-03-01T16:30:55.384Z
description: Are embeddings machine learning's most underrated but super useful tool?
feature_image: /images/apple-watch.jpg
thumbnail_image: /images/apple-watch.jpg
tags:
  - ai
  - nlp
  - computervision
  - ml
permalink: embeddings-explained
---
Embeddings are one of the most versatile techniques in machine learning, and a critical tool every ML engineer should have in their tool belt. It’s a shame, then, that so few of us understand what they are and what they’re good for!

The problem, maybe, is that embeddings sound slightly abstract and esoteric:

*In machine learning, an embedding is a way of representing data as points in n-dimensional space so that similar data points cluster together.*

Sound boring and unimpressive? Don’t be fooled. Because once you understand this ML multitool, you’ll be able to build everything from search engines to recommendation systems to chatbots, and a whole lot more. Plus, you don’t have to be a data scientist with ML expertise to use them, nor do you need a huge labeled dataset.

Have I convinced you how neat these bad boys are? 🤞

Good. Let’s dive in. In this post, we’ll explore:

* What embeddings are
* What they’re used for
* Where and how to find open-source embedding models
* How to use them
* How to build your own embeddings

## What can you build with embeddings?

Before we talk about what embeddings are, let’s take quick stock of what you can build with them. (You know--to whet your appetite.)

1. Recommendation systems (i.e. Netflix-style if-you-like-these-movies-you’ll-like-this-one-too)
2. All kinds of search

   * Text search (like Google Search)
   * Image search (like Google search-by-image)
   * Music search (à la "what song is this?")
3. Chatbots and question-answering systems
4. Data preprocessing (preparing data to be fed into a machine learning model)
5. One-shot/zero-shot learning (i.e. machine learning models that learn from almost no training data)
6. Fraud detection/outlier detection
7. Typo detection and all manners of “fuzzy matching”
8. Detecting when ML models go stale (drift)
9. So much more!

Even if you’re not trying to do something on this list, the applications of embeddings are so broad that you should probably keep reading, just in case. Right?

## What are Embeddings?

Embeddings are a way of representing data–almost any kind of data, like text, images, videos, users, music, whatever–as points in space where the locations of those points in space are semantically meaningful.

The best way to intuitively understand what this means is by example, so let’s take a look at one of the most famous embeddings, Word2Vec.

Word2Vec (short for word to vector) was a technique invented by Google in 2013 for embedding words. It takes as input a word and spits out an n-dimensional coordinate (or “vector”) so that when you plot these word vectors in space, synonyms cluster. Here’s a visual:

![Word2vec illustration](/images/word2vec.png "Word2vec illustration")

*Words plotted in 3-dimensional space. Embeddings can have hundreds or thousands of dimensions–too many for humans to visualize.*

With Word2Vec, similar words cluster together in space–so the vector/point representing “king” and “queen” and “prince” will all cluster nearby. Same thing with synonyms (“walked,” “strolled,” “jogged”).

For other data types, it’s the same thing. A song embedding would plot similar-sounding songs nearby. An image embedding would plot similar-looking images nearby. A customer-embedding would plot customers with similar buying habits nearby.

You can probably already see how this is useful: embeddings allow us to find similar data points. I could build a function, for example, that takes as input a word (i.e. “king”) and finds me its ten closest synonyms. This is called a nearest neighbor search. Not terribly interesting to do with single words, but imagine instead if we embedded whole movie plots. Then we could build a function that, given the synopsis of one movie, gives us ten similar movies. Or, given one news article, recommends semantically similar articles.

Additionally, embeddings allow us to compute numerical similarity scores between embedded data points, i.e. “How similar is this news article to that one?” One way to do this is to compute the distance between two embedded points in space and say that the closer they are, the more similar they are. This measure is also known as Euclidean distance. (You could also use dot product, cosine distance, and other trigonometric measures.)

Similarity scores are useful for applications like duplicate detection and facial recognition. To implement facial recognition, for example, you might embed pictures of people’s faces, then determine that if two pictures have a high enough similarity score, they’re of the same person. Or, if you were to embed all the pictures on your cell phone camera and found photos that were very nearby in embedding space, you could conclude those points were likely near-duplicate photos.

Similarity scores can also be used for typo correction. In Word2Vec, common misspellings–”hello,” “helo,” “helllo,” “hEeeeelO”--tend to have high similarity scores because they’re all used in the same contexts.

The graphs above also illustrate an additional and very neat property of Word2Vec, which is that different axes capture grammatical meaning, like gender, verb tense, and so on. This means that by adding and subtracting word vectors, we can solve analogies, like “man is to woman as king is to \_\_\_\_.” It’s quite a neat feature of word vectors, though this trait doesn’t always translate in a useful way to embeddings of more complex data types, like images and longer chunks of text. (More on that in a second.)