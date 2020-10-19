---
layout: post
title: A Beginner's Guide to Painless ML on Google Cloud
date: 2020-10-19T18:23:26.191Z
description: "A round up of my favorite Google Cloud tools that make it easy for
  developers to use ML. "
feature_image: /images/painless-ai-on-google-cloud.png
thumbnail_image: /images/painless-ai-on-google-cloud-1-.png
tags:
  - machine learning
  - nlp
  - google cloud
permalink: painless-gcp-ml
---
A few weeks ago, the folks who run Google's Cloud Blog asked me to put together a post for them on my favorite, developer-friendly ML tools. If you regularly read this blog, you've probably seen many of them in action! But if you haven't, here's the post (see the original [here](https://cloud.google.com/blog/products/ai-machine-learning/beginners-guide-to-painless-machine-learning)). Enjoy!

- - -

Building AI-powered apps can be painful. I know. I’ve endured a lot of that pain because the payout of using this technology is often worth the suffering.

Happily, over the past five years, developing with machine learning has gotten *much* easier thanks to user-friendly tooling. Nowadays I find myself spending very little time building and tuning machine learning models and much more time on traditional app development.

In this post, I’ll walk you through some of my favorite, painless Google Cloud AI tools and share my tips for building AI-powered apps fast. Let’s get to it.

### Use Pre-trained Models

One of the slowest and most unpleasant parts of machine learning projects is collecting labeled training data--labeled examples that a machine learning algorithm can “learn” from.

But for lots of common use cases, you don’t need to do that. Instead of building your own model from scratch, you can take advantage of *pre-trained* models that have been built, tuned, and maintained by someone else. Google Cloud’s AI APIs are one example.

The Cloud AI APIs allow you to use machine learning for things like:

* Transcribing [audio](http://cloud.google.com/speech) and [video](https://cloud.google.com/video-intelligence) files
* Reading [text from documents](https://cloud.google.com/natural-language)
* Parsing [structured documents](https://cloud.google.com/solutions/document-ai), like forms and invoices
* Detecting faces, emotions, and objects in [pictures](http://cloud.google.com/vision)
* Detecting explicit content in [images](http://cloud.google.com/vision)/[videos](https://cloud.google.com/video-intelligence)
* And a whole lot more

The machine learning models that power these APIs are similar to the ones used in many Google apps (like Photos). They’re trained on huge datasets and are often impressively accurate! For example, when I used the [Video Intelligence API](https://cloud.google.com/video-intelligence) to [analyze my family videos](https://cloud.google.com/blog/products/ai-machine-learning/building-an-ai-searchable-archive-for-30-years-of-family-videos), it was able to detect labels as specific as “bridal shower,” “wedding,” “bat and ball games,” and even “baby smiling.”

The Cloud AI APIs run in, well… the cloud. But if you need a free and offline solution, [TensorFlow.js](https://www.tensorflow.org/js/models) and [ML Kit](https://firebase.google.com/docs/ml-kit) provide a host of pre-trained models you can run directly in the browser or on a mobile device. There’s an even larger set of pre-trained TensorFlow models in [TensorFlow Hub](https://tfhub.dev/).

### Easy Custom Models with AutoML

Though you can find a pre-trained model for lots of use cases, sometimes you need to build something really custom. Maybe you want to build a model that analyzes medical scans like X -rays to detect the presence of disease. Or maybe you want to sort widgets from doodads on an assembly line. Or predict which of your customers is most likely to make a purchase when you send them a catalog.

For that, you’ll need to build a custom model. AutoML is a Google Cloud AI tool that makes this process as painless as possible. It lets you train a custom model on your own data, and you don’t even have to write code to do it (unless you *want* to).

In the gif below, you can see how I used AutoML Vision to train a model that detects busted components on a circuit board. The interface to label data is click-and-drag, and training a model is as simple as clicking the button “Train New Model.” When the model finishes training, you can evaluate its quality in the “Evaluate” tab and see where it’s made mistakes.

It works on images ([AutoML Vision](https://cloud.google.com/vision/automl)), video ([AutoML Video](https://cloud.google.com/video-intelligence/automl/docs)), language ([AutoML Natural Language](https://cloud.google.com/natural-language/automl/docs) and [AutoML Translation](https://cloud.google.com/translate/automl/docs)), documents, and tabular data ([AutoML Tables](https://cloud.google.com/automl-tables)) like you might find in a database or spreadsheet.

![Screenshot of AutoML Vision](/images/circuts.gif "Using AutoML Vision to identify components on a circuit board")

Even though the AutoML interface is simple, the models it produces are often impressively high-quality. Under the hood, the AutoML trains different models (like neural networks), comparing different architectures and parameters and choosing the most accurate combinations.

Using AutoML models in your app is easy. You can either allow Google to host the model for you in the Cloud and access it through a standard REST API or client library (Python, Go, Node, Java, etc), or export the model to TensorFlow so you can use it offline.

So that, more or less, makes model training easy. But where do you get a big training dataset from?

### Never Label Your Own Data

I mean it.

When I start an ML project, I first check to see if a pre-trained model that does what I want already exists.

If it doesn’t, I ask myself the same question about datasets. Almost any kind of dataset you could ever imagine exists on [Kaggle](https://www.kaggle.com/datasets), a dataset-hosting and competition site. From [tweets about COVID-19](https://www.kaggle.com/gpreda/covid19-tweets) to [a list of Chipotle locations](https://www.kaggle.com/jeffreybraun/chipotle-locations) to [a collection of fake news](https://www.kaggle.com/clmentbisaillon/fake-and-real-news-dataset) articles, you can often find at least *some* dataset on Kaggle that will let you train a proof-of-concept model for your problem. [Google Dataset Search](https://datasetsearch.research.google.com/) is also a helpful tool for finding datasets that will query both Kaggle and other sources.

![Screenshot of Google's Dataset Search](/images/dataset_search.gif "Google's Dataset Search tool")

Sometimes, of course, you must label your own data. But before you hire hundreds of interns, consider using Google’s [Data Labeling Service](https://cloud.google.com/ai-platform/data-labeling/docs). To use this tool, you describe how you’d like your data to be labeled and then Google sends it out to teams of human labelers. The resulting labeled dataset can be plugged directly into AutoML or other AI Platform models for training.

### From Model to Useable App

Lots of times, building (or finding) a functioning machine learning model isn’t the tricky part of a project. It’s enabling the other folks on your team to use that model on their own data. We faced this problem frequently in Google Cloud AI, which is why we decided to [add interactive demos](http://cloud.google.com/vision) to our API product pages so you can upload our APIs and try them out fast.

![Screenshot of Google Cloud Vision API](/images/vision_api.gif "Demo of the Google Cloud Vision API")

*We added this demo right to the Vision product page so that people could try out our model on their data with low lift.*

Leading a successful machine learning project often comes to being able to build prototypes fast. For this, I have a handful of go-to tools and architectures:

* **Add ML to Google Sheets**. *G Suite apps like Sheets, Docs, and Forms are easy to extend with JavaScript through the [Apps Script](https://developers.google.com/apps-script) framework. For example, you can build a text classification model that [runs every time](https://developers.google.com/gsuite/solutions/feedback-sentiment-analysis) you add a row in a Google Sheet. Or, you can [build a Google Form](https://developers.google.com/gsuite/solutions/feedback-sentiment-analysis) that lets you upload images, analyzes them with an ML model, and then writes the results to a Google Sheet.
* **The Google Cloud Storage + Cloud Functions Duo**. Most ML projects are data in, data out. You upload some input data--an image, video, audio recording, text snippet, etc--and a model runs predictions on it (“output data”). A great way to prototype this type of project is with [Cloud Storage](https://cloud.google.com/storage) and [Cloud Functions](https://cloud.google.com/functions). Cloud Storage is like a folder in the cloud: a spot for storing data in all formats. Cloud Functions are a tool for running blocks of code in the cloud without needing a devoted server. You can configure the two to work together by having a file that is uploaded to cloud storage “trigger” a cloud function to run.

  I used this setup recently when I built a document AI pipeline

![Document AI Pipeline](/images/pipeline.jpg "Document AI Pipeline")

When a document is uploaded to a cloud storage bucket, it triggers a cloud function that analyzes the document by type and moves it to a new bucket. That triggers a new cloud function, that uses the Natural Language API to analyze the document text. Check out the full code [here](https://github.com/dalequark/document-pipeline).

### Next Steps

Hopefully that’s convinced you getting started with machine learning doesn’t have to be painful. Here are some helpful tutorials and demos to get started with ML:

* [Software Developers: You're Learning Machine Learning Upside Down](https://daleonai.com/software-developers-youre-learning-machine-learning-upside-down)
* [Classifying congressional bills with machine learning](https://medium.com/@srobtweets/classifying-congressional-bills-with-machine-learning-d6d769d818fd)
* [Exploring the Cloud Vision API. Interested in Machine Learning but…](https://medium.com/@srobtweets/exploring-the-cloud-vision-api-1af9bcf080b8)
* [Making with ML YouTube Series (ft your humble author)](https://www.youtube.com/playlist?list=PLIivdWyY5sqLsaG5hNms0D9aZRBE7DHBb)
* [Cloud AI Adventures with Yufeng Guo](https://www.youtube.com/playlist?list=PLIivdWyY5sqJxnwJhe3etaK7utrBiPBQ2)
* [Introduction to TensorFlow for Artificial Intelligence, Machine Learning, and Deep Learning](https://www.coursera.org/learn/introduction-tensorflow)