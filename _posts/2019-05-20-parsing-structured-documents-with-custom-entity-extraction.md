---
layout: post
title: "Parsing Structured Documents with Custom Entity Extraction"
description: ""
date: 2019-05-20
feature_image: 
tags: ["natural language processing", "google cloud", "automl", "machine learning"]
---
    
    
{% include image_caption.html imageurl="/images/2019-05-20-parsing-structured-documents-with-custom-entity-extraction/0.jpeg" title="Let’s talk about parsing structured documents with entity extraction!" caption="Let’s talk about parsing structured documents with entity extraction!" %}

_Build your own custom entity extraction model with easy-to-use Machine Learning tools_

<!--more-->

There are lots of [great tutorials](https://medium.com/@srobtweets/classifying-congressional-bills-with-machine-learning-d6d769d818fd) on the web that explain how to classify chunks of text with Machine Learning. But what if, rather than just _categorize_ text, you want to categorize individual words, like this:

{% include image_caption.html imageurl="/images/2019-05-20-parsing-structured-documents-with-custom-entity-extraction/1.png" title="You can’t make me apologize for loving Comic Sans." caption="You can’t make me apologize for loving Comic Sans." %}


This is called [entity extraction](https://en.wikipedia.org/wiki/Named-entity_recognition) (or named-entity recognition) and it comes in handy a lot. You could use this technique, for example, to pick out all of the people and places mentioned in news articles and use them as article tags (newsrooms sometimes do this).

Entity Extraction (EE) is also useful for parsing structured documents like forms, W4s, receipts, business cards, and restaurant menus (which is what we’ll be using it for today).

For Google I/O this year, I wanted to build an app that could take a photo of a restaurant menu and automatically parse it — extracting all of the foods, their prices, and more. (You can see me demo it on stage [here](https://www.youtube.com/watch?v=OxJ-zBjVhIM&t=726s).)

I wanted to be able to upload a picture of a menu like this:

{% include image_caption.html imageurl="/images/2019-05-20-parsing-structured-documents-with-custom-entity-extraction/2.png" title="Step one: upload a photo of a menu" caption="Step one: upload a photo of a menu" %}



And then use machine learning to magically extract entities from the menu, like the restaurant’s address, phone number, all of the food headings (“Salads,” “Mains”), all of the foods, their prices, and their descriptions (i.e. “on a pretzel bun”).

The idea was that if you’re a restaurant that wants to get listed on an app like Seamless or Grubhub, you could input your menu without having to manually type the whole thing out.

{% include image_caption.html imageurl="/images/2019-05-20-parsing-structured-documents-with-custom-entity-extraction/3.png" title="Step two: identify all the foods, plus the food headings (“Salads,” “Mains”) and their descriptions (“On a pretzel bun”)." caption="Step two: identify all the foods, plus the food headings (“Salads,” “Mains”) and their descriptions (“On a pretzel bun”)." %}



So how does it work?

First, I used the [Google Cloud Vision API](https://cloud.google.com/vision/#benefits)’s text detection feature to convert my picture of a menu into raw text.

Once I had my menu in text format, I used entity extraction to parse it. I did this with two techniques:

1.  I extracted the restaurant’s address, phone number, and all of the listed prices by using the [Google Cloud Natural Language API](https://cloud.google.com/natural-language/).
2.  To identify food items, headings, and food descriptions, I had to build a custom machine learning model (more on that later).

The Natural Language API is able to automatically detect common entities. For example, if I send it the string:

> Dale would like to buy a $3.50 croissant from the coffee shop at 1600 Ampitheatre Pkwy, Mountain View, CA 94043, whose phone number is (650) 253–0000.

{% include image_caption.html imageurl="/images/2019-05-20-parsing-structured-documents-with-custom-entity-extraction/4.png" title="The NL API recognizes entities like people, consumer goods, addresses, price, phone numbers, and more." caption="The NL API recognizes entities like people, consumer goods, addresses, price, phone numbers, and more." %}



Next, I made my app a little sleeker by adding a restaurant photo, star ratings, and a map. None of this info was directly printed on the menu, but the restaurant’s phone number was. Using this phone number, I could query the [Google Places API](https://developers.google.com/places/web-service/search) to pull photos, star ratings, etc.

{% include image_caption.html imageurl="/images/2019-05-20-parsing-structured-documents-with-custom-entity-extraction/5.png" title="The restaurant’s star rating, photo, and GPS location come from the Places API." caption="The restaurant’s star rating, photo, and GPS location come from the Places API." %}



Building a Custom Entity Extraction Model
=========================================

Okay, but now for the hard (and most critical) bit: how do we extract all of the foods on the menu? And how do we tell the difference between what a food item is (“Veggie Burger”), what a food heading is (“Entrees”), and what a food description is (“on a pretzel bun”)?

These _entities_ are totally **domain-specific**. In our case, we want to recognize that “entree” is a food heading. But if we were instead parsing newspapers, we might want to recognize the difference between headlines and article text. Or if we were analyzing resumes, we’d want to identify that “Sr. Software Engineer” is a job title, and “Python” is a programming language.

While the Natural Language API I mentioned before recognizes phone numbers and addresses and more, it’s not trained to recognize these domain-specific entities.

For that, we’ll have to build a custom entity extraction model. There are [lots of ways of doing this](https://medium.com/discovering-the-essential-tools-for-named-entities-recognition-8176c94d9747), but I’ll show you the one I think is easiest (with minimal code), using [Google AutoML Natural Language](https://cloud.google.com/natural-language/automl/entity-analysis/docs/). We’ll use it to train a custom entity extraction model.

It works like this:

1.  Upload a labeled dataset of menus
2.  Train a model
3.  Use your model to identify custom entities via a REST API

Labeling Data
=============

But where to find a dataset of labeled menus?

Conveniently, I found [this nice dataset of scans of menus](http://menus.nypl.org/) hosted (and labeled!) by the New York Public Library. Sweet!

To get started, I used the Vision API again to convert all of the menus in that dataset to text.

In order to train a custom entity extraction model, I had to transform my data and its labels into jsonl format ([the format that AutoML expects](https://cloud.google.com/natural-language/automl/entity-analysis/docs/prepare)). It looks like this:

{% include image_caption.html imageurl="/images/2019-05-20-parsing-structured-documents-with-custom-entity-extraction/6.png" title="jsonl file format" caption="jsonl file format" %}



I’m going to be honest and warn you that actually labeling these menus was a pain. I used some hackish Python script to pair the dataset’s labels with the OCR-extracted menu text, but they often didn’t line up. I had to go into the AutoML UI and hand-label a bunch of these menus, like this:

{% include image_caption.html imageurl="/images/2019-05-20-parsing-structured-documents-with-custom-entity-extraction/7.png" title="Hand-labeling menus using the AutoML editor." caption="Hand-labeling menus using the AutoML editor." %}



In retrospect, I probably should have used a [data labeling service](https://cloud.google.com/vision/automl/docs/human-labeling) so I didn’t have to waste time labeling myself (or interns, maybe?).

I also scraped Wikipedia’s [cuisine pages](https://en.wikipedia.org/wiki/List_of_Italian_dishes) and generated some fake menus to help augment my dataset.

Training a Model
================

With Google AutoML, the hardest part of building a model is building a labeled dataset. Actually _training_ a model with that data is pretty straightforward — just hop into the “Train” tab and click “Start Training.” It takes about 4 hours to build a custom model.

{% include image_caption.html imageurl="/images/2019-05-20-parsing-structured-documents-with-custom-entity-extraction/8.png" title="Behind the scenes, Google trains a neural network to extract your custom entities." caption="Behind the scenes, Google trains a neural network to extract your custom entities." %}



Making Predictions
==================

When our entity extraction model is done training, we can test it out in the AutoML UI:

{% include image_caption.html imageurl="/images/2019-05-20-parsing-structured-documents-with-custom-entity-extraction/9.png" title="The model tagged most of the entities, but missed “Potato Chips” and “Fish and Chips.”" caption="The model tagged most of the entities, but missed “Potato Chips” and “Fish and Chips.”" %}



As you can see, it doesn’t work perfectly.

But what do you want?! That’s machine learning. It’s not _perfect_.

That said, not bad considering I had a pretty small dataset (less than 150 menus). I also didn’t take into account things like the size of the text or its location on the page (headers are usually bigger than dish names, and dishes are bigger than their descriptions).

But still, if I were a restaurant and I could use this tool to import my menu instead of manually typing out every single food by hand, I’d save lots of time (though I might have to do a bit of editing). Plus, the more hypothetical restaurants use my app, the more hypothetical data points I’ll get to improve my model.

Meanwhile, lunch at the Google Cafe calls. Ciao.

P.S. If you train your own entity extraction model, tell me about it in the comments or [@dalequark](https://twitter.com/dalequark).

Happy Modeling!
