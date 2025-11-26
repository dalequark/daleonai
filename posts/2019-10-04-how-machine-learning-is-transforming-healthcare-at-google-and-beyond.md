---
layout: post
title: How Machine Learning is Transforming Healthcare at Google and Beyond
description: Google and others are recruiting algorithms to spot cancer in medical
  scans, predict the outcome of hospital visits, and more. Here’s how.
date: 2019-10-04
feature_image: "/images/2019-10-04-how-machine-learning-is-transforming-healthcare-at-google-and-beyond/0.png"
tags:
- healthcare
- computer vision
- machine learning

---
_Google and others are recruiting algorithms to spot cancer in medical scans, predict the outcome of hospital visits, and more. Here’s how._

<!--more-->

Machine Learning — the art of using patterns in data to make predictions — stands to transform almost every industry, from finance, retail, and marketing to digital assistants and self-driving cars. But when it comes to how machine learning (ML) might benefit humanity, there’s almost no field more promising than healthcare.

Hardly a month passes when we don’t hear about a new disease that machine learning models have learned to tag faster and more accurately than trained clinicians. ML is being used to help doctors spot tumors in medical scans, speed up data entry, and respond automatically to hospital patients’ needs.

These ML-powered breakthroughs come at a crucial time, as the shortage of doctors and specialists in the US and worldwide [continues to grow](https://www.aamc.org/news-insights/press-releases/new-findings-confirm-predictions-physician-shortage). As our demand for doctors surpasses supply, we may well find ourselves depending on technology to help fill in the gaps.

In this post, we’ll cover some of the ways Google and others are applying Machine Learning to healthcare. Let’s get started.

Learning to See Diseases in Medical Images
==========================================

Over the past ~5 years, machine learning has become incredibly good at analyzing images, largely thanks to a type of model called a “[neural network](http://news.mit.edu/2017/explained-neural-networks-deep-learning-0414).” Neural networks are especially good at understanding unstructured data, like photos, chunks of text, clips of audio — stuff that’s not simple rows of numbers in a spreadsheet (though they’re good at analyzing that kind of data too!).

Neural networks power tools that recognize faces and pets in photos, that convert handwriting into text, that create fluid translations, that let you search photos by keyword in the Google Photos app, and more.

{% include "image_caption.html" imageurl: "/images/2019-10-04-how-machine-learning-is-transforming-healthcare-at-google-and-beyond/1.png" title: "Neural nets let you search your pictures by keyword in the Google Photos app. Here are all my breakfast pics." caption: "Neural nets let you search your pictures by keyword in the Google Photos app. Here are all my breakfast pics." %}



To create a vision model like this yourself, you’d need a large _labeled_ dataset of images — a couple hundred or thousand pictures of dogs and cats labeled “dog” and “cat” — which you’d use to “train” a model to recognize these tags on its own.

Using this very same technique, researchers have been able to train neural nets to spot diseases in medical scans, sometimes better than trained professionals.

Just last month, researchers at Google [trained a neural net](https://arxiv.org/abs/1909.05382) to detect 26 different types of skin conditions, like melanoma, psoriasis, eczema, cysts, and more. The model, which used a combination of photos and patient history, was as accurate as dermatologists and more accurate than general practitioners without skin-specialized training.

This is only the most recent of tons of studies that have almost the same storyline. We’ve been able to [spot metastatic breast cancer](https://ai.googleblog.com/2017/03/assisting-pathologists-in-detecting.html), [predict whether or not prostate cancer will become aggressive](https://ai.googleblog.com/2018/11/improved-grading-of-prostate-cancer.html), and detect [diabetic retinopathy](https://ai.googleblog.com/2018/12/improving-effectiveness-of-diabetic.html) (the fastest growing cause of blindness) from scans of the back of the eye.

{% include "image_caption.html" imageurl: "/images/2019-10-04-how-machine-learning-is-transforming-healthcare-at-google-and-beyond/2.png" title: "Predicting lung cancer from CT scans. Credit: [https://www.blog.google/technology/health/lung-cancer-prediction/](https://www.blog.google/technology/health/lung-cancer-prediction/)" caption: "Predicting lung cancer from CT scans. Credit: [https://www.blog.google/technology/health/lung-cancer-prediction/](https://www.blog.google/technology/health/lung-cancer-prediction/)" %}



Just this May, researchers [trained a model](https://www.blog.google/technology/health/lung-cancer-prediction/) that could predict the malignancy of lung cancer from CT scans with accuracy that was on-par or better than board-certified radiologists. The work stands to be especially impactful, since not only is lung cancer the deadliest cancer but it’s also one of the hardest for radiologists to spot.

These models might not replace doctors any time soon, but it may not be long before they act as aids, alerting doctors to the most tricky or subtle diagnoses.

Medical Models that Explain Themselves
--------------------------------------

To be truly helpful aids, though, medical imaging models will need not only to spot the presence of diseases but also to explain their decision making processes. This way, if a doctor disagrees with a model’s prediction, she’ll at least know why the model said what it did.

For this reason, researchers will often build models that not only make predictions about the _presence_ of disease, but that will also visually highlight the regions of scans (heat maps) that contribute to those predictions.

{% include "image_caption.html" imageurl: "/images/2019-10-04-how-machine-learning-is-transforming-healthcare-at-google-and-beyond/3.jpg" title: "Ophthalmologists were better at detecting DR when aided by deep learning models and their associated decision heat maps, like the one above. Source: [https://www.aaojournal.org/article/S0161-6420(18)31575-6/fulltext](https://www.aaojournal.org/article/S0161-6420(18)31575-6/fulltext)" caption: "Ophthalmologists were better at detecting DR when aided by deep learning models and their associated decision heat maps, like the one above. Source: [https://www.aaojournal.org/article/S0161-6420(18)31575-6/fulltext](https://www.aaojournal.org/article/S0161-6420(18)31575-6/fulltext)" %}



The model above, trained to identify the presence of Diabetic Retinopathy (DR, the fastest growing cause of blindness globally), highlights which parts of a retinal scan most contributed to its decision (DR or no DR). Ophthalmologists were better at detecting diabetic retinopathy when they got to see these heat maps.

Wrangling the Medical Data Firehose
===================================

ML works best when it’s got a nice, neat dataset to work with (like a stack of labeled x-rays). But lots of clinical data is diffuse, scattered through the ether as handwritten forms, prescriptions, notes jotted down in chicken scratch, vitals stored in a database whose format is completely incompatible with anyone else’s.

Maybe “data wrangling” doesn’t sound as exciting as spotting tumors in CT scan, but much of ML’s role in healthcare has been to help capture, organize, and triage data.

Just as neural networks can be trained to spot diseases in images, so too can they be trained to parse documents and forms. For example, we might use models to analyze medical intake forms, converting handwriting to text and organizing that text semantically so that it can be stored in a database.¹

{% include "image_caption.html" imageurl: "/images/2019-10-04-how-machine-learning-is-transforming-healthcare-at-google-and-beyond/4.png" title: "Using a ML Vision model, you could extract handwriting to text. Then you could use an ML technique called “Entity Extraction” to understand words in a document and their semantic relationship to each other." caption: "Using a ML Vision model, you could extract handwriting to text. Then you could use an ML technique called “Entity Extraction” to understand words in a document and their semantic relationship to each other." %}



The easier we make data to work with, the easier it is for us to build powerful ML models. To this end, Google’s invested significant resources in building tools that [make healthcare data easier to store](http://cloud.google.com/healthcare) and analyze as well as helping develop the Fast Healthcare Interoperability Resources protocol([FHIR](https://ai.googleblog.com/2018/03/making-healthcare-data-work-better-with.html)), which makes healthcare data more interoperable and easier to build software for.

Thanks to these data wrangling tools, we’re able to train models we never could before. Last year, for example, [researchers](https://ai.googleblog.com/2018/05/deep-learning-for-electronic-health.html) were able to construct detailed timelines of hospital patients’ visits using FHIR data:

{% include "image_caption.html" imageurl: "/images/2019-10-04-how-machine-learning-is-transforming-healthcare-at-google-and-beyond/5" title: "Credit: [https://ai.googleblog.com/2018/05/deep-learning-for-electronic-health.html](https://ai.googleblog.com/2018/05/deep-learning-for-electronic-health.html)" caption: "Credit: [https://ai.googleblog.com/2018/05/deep-learning-for-electronic-health.html](https://ai.googleblog.com/2018/05/deep-learning-for-electronic-health.html)" %}



With data like a patient’s vital signs, doctors’ notes, lab tests, and more organized in a timeline, researchers could train powerful neural network models to predict the outcomes of hospital visits. Using these timelines, they could predict the length of a patient’s stay, whether or not they would die, and (if they didn’t), what medical code they’d be discharged with.

The more organized we can make medical data, the more powerful and accurate we can build medical models.

Learning to Listen Like a Doctor
================================

Just as it takes work to organize data, so too does it take time to collect that data in the first place. Imagine a typical visit to the GP’s office:

Your doctor asks what’s wrong. You reply you’ve got chills, fatigue, endless gobs of phlegm at the back of your throat. Maybe your doctor is scribbling down what you’re saying on a notepad or iPad, or maybe she’s got an assistant or “scribe” take notes on her behalf. Either way, this process is time-consuming and lossy.

What if someone else (or something else) could listen in and help out? What if that person were Alexa? Or Siri? Or the Google Assistant?

Actually, voice assistants are _already_ deployed in medical centers and hospitals, helping with tasks like [routing patients’ requests to staff](https://techcrunch.com/2019/02/25/cedars-sinai-puts-amazon-alexa-in-patient-rooms-as-part-of-a-pilot-program/) or [providing nurses with administrative info](https://hbr.org/2018/03/what-will-health-care-look-like-once-smart-speakers-are-everywhere).

It’s clear medical voice bots are a domain big tech companies care about: [Amazon recently announced a program](https://techcrunch.com/2019/04/04/amazon-alexa-launches-its-first-hipaa-compliant-medical-skills/) to make it easier for developers to build HIPPA-compliant health voice apps for Alexa. Meanwhile, Google’s spent lots of time studying [better ways to transcribe medical conversations](https://arxiv.org/pdf/1711.07274.pdf) and [exploring what’s possible with those transcripts once we’ve got them](https://jamanetwork.com/journals/jamainternalmedicine/fullarticle/2728955), like automatically charting symptoms patients describe during a doctor’s visit.

So it may not be long before the Google Assistant can do more for you than set your alarm and tell you the weather.

* * *

We’ve talked about lots of ways machine learning is making waves in healthcare, but so far we’ve only scratched the surface of what’s possible. So make sure to keep tabs on this new intersection of fields.

Thanks for reading! Happy to answer any questions or comments below.

* * *

[1] If you want to play around with a cool tool that can let you build a model like this yourself, check out Google’s [Document Understanding AI](https://cloud.google.com/solutions/document-ai/).