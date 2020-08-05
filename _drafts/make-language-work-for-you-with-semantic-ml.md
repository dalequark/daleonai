---
layout: post
title: Build Natural-Language-Powered Apps Fast  with Semantic Reactor and TensorFlow.js
description: Build a natural-language-powered app fast using Semantic Reactor (natural
  language in a Google Sheet) and TensorFlow.js
date: 2020-08-05 05:00:00 +0000
feature_image: "/images/build-language-powered-apps-fast-with-semantic-ml.png"
tags:
- chatbots
- machine learning
- tensorflow.js
- natural language processing
- 'nlp '
- tensorflow
permalink: semantic-ml

---
_In this post, I'll show you how to use beginner-friendly ML tools--Semantic Reactor and TensorFlow.js--to build an app that's powered by natural language._

<!--more-->

Most people are better at describing the world in language than they are at describing the world in code (well... _most_ people). It would be nice, then, if machine learning could help bridge the gap between the two.

That's where "Semantic ML" comes in, an umbrella term for machine learning techniques that capture the semantic meaning of words or phrases. In this post, I'll show you how you can use beginner-friendly tools (Semantic Reactor and Tensorflow.js) to prototype language-powered apps fast.

Scroll down to dive straight into the code and tools, or keep reading for some background:

## Understanding Semantic ML

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

Word embeddings are extremely useful in natural language processing. They can be used to find synonyms ("semantic similarity"), to do clustering, or as a preprocessing step for a more complicated nlp model.

### Embedding Whole Sentences

