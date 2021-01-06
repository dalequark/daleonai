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

This mega 12-billion-parameter behemoth takes a text caption (i.e. "an armchair in the shape of an avocado") and generates images that match it:

![Generated images of avocado chairs](/images/screen-shot-2021-01-06-at-1.37.37-pm.png "Generated images of avocado chairs")

*From https://openai.com/blog/dall-e/.*



DALL·E can take a user-generated caption—“an armchair in the shape of an avocado”—and turn them into images. It’s based on a Transformer architecture very similar to that used in BERT and GPT-3.

To prove that DALL·E isn’t just memorizing images from the web and regurgitating them, the OpenAI authors made it work with some pretty unusual prompts: “a cube made of a porcupine.” “An emoji of a baby penguin wearing a blue hat, red gloves, green shirt and yellow pants.” “A snail made of a harp.”

Although the results shown in the OpenAI blog post weren’t cherry-picked by humans, they were ranked by a second neural network called “CLIP,” so we are (probably) seeing the best of DALL·E’s results.

Even more fascinating, DALL·E is able to do some “zero-shot visual reasoning.” In other words, it can perform specific tasks (like converting a picture to a sketch) without additional training. Take a look at its results for the prompt “the exact same cat on the top as a sketch on the bottom”:

DALL·E can recognize things like time period and location (i.e. “a phone from the 20s” “a photo of the food of china”) 

… as well as concepts like a “macro photograph” and a “cross-section view”.

The results are really quite incredible, and the blog post has a bunch more examples: <https://openai.com/blog/dall-e/>

Seeing a theme here?

\#DALL·E is yet another example, along with #GPT3, that 

hugely big neural networks trained on unlabeled (self-supervised) internet data are highly versatile, able to perform lots of tasks weren't originally intended for.

“We find that DALL·E extends this capability to the visual domain, and is able to perform several kinds of image-to-image translation tasks when prompted in the right way.”

We did not anticipate that this capability would emerge, and made no modifications to the neural network or training procedure to encourage it.