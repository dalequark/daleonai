---
layout: post
title: Convert PDFs to Audiobooks with Machine Learning
description: Use easy-to-use Machine Learning/AI tools to convert PDFs into audiobooks.
date: 
feature_image: ''
tags: []
permalink: pdf-to-audiobook

---
_Ever wish you could listen to documents? In this post, we'll use machine learning to transform PDFs into audiobooks._

<!--more-->

Walking--it's one of covid-19's greatest (and only) pleasures, isn't it? These days, you can do anything on foot: listen to the news, take meetings, even write notes (with voice dictation). The only thing you can't do while walking is read machine learning research papers.

Or can't you?

In this post, I'll show you how to use machine learning to transform documents in PDF or image format into audiobooks, using computer vision and text-to-speech. That way, you can read research papers on the go.

But should you? That's for you to decide.

_Want to jump straight to the code? Check it out on GitHub_ [_here_](https://github.com/kazunori279/pdf2audiobook)_._

***

But first: Credit to [Kaz Sato](https://github.com/kazunori279), a Google engineer based in Japan who originally created this [project](https://github.com/kazunori279/pdf2audiobook) (he was creating Japanese audiobooks from Computer Science textbooks). I took borrowed architecture with a few little tweaks.

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

For this project, I used the Vision API (which is cheaper than the new Document AI API), and found the quality to be quite good. Check out [Kaz's GitHub repo](https://github.com/kazunori279/pdf2audiobook) to see exactly how you call the API.

When you pass a document through the Vision API, you’re returned both raw text as well as layout information. Here's what the response looks like:

![](/images/vision_api_text.gif)

As you can see, the API returns not just the raw text on the page, but also each character's (x, y) position.

At this point, you could take all that raw text and dump it straight into an audiobook, if you're a doofus. But you're not a doofus, and you probably don't want to do that, because then you'd be listening to all sorts of uninteresting artifacts like image captions, page numbers, document footers, and so on.

So in the next step, we'll decide which bits of raw text should be included in the audiobook.

## Finding Relevant Text in PDFs

What part of a research paper do we want to include in an audiobook? Probably the paper's title, the author's name, section headers, body text, but none of these bits highlighted in red:

![Document highlighting sections not to include in the audiobook.](/images/szegedy2020_chapter_apromisingpathtowardsautoforma.png "Document highlighting sections not to include in the audiobook.")

It turns out identifying those relevant sections is a tricky problem with lots of possible solutions. In this post, I'll show you two approaches, one that's quick 'n dirty and one that's high-quality but a bit more work.

### Finding Relevant Text with Machine Learning

When you look at a research paper, it's probably easy for you to gloss over the irrelevant bits just by noting the layout: titles are large and bolded; captions are small; body text is medium-sized and centered on the page.

Using spatial information about the layout of the text on the page, we can train a machine learning model to do that, too. We show the model a bunch of examples of body text, header text, and so on, and hopefully it learns to recognize them.

This is the approach that Kaz, the original author of this project, took when trying to turn textbooks into audiobooks.

Earlier in this post, I mentioned that the Google Cloud Vision API returns not just text on the page, but also its layout. It groups text into chunks (pages, blocks, paragraphs, words, and characters) and returns its location on the page. In particular, for each word, it returns a bounding box that looks like this:

     "boundingBox": {
    
       "normalizedVertices": [
    		{"x": 0.9248292,"y": 0.06006006},
     		{"x": 0.9384966,"y": 0.06006006},
            {"x": 0.9384966,"y": 0.067567565},
            {"x": 0.9248292,"y": 0.067567565}
        ]
    
    }

_The bounding box above describes where a word is located on the page, and how large it is_.

We can use this data to train a model. Let's take a look at the data that Kaz collected below:

![](/images/screen-shot-2020-09-01-at-2-45-07-pm.png)

The book Kaz was converting was, obviously, in Japanese. For each chunk of text, he created a set of features to describe it: how many characters were in the chunk of text? How large was it, and where was it located on the page? What was the aspect ratio of the box enclosing the text (a narrow box, for example, might just be a side bar)? 

Notice there's also a column named "label" in that spreadsheet above. That's because, in order to train a machine learning model, we need a labeled training dataset from which the model can "learn." For each block of text in the training data, Kaz had to manually label the chunk as "body," "header," "caption," or "other." Labeling training data is always one of the more time-consuming parts of ML projects, and this one was no exception!

That's why, when I recreated Kaz's project, I used a hack to avoid it (more on that below).

After Kaz collected and labeled a bunch of documents, he trained a machine learning model using [Google Cloud AutoML Tables](https://cloud.google.com/automl-tables). It's a no-code tool for building models based on tabular data. Here's a little gif showing what that tool looks like, and how Kaz used it to train a model:

![Gif of AutoML Tables interface](/images/automl_tables_kaz.gif "Gif of AutoML Tables interface")