---
layout: post
title: Convert PDFs to Audiobooks with Machine Learning
description: Use easy-to-use Machine Learning/AI tools to convert PDFs into audiobooks.
date: 
feature_image: ''
tags: []

---
_Ever wish you could listen to documents? In this post, we'll use machine learning to transform PDFs into audiobooks._

<!--more-->

Walking--it's one of covid-19's greatest (and only) pleasures, isn't it? These days, you can do anything on foot: listen to the news, take meetings, even write notes (with voice dictation). The only thing you can't do while walking is read machine learning research papers.

Or can't you?

In this post, I'll show you how to use machine learning to transform documents in PDF or image format into audiobooks, using computer vision and text-to-speech. That way, you can read research papers on the go. 

But should you? That's for you to decide.

***

But first: Credit to [Kaz Sato](https://github.com/kazunori279), a Google engineer based in Japan who originally created this project (he was creating Japanese audiobooks from Computer Science textbooks). I took borrowed architecture with a few little tweaks.

We’ll build our PDF-to-audiobook converter in three main steps:

1. Extract text from PDFs (or images)
2. Decide which parts of the text to include in the audiobook
3. Convert the text into spoken words

In this post, I'll show you how to convert [this dense research paper](http://link-springer-com-443.webvpn.fjmu.edu.cn/content/pdf/10.1007%2F978-3-030-53518-6_1.pdf "Link to conference paper") (“A Promising Path Towards Autoformalization and General Artificial Intelligence”) into an audiobook. Here’s what it looks like:

![Picture of the first page of the research paper](/images/screen-shot-2020-08-31-at-5-00-40-pm.png "Picture of the first page of the research paper")

## From PDFs to Text

First, we’ll extract the text from the document using OCR. You could use lots of different types of tools to do this, like:

* [Calamari](https://github.com/Calamari-OCR/calamari), on open-source Python library
* The Google Cloud [Vision AI API](https://cloud.google.com/vision/docs)
* The (new!) Google Cloud [Document AI API](https://cloud.google.com/solutions/document-ai). This API extracts not only text but also intelligently parses tables and forms

For this project, I used the Vision API (which is cheaper than the new Document AI API), and found the quality to be pretty good.

When you pass a document through the Vision API, you’re returned both raw text as well as layout information: for each letter, what was its (x,y) position on the page?