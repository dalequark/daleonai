---
layout: post
title: Convert PDFs to Audiobooks with Machine Learning
description: Use easy-to-use Machine Learning/AI tools to convert PDFs into audiobooks.
date: 2020-09-01 21:00:00 +0000
feature_image: "/images/turn-a-pdf-into-an-audiobook.png"
tags:
- google cloud
- nlp
- machine learning
permalink: pdf-to-audiobook

---
_Ever wish you could listen to documents? In this post, we'll use machine learning to transform PDFs into audiobooks._

<!--more-->

_This project was done with_ [_Kaz Sato_](https://github.com/kazunori279)_._

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

As you can see, the model was quite accurate (\~95% precision and recall)! So Kaz used this model as an intermediary step to identify which text to put in the audiobook.

### Finding Relevant Text with Spit and Glue and Font Sizes

Look, I'm no sissy--I've spent a lot of my life labeling training data (even though, these days, you [really don't have to](https://cloud.google.com/ai-platform/data-labeling/docs)). But for this project, I wondered if I could use a simple heuristic (one that would let me avoid labeling data) instead.

I figured you could learn a lot just by looking at font size. For example: the title of a paper is probably written in the largest text size. Meanwhile, body text is the most common text in a document. Using those observations, I used this heuristic:

1. Calculate the font size for all words
2. Compute the most common font size. Label ever bit of text in that font size "body"
3. Compute the largest font size. Label every bit of text in that font size as "title"

For the first step, computing font size, I subtracted the y coordinates around words:

![Computing font sizes from y coordinates](/images/img_20200901_161455.jpg "Computing font sizes from y coordinates")

Next, to see if my idea would work, I plotted the distribution of font sizes in the document:

![](/images/font_sizes.jpg)

You can see that on the right hand side, there's a single dot (the largest text) that represents the document title (woohoo!). Meanwhile, that long span of points in the middle, that's the body text. The captions and other document metadata, which is in even smaller text, is all the way on the left side of the diagram.

This graph gave me confidence that my little hack would work, at least for this document (note that it didn't work for _all_ research papers, especially not papers with fancy side bars or vertical layouts!).

One tricky bit here, though, is that the body text font size falls in a _range_ (not one fixed value). That's because I'm not computing font size like we usually think of it (i.e. 12 pt), but as subtracted pixel values, and there's some noise. To figure out the cutoffs (i.e. what should be the bounds for what's considered body text?), I used [Jenks Natural Breaks Algorithm]() (if you haven't heard of this one, no fear--neither had I before this project!).

I know I'm being a little quick here, so feel free to drop me comments below here or on Twitter and I'll definitely answer questions!

### From Text to Spoken Word

The most fun part of this project is definitely choosing a computer voice to be our narrator. For this, I used the Google Text-to-Speech API, which uses a technology called [WaveNet](https://deepmind.com/blog/article/wavenet-generative-model-raw-audio) to produce very lifelike voices. The API supports lots of voices and languages, and you can compare them for yourself on your own input text straight from the [product page](https://cloud.google.com/text-to-speech).

I choose a male voice to read the paper title and a female voice to read the paper body. Here's what the resulting "audiobook" sounded like:

<iframe width="100%" height="300" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/881952937%3Fsecret_token%3Ds-AwsVa7iQ7Gm&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"></iframe><div style="font-size: 10px; color: #cccccc;line-break: anywhere;word-break: normal;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; font-family: Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif;font-weight: 100;"><a href="https://soundcloud.com/dale-markowitz" title="Dale Markowitz" target="_blank" style="color: #cccccc; text-decoration: none;">Dale Markowitz</a> · <a href="https://soundcloud.com/dale-markowitz/a-promising-path-towards-autoformalization-and-general-artificial-intelligence/s-AwsVa7iQ7Gm" title="A Promising Path Towards Autoformalization and General Artificial Intelligence" target="_blank" style="color: #cccccc; text-decoration: none;">A Promising Path Towards Autoformalization and General Artificial Intelligence</a></div>

Not too bad, right?

Anyway, that's all for now.

***

If you build something neat like this, share it with me and I'll feature it on social media!

Meanwhile, let's connect on [Instagram](instagram.com/dale_on_ai) or [Twitter](twitter.com/dalequark)!