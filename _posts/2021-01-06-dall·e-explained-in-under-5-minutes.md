---
layout: post
title: DALL·E Explained in Under 5 Minutes
date: 2021-01-06T18:50:35.324Z
description: OpenAI's new image-generating-model does more than just paint the world
feature_image: /images/about.jpg
thumbnail_image: /images/about.jpg
tags:
  - openai
  - gpt3
  - nlp
  - computervision
permalink: dalle-5-mins
---
Is it just this massive cold brew I'm drinking, or is OpenAI's new image-generating model, [DALL·E](https://openai.com/blog/dall-e/), really out of this world?

This mega 12-billion-parameter behemoth takes a text caption (i.e. "an armchair in the shape of an avocado") and generates images to match it:

![Generated images of avocado chairs](/images/screen-shot-2021-01-06-at-1.37.37-pm.png "Generated images of avocado chairs")

*From https://openai.com/blog/dall-e/.*

In July, the same company, OpenAI, released a similarly huge model called GPT-3 that wowed the world with [its ability to generate human-like text](https://daleonai.com/gpt3-explained-fast), including Op Eds, poems, sonnets, and even computer code. Now OpenAI has applied the same technique--training a kind of neural network called a "Transformer" on a massive dataset scraped from the web--to generate pictures from text.

In one example from their blog, the model renders images from the text prompt "a living room with two white armchairs and a painting of the collosseum. the painting is mounted above a modern fireplace":

![DALLE generated images](/images/screen-shot-2021-01-06-at-2.39.07-pm.png "DALLE generated images")

*From https://openai.com/blog/dall-e/.* 

Pretty slick, right? Of course, the skeptical machine learning engineer might wonder whether DALL·E's images are so high-quality because they've simply been copied or memorized from the model's training data set (all those pictures from the web).

To prove DALL·E isn’t just memorizing and regurgitating images, the OpenAI authors made it render some pretty unusual prompts: 



“a professional high quality illustration of a giraffe turtle chimera."

![](/images/screen-shot-2021-01-06-at-1.39.04-pm.png)

*From https://openai.com/blog/dall-e/.* 

![](/images/screen-shot-2021-01-06-at-1.39.12-pm.png)

"a snail made of a harp.”

It's hard to imagine the model came across many giraffe-turtle hybrids in its training data set.

Plus, these bizarre prompts hint at something even more fascinating about DALL·E: its ability to perform "zero-shot visual reasoning." Typically in machine learning, we train models by giving them thousands or millions of examples of tasks we want them to preform and hope they pick up on the pattern.

To train a model that identifies dog breeds, for example, we might show a neural network thousands of pictures of dogs labeled by breed and then test its ability to tag new pictures of dogs. It's a task with limited scope that seems almost quaint compared to OpenAI's latest models.

Zero-shot learning, on the other hand, is the ability of models to perform tasks that they weren't specifically trained to do. For example, DALL·E was trained to generate images from captions. But with the right text prompt, it can also transform images into sketches:





Even more fascinating, DALL·E is able to do some “zero-shot visual reasoning.” In other words, it can perform specific tasks (like converting a picture to a sketch) without additional training. Take a look at its results for the prompt “the exact same cat on the top as a sketch on the bottom”:

DALL·E can recognize things like time period and location (i.e. “a phone from the 20s” “a photo of the food of china”) 

… as well as concepts like a “macro photograph” and a “cross-section view”.

The results are really quite incredible, and the blog post has a bunch more examples: <https://openai.com/blog/dall-e/>

Seeing a theme here?

\#DALL·E is yet another example, along with #GPT3, that 

hugely big neural networks trained on unlabeled (self-supervised) internet data are highly versatile, able to perform lots of tasks weren't originally intended for.

“We find that DALL·E extends this capability to the visual domain, and is able to perform several kinds of image-to-image translation tasks when prompted in the right way.”

We did not anticipate that this capability would emerge, and made no modifications to the neural network or training procedure to encourage it.