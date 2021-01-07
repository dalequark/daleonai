---
layout: post
title: DALL·E Explained in Under 5 Minutes
date: 2021-01-06T18:50:35.324Z
description: OpenAI's new image-generating-model does more than just paint pictures
feature_image: /images/copy-of-ai-stylist-2-.png
thumbnail_image: /images/copy-of-ai-stylist-3-.png
tags:
  - openai
  - gpt3
  - nlp
  - computervision
permalink: dalle-5-mins
---
It seems like every few months, someone publishes a machine learning paper or demo that makes my jaw drop. This month, it's OpenAI's new image-generating model, [DALL·E](https://openai.com/blog/dall-e/).

This behemoth 12-billion-parameter neural network takes a text caption (i.e. "an armchair in the shape of an avocado") and generates images to match it:

![Generated images of avocado chairs](/images/screen-shot-2021-01-06-at-1.37.37-pm.png "Generated images of avocado chairs")

*From https://openai.com/blog/dall-e/.*

I think its pictures are pretty inspiring (I'd buy one of those avocado chairs), but what's even more impressive is DALL·E's ability to understand and render concepts of space, time, and even logic (more on that in a second).

In this post, I'll give you a quick overview of what DALL·E can do, how it works, how it fits in with recent trends in ML, and why it's significant. Away we go!

## What is DALL·E and what can it do?

In July, DALL·E's creator, the company OpenAI, released a similarly huge model called GPT-3 that wowed the world with [its ability to generate human-like text](https://daleonai.com/gpt3-explained-fast), including Op Eds, poems, sonnets, and even computer code. DALL·E is a natural extension of GPT-3 that parses text prompts and then responds not with words but in pictures. In one example from OpenAI's blog, for example, the model renders images from the prompt "a living room with two white armchairs and a painting of the collosseum. the painting is mounted above a modern fireplace":

![DALLE generated images](/images/screen-shot-2021-01-06-at-2.39.07-pm.png "DALLE generated images")

*From https://openai.com/blog/dall-e/.* 

Pretty slick, right? You can probably already see how this might be useful for designers. Notice that DALL·E can generate a large set of images from a prompt. The pictures are then ranked by a second OpenAI model, called [CLIP](https://openai.com/blog/clip/), that tries to determine which pictures match best.

## How was DALL·E built?

Unfortunately, we don't have a ton of details on this yet because OpenAI has yet to publish a full paper. But at its core, DALL·E uses the same new neural network architecture that's responsible for tons of recent advances in ML: the [Transformer](https://arxiv.org/abs/1706.03762). Transformers, discovered in 2017, are an easy-to-parallelize type of neural network that can be scaled up and trained on huge datasets. They've been particularly revolutionary in natural language processing (they're the basis of models like BERT, T5, GPT-3, and others), improving the quality of [Google Search](https://blog.google/products/search/search-language-understanding-bert/) results, translation, and even in [predicting the structures of proteins](https://daleonai.com/how-alphafold-works).



By while these results are impressive, the skeptical machine learning engineer might wonder whether DALL·E's images are merely high-quality because they've simply been copied or memorized from the model's training data set (all those pictures from the web).

To prove DALL·E isn’t just regurgitating images, the OpenAI authors forced it to render some pretty unusual prompts: 

“a professional high quality illustration of a giraffe turtle chimera."

![](/images/screen-shot-2021-01-06-at-1.39.04-pm.png)

*From https://openai.com/blog/dall-e/.* 

"a snail made of a harp.”

![](/images/screen-shot-2021-01-06-at-1.39.12-pm.png)

*From https://openai.com/blog/dall-e/.* 

It's hard to imagine the model came across many giraffe-turtle hybrids in its training data set, making the results more impressive.

What's more, these weird prompts hint at something even more fascinating about DALL·E: its ability to perform "zero-shot visual reasoning." 



## Zero-Shot Visual Reasoning

Typically in machine learning, we train models by giving them thousands or millions of examples of tasks we want them to preform and hope they pick up on the pattern.

To train a model that identifies dog breeds, for example, we might show a neural network thousands of pictures of dogs labeled by breed and then test its ability to tag new pictures of dogs. It's a task with limited scope that seems almost quaint compared to OpenAI's latest feats.

Zero-shot learning, on the other hand, is the ability of models to perform tasks that they weren't specifically trained to do. For example, DALL·E was trained to generate images from captions. But with the right text prompt, it can also transform images into sketches:

![](/images/screen-shot-2021-01-06-at-1.41.02-pm.png)

*Results from the prompt, "the exact same cat on the top as a sketch on the bottom". From https://openai.com/blog/dall-e/*

Or render custom text on street signs:

![](/images/screen-shot-2021-01-06-at-2.51.53-pm.png)

Results from the prompt *"a store front that has the word 'openai' written on it'". From https://openai.com/blog/dall-e/.*

The model even shows understanding of visual concepts (i.e. "macroscopic" or "cross-section" pictures), places (i.e. "a photo of the food of china"), and time ("a photo of alamo square, san francisco, from a street at night"; "a photo of a phone from the 20s"). For all these examples and more, check out the [original blog post](https://openai.com/blog/dall-e/).

![](/images/screen-shot-2021-01-06-at-1.42.22-pm.png)

*"a photo of the food of china" from https://openai.com/blog/dall-e/.*

In fact, the authors went so far as to have DALL·E take a visual IQ test, where it had to complete images in a pattern:

![](/images/screen-shot-2021-01-06-at-3.05.50-pm.png)

*A screenshot of the visual IQ test OpenAI used to test DALL·E* *from https://openai.com/blog/dall-e/.*

I'm looking forward to hearing more about how DALL·E did on those visual IQ tests in the team's official research paper, not yet published.

But what struck me from the blog post was the authors' own surprise at DALL·E's performance on these general tasks:

“We find that DALL·E \[...] is able to perform several kinds of image-to-image translation tasks when prompted in the right way.

We did not anticipate that this capability would emerge, and made no modifications to the neural network or training procedure to encourage it."

It's amazing, but not wholly unexpected; DALL·E and GPT-3 are two examples of a greater theme in deep learning: that extraordinarily big neural networks trained on unlabeled internet data (an example "self-supervised learning") can be highly versatile, able to perform lots of tasks weren't originally intended for.

Of course, don't mistake this for general intelligence. The authors hint in the blog that DALL·E is "brittle" and shows much better results on some prompts than others. We'll know more when their peer-reviewed paper is published. But that doesn't mean I can't be excited in the meantime.