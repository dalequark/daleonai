---
layout: post
title: GPT-3 Explained in Under 3 Minutes
description: A quick, under-the-hood explanation of how OpenAI's new GPT3 language
  model works.
date: 2020-07-22T05:00:00.000+00:00
feature_image: "/images/gpt-3-explained-in-under-3-minutes.png"
tags:
- nlp
- generative models
- machine learning
permalink: gpt3-explained-fast

---

_Peek under the hood of GPT-3 in under 3 minutes._

<!--more-->

So, you’ve seen some amazing GPT-3 demos on Twitter (if not, where've you been?). This mega machine learning model, created by [OpenAI](https://openai.com/), can write it's own op-eds, poems, articles, and even working code:

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">This is mind blowing.<br><br>With GPT-3, I built a layout generator where you just describe any layout you want, and it generates the JSX code for you.<br><br>W H A T <a href="https://t.co/w8JkrZO4lk">pic.twitter.com/w8JkrZO4lk</a></p>— Sharif Shameem (@sharifshameem) <a href="https://twitter.com/sharifshameem/status/1282676454690451457?ref_src=twsrc%5Etfw">July 13, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Here's <a href="https://twitter.com/hashtag/gpt3?src=hash&ref_src=twsrc%5Etfw">#gpt3</a> writing some SQL for me. <a href="https://t.co/JVeyijV2MX">pic.twitter.com/JVeyijV2MX</a></p>— Ayush Patel (@ayushpatel34) <a href="https://twitter.com/ayushpatel34/status/1284810560555479043?ref_src=twsrc%5Etfw">July 19, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">=GPT3()... the spreadsheet function to rule them all.<br><br>Impressed with how well it pattern matches from a few examples.<br><br>The same function looked up state populations, peoples' twitter usernames and employers, and did some math. <a href="https://t.co/W8FgVAov2f">pic.twitter.com/W8FgVAov2f</a></p>— Paul Katsen (@pavtalk) <a href="https://twitter.com/pavtalk/status/1285410751092416513?ref_src=twsrc%5Etfw">July 21, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

If you want to try out GPT-3 today, you'll need to apply to be whitelisted by OpenAI. But the applications of this model seem endless--you could ostensibly use it to query a SQL database in plain English, automatically comment code, automatically _generate_ code, write trendy article headlines, write viral Tweets, and a whole lot more.

But what’s going on under the hood of this incredible model? Here’s a (brief) look inside.

GPT-3 is a neural-network-powered language model. A [language model](https://towardsdatascience.com/language-modeling-c1cf7b983685) is a model that predicts the likelihood of a sentence existing in the world. For example, a language model can label the sentence “I take my dog for a walk” as more probable to exist (i.e. on the Internet) than the sentence “I take my banana for a walk.” This is true for sentences as well as phrases and, more generally, any sequence of characters.

Like most language models, GPT-3 is elegantly trained on an unlabeled text dataset (in this case, the training data includes among others [Common Crawl](https://commoncrawl.org/) and Wikipedia). Words or phrases are randomly removed from the text, and the model must learn to fill them in using only the surrounding words as context. It’s a simple training task that results in a powerful and generalizable model.

The GPT-3 model architecture itself is a [transformer-based](https://towardsdatascience.com/https-medium-com-chaturangarajapakshe-text-classification-with-transformer-models-d370944b50ca) neural network. This architecture became popular around 2–3 years ago, and is the basis for the popular NLP model [BERT](https://towardsdatascience.com/bert-explained-state-of-the-art-language-model-for-nlp-f8b21a9b6270) and GPT-3's predecessor, GPT-2. From an architecture perspective, GPT-3 is not actually very novel! So what makes it so special and magical?

IT’S REALLY BIG. I mean _really_ big. With 175 billion parameters, it’s the largest language model ever created (an order of magnitude larger than its nearest competitor!), and was trained on the largest dataset of any language model. This, it appears, is the main reason GPT-3 is so impressively "smart" and human-sounding.

But here’s the really magical part. As a result of its humongous size, GPT-3 can do what no other model can do (well): perform _specific_ tasks without any special tuning. You can ask GPT-3 to be a translator, a programmer, a poet, or a famous author, and it can do it with its user (you) providing fewer than 10 training examples. _Damn_.

This is what makes GPT-3 so exciting to machine learning practitioners. Other language models (like BERT) require an elaborate fine-tuning step where you gather _thousands_ of examples of (say) French-English sentence pairs to teach it how to do translation. To adapt BERT to a specific task (like translation, summarization, spam detection, etc.), you have to go out and find a large training dataset (on the order of thousands or tens of thousands of examples), which can be cumbersome or sometimes impossible, depending on the task. With GPT-3, you don’t need to do that fine-tuning step. This is the heart of it. This is what gets people excited about GPT-3: custom language tasks without training data.

Today, GPT-3 is in private beta, but boy can I not wait to get my hands on it.

***

_Want more? Let's connect on_ [_Instagram_](https://www.instagram.com/dale_on_ai/) _and_ [_Twitter_](https://twitter.com/dalequark)_!_