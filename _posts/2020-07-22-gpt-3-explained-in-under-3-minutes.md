---
layout: post
title: GPT-3 Explained in Under 3 Minutes
description: A quick, under-the-hood explanation of how OpenAI's new GPT3 language
  model works.
date: 2020-07-22 05:00:00 +0000
feature_image: "/images/gpt-3-explained-in-under-3-minutes.png"
tags:
- nlp
- generative models
- machine learning
permalink: gpt3-explained-fast

---
***

_Peek under the hood of GPT-3 in under 3 minutes._

<!--more-->

So, you’ve seen some amazing GPT-3 demos on Twitter (machine-made Op-Eds, poems, articles, even working code)... but what’s going on under the hood of this incredible model? Here’s a (brief!) look under the hood.

GPT-3 is a neural-network-powered language model. A [language model](https://towardsdatascience.com/language-modeling-c1cf7b983685) is a model that predicts the likelihood of a sentence existing in the world. For example, a language model can label the sentence “I take my dog for a walk” more probable to exist (i.e. on the Internet) than the sentence “I take my banana for a walk.” This is true for sentences as well as phrases and, more generally, any sequence of characters.

Like most language models, GPT-3 is elegantly trained on an unlabeled text dataset (in this case, [Common Crawl](https://commoncrawl.org/)). Words or phrases are randomly removed from the text, and the model must learn to fill them in using only the surrounding words as context. It’s a simple training task that results in a powerful and generalizable model.

The GPT-3 model architecture itself is a [transformer-based](https://towardsdatascience.com/https-medium-com-chaturangarajapakshe-text-classification-with-transformer-models-d370944b50ca) neural network. This architecture became popular about 2–3 years ago, and is the basis for the popular NLP model [BERT](https://towardsdatascience.com/bert-explained-state-of-the-art-language-model-for-nlp-f8b21a9b6270). From an architecture perspective, GPT-3 is not actually very novel! So what makes it so special and magical?

IT’S REALLY BIG. I mean _really_ big. With 175 billion parameters, it’s the largest language model ever created (GPT-2 had only 1.5 parameters!), and was trained on the largest dataset of any language model. This, it appears, is the main reason GPT-3 is so impressive.

And here’s the really magical part. Training on all that data allowed GPT-3 to do something no other model can do (well): perform _specific_ tasks without any special tuning. You can ask GPT-3 to be a translator, or a programmer, or a poet, or to parse the nutrition labels off a cereal box, and it can do this all with fewer than 10 examples.

And here’s the magical part. As a result, GPT-3 can do what no other model can do (well): perform *specific* tasks without any special tuning. You can ask GPT-3 to be a translator, a programmer, a poet, or a famous author, and it can do it with fewer than 10 training examples. _Damn_.

Most other models (like BERT) require an elaborate fine-tuning step, where you gather _thousands_ of examples of (for example) French-English sentence pairs to teach it how to do translation. With GPT-3, you don’t need to do that fine-tuning step. This is the heart of it. This is what gets people excited about GPT-3: custom language tasks without training data.

Today, GPT-3 is in private beta, but boy can I not wait to get my hands on it.

***

_Want more? Let's connect on_ [_Instagram_](https://www.instagram.com/dale_on_ai/) _and_ [_Twitter_](https://twitter.com/dalequark)_!_