It turns out that entire sentences (and even short paragraphs) can be effectively embedded in space too, using a type of model called a [universal sentence encoder](https://tfhub.dev/google/collections/universal-sentence-encoder/1). Using sentence embeddings, we can figure out if two sentences are similar. This is useful, for example, if you're building a chatbot and want to know if a question a user asked (i.e. "When will you wake me up?") is semantically similar to a question you--the chatbot programmer--have anticipated and written a response to ("What time is my alarm?").

## Semantic Reactor: Prototype with Semantic ML in a Google Sheet

Alright, now on to the fun part--building things!

First, some inspiration: I originally became excited by Semantic ML when [Anna Kipnis](https://twitter.com/doubleanna) (former Game Designer at Double Fine, now at Stadia/Google) showed me how she used it to automate video game interactions. Using a sentence encoder model, she built a video game world that infers how the environment should react to player inputs using ML. It blew my mind. Check out our chat here:

<iframe width="560" height="315" src="https://www.youtube.com/embed/30y9zk5COqw" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

In Anna's game, players interact with a virtual fox by asking any question they think of:

"Fox, can I have some coffee?"

Then, using Semantic ML, the game engine (or the [utility system](https://en.wikipedia.org/wiki/Utility_system)) considers all of the possible ways the game might respond:

    Fox turns on lights.
    Fox turns on radio.
    Fox move to you.
    Fox brings you mug.

Using a sentence encoder model, the game decides what the best response is and executes it (in this case, the best response is _Fox brings you mug_, so the game animates the Fox bringing you a mug). If that sounds a little abstract, definitely watch the video I linked above.

One of the neatest aspects of this project was that Anna prototyped it largely in a Google Sheet using a tool called Semantic Reactor.

[Semantic Reactor](https://opensource.googleblog.com/2020/03/semantic-reactor-tool-for-experimenting.html) is a plugin for Google Sheets that allows you to use sentence encoder models right on your own data, in a sheet. It was released quietly by Google Research in March. (For now, you'll need to [fill out an application](https://events.withgoogle.com/ai-workshop/registrations/new/) to get access.) It's a really great way to prototype Semantic ML apps fast, which you can then turn into code using [TensorFlow.js models](https://www.npmjs.com/package/@tensorflow-models/universal-sentence-encoder) (but more on that in a minute).

Here's a little gif of what the tool looks like:

![A gif showing how semantic reactor works in a google sheet](/images/screen-shot-2020-08-04-at-11-59-23-am.png "Semantic Reactor plugin")

To use Semantic Reactor, create a new Google sheet and write some sentences in the first column. Here, I'll loosely recreate Anna's fox demo (for all the nitty gritties, check out her [original post](https://stadia.dev/intl/fr_ca/blog/creating-game-ai-using-mostly-english/)). I put these sentences in the first column of my Google sheet:

    I grab a ball
    I go to you
    I play with a ball
    I go to school.
    I go to the mug.
    I bring you the mug.
    I turn on music.
    I take a nap.
    I go for a hike.
    I tell you a secret.
    I snuggle with you.
    I ask for a belly rub.
    I send a text.
    I answer the phone.
    I make a sandwich.
    I drink some water.
    I play a board game.
    I do some coding.

You'll have to use your imagination here and think of these "actions" that a potential character (e.g. a chatbot or an actor in a video game) might take.

Once you've applied for and been given access to Semantic Reactor, you'll be able to enable it by clicking on "Add-ons -> Semantic Reactor -> Start".

![A screenshot of starting Semantic Reactor](/images/screen-shot-2020-08-04-at-11-59-23-am.png "Enable Semantic Reactor in a spreadsheet")

Clicking "Start" will open a panel that allows you to type in an input and hit "React":

![](/images/screen-shot-2020-08-05-at-12-33-45-pm.png)

When you hit "React", Semantic Reactor uses a model to embed all of the responses you've written in that first column, calculate a score (how good a response is this sentence to the query?), and sorts the results. For example, when my input was "I want some coffee," the top ranked responses from my spreadsheet were, "I go to the mug" and "I bring you the mug."

You'll also notice that there are two different ways to rank sentences using this tool: "Input/Response" and "Semantic Similarity." As the name implies, the former ranks sentences by how good they are as _responses_ to the given query, whereas "Semantic Similarity" simply rates how similar the sentences are to the query.

## From Spreadsheet to Code with TensorFlow.js

Underneath the hood, Semantic Reactor is powered by the open-source TensorFlow.js models found [here](https://www.npmjs.com/package/@tensorflow-models/universal-sentence-encoder).

Let's take a look at how to use those models in JavaScript, so that you can convert your spreadsheet prototype into a working app.

1. Create a new Node project and install the module:

    npm init
    npm install @tensorflow/tfjs @tensorflow-models/universal-sentence-encoder

1. Create a new file (`use_demo.js`) and require the library:

    require('@tensorflow/tfjs');
    const encoder = require('@tensorflow-models/universal-sentence-encoder');

1. Load the model:

      const model = await encoder.loadQnA();

1. Encode your sentences and query:

      const input = {
        queries: ["I want some coffee"],
        responses: [
          "I grab a ball",
          "I go to you",
          "I play with a ball",
          "I go to school.",
          "I go to the mug.",
          "I bring you the mug."
      	]
      };
      
      const embeddings = await model.embed(input);

1. Voila! You've transformed your responses and query into vectors. Unfortunately, vectors are just points in space. To rank the responses, you'll want to compute the distance between those points (you can do this by computing the [dot product](https://www.mathsisfun.com/algebra/vectors-dot-product.html), which gives you the squared [Euclidean distance](https://en.wikipedia.org/wiki/Euclidean_distance#:\~:text=In%20mathematics%2C%20the%20Euclidean%20distance,metric%20as%20the%20Pythagorean%20metric.) between points):

    
    zipWith :: (a -> b -> c) -> [a] -> [b] -> [c]
    const zipWith =
        (f, xs, ys) => {
          const ny = ys.length;
          return (xs.length <= ny ? xs : xs.slice(0, ny))
              .map((x, i) => f(x, ys[i]));
        }
    
    // Calculate the dot product of two vector arrays.
    const dotProduct = (xs, ys) => {
      const sum = xs => xs ? xs.reduce((a, b) => a + b, 0) : undefined;
     
      return xs.length === ys.length ?
        sum(zipWith((a, b) => a * b, xs, ys))
        : undefined;
    }

If you run this code, you should see output like:

    [
      { response: 'I grab a ball', score: 10.788130270345432 },
      { response: 'I go to you', score: 11.597091717283469 },
      { response: 'I play with a ball', score: 9.346379028479209 },
      { response: 'I go to school.', score: 10.130473646521292 },
      { response: 'I go to the mug.', score: 12.475453722603106 },
      { response: 'I bring you the mug.', score: 13.229019199245684 }
    ]

Check out the full code sample [here](https://github.com/google/making_with_ml/blob/master/semantic_ml/use_sample.js).

And that's it--that's how you go from an Semantic ML spreadsheet to code fast!

Pretty cool, right? If you build something with these tools, make sure you let me know in the comments below or on Twitter.

***

Tweet [@dalequark](https://twitter.com/dalequark) or follow [@dale_on_ai](https://www.instagram.com/dale_on_ai/) on Instagram.