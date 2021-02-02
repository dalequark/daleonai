---
layout: post
title: AI Dubs Over Subs? Translating and Dubbing Videos with AI
date: 2021-02-02T20:49:32.304Z
description: Use AI-powered translation and text-to-speech to automatically
  translate and "dub" any video.
feature_image: /images/404.jpg
thumbnail_image: /images/404.jpg
tags:
  - nlp
permalink: translate-dub-videos-with-ml
---
A monkey poking at a typewriter for eternity will eventually print all known writing of man, and a person stuck in quarantine long enough will eventually attempt every possible solo human hobby. It was inevitable that post baking/roller skating/sewing/furniture refinishing, I would eventually become introduced to (and shortly after addicted to) Japanese cartoons.

The problem with watching anime is that, short of learning Japanese, you become dependent on human translators and voice actors to port the content to your language. Sometimes you get the subtitles (“subs”) but not the voicing (“dubs”). Other times, entire seasons of shows aren’t translated at all, and you’re left on the edge of your seat with only Wikipedia summaries and 90s web forums to ferry you through the darkness. 

So what are you supposed to do? The answer is obviously not to ask a computer to transcribe, translate, and voice-act entire episodes of a TV show from Japanese to English. Translation is a careful art that can’t be automated. 

A machine would never decide, of its own accord, to translate the onigiri rice balls [they eat in Pokémon](https://www.youtube.com/watch?v=48ztfailhnU) to “jelly donut.” Besides, even if you did use machine learning to translate a video, you couldn’t use a computer to voice act, I mean who would want to listen to machine voices for an entire season? It’d be awful. Only a real sicko would want that.

So in this post, I’ll show you how to use machine learning to transcribe, translate, and voice-act videos from one language to another, i.e. “AI-Powered Video Dubs.” It might not get you Netflix-quality results, but you can use it to localize online talks and YouTube videos in a pinch. We’ll start by transcribing audio to text using Google Cloud’s [Speech-to-Text API](https://cloud.google.com/speech-to-text). Next, we’ll translate that text with the [Translate API](https://cloud.google.com/translate). Finally, we’ll “voice act” the translations using the [Text-to-Speech API](https://cloud.google.com/text-to-speech), which produces voices that are, according to the docs, “humanlike.”

(By the way, before you flame-blast me in the comments, dear reader, I should tell you that YouTube will [automatically and for free](https://support.google.com/youtube/answer/6373554#zippy=%2Cautomatic-captions-on-videos-on-demand) transcribe (and even translate?) your videos for you. So you can treat this project like your new hobby of baking sourdough from scratch: a really inefficient use of 30 hours.)

## AI-Dubbed Video: Do they axe usually sound grood? 

Let’s get down to brass tax: what quality can we expect to achieve from an ML-video-dubbing pipeline? 

Take a look at this video dubbed automatically from English to Spanish (the subtitles are also automatically generated, in English):

<iframe width="560" height="315" src="https://www.youtube.com/embed/cURHKESgNaI" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

What makes this project trickier (read: more fun) than most is that there are (at least) three possible points of failure:

1. The video can be incorrectly transcribed from audio to text by the Speech-to-Text API
2. That text can be incorrectly or awkwardly translated by the Translation API
3. Those translations can be mispronounced by the Text-to-Speech API

In my experience, the most successful dubbed videos were those that featured a single speaker over a clear audio stream and that were dubbed from English to another language. This is largely because the quality of transcription (Speech-to-Text) was much higher in English than other source languages. To get a sense for transcription quality, take a look at this video that was dubbed from English to English (i.e. not translated at all):

// English to English dub

It’s not perfect, but you get the gist of what’s going on.

Now, how good are the translations? For video dubbing, this question is hard to answer. On one hand, for regular text, I’ve found the quality of the [Google Cloud Translation API](http://cloud.google.com/translate) to be quite high. However, translating audio from videos for the purpose of dubbing is tricky business, because you have to ensure the translated text aligns, time-wise, with the video. Depending on how you implement this logic, you can end up with some lower-than-ideal quality translations. Here’s one particularly unimpressive dub from Japanese to English of one of my favorite shows, Death Note:

// Death note clip

Like I said before, I had better results going from English to other languages:

// Spanish example

More details on this tricky problem below.

As for the quality of Text-to-Speech computer voices, I’ll let you decide--would you listen to 20 minutes of video spoken by a bot?

## Building an AI Translating Dubber

As always, you can find all of the code for this project in the [Making with Machine Learning Github repo](https://github.com/google/making_with_ml/tree/master/ai_dubs). To run the code yourself, follow the README to configure your credentials and enable APIs. Here in this post, I’ll just walk through my findings at a high level.

I’ll be straight with you and admit that when I first set out to build this dubber, I thought it would be a real cake walk--just plugging three APIs together, what could be easier? I had so much hubris that I even recorded an entire video talking about my dubber without having written a single line of code. But all hubris must be punished, and boy, was I punished.

The challenge comes from having to align computer-generated translations and dubs with video. Here’s an overview of the steps:

1. Extract audio from video files using PyDub
2. Convert audio to text using the Speech-to-Text API
3. Split transcribed text into sentences/segments for translation
4. Translate text
5. Generate spoken audio versions of the translated text
6. Speed up the generated audio to align with the original speaker in the video
7. Stitch the new audio on top of the fold audio/video

Speech-to-Text

To extract audio from video files, I used the handy Python library [PyDub](https://github.com/jiaaro/pydub).

Let’s start with the Speech-to-Text API. To use this tool, we first take a video, extract the audio from it as a wav file, upload that audio to a Google Cloud bucket, and then call the API with a pointer to that file. It’s not the simplest API usage pattern in the world, but it works. To extract the audio from the video, I used the handy Python library [PyDub](https://github.com/jiaaro/pydub).

The Speech-to-Text API has some interesting configuration options that are worth talking about: