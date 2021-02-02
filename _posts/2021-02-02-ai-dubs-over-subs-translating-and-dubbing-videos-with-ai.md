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

## AI-Dubbed Videos: Do they axe usually sound grood? 

Before you embark on this journey, you probably want to know what you have to look forward to. What quality can we realistically expect to achieve from an ML-video-dubbing pipeline? 

Here's one example dubbed automatically from English to Spanish (the subtitles are also automatically generated in English). I haven't done any tuning or adjusting on it:

<iframe width="560" height="315" src="https://www.youtube.com/embed/cURHKESgNaI" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

As you can see, the transcriptions are decent but not perfect, and the same for translations. (Ignore the fact that the speaker sometimes speaks too fast--more on that later.) Overall. you can easily get the gist of what's going on from this dubbed video, but it's exactly near human-quality.

What makes this project trickier (read: more fun) than most is that there are at least three possible points of failure:

1. The video can be incorrectly transcribed from audio to text by the Speech-to-Text API
2. That text can be incorrectly or awkwardly translated by the Translation API
3. Those translations can be mispronounced by the Text-to-Speech API

In my experience, the most successful dubbed videos were those that featured a single speaker over a clear audio stream and that were dubbed from English to another language. This is largely because the quality of transcription (Speech-to-Text) was much higher in English than other source languages.

Dubbing from non-English languages proved substantially more challenging. Here’s one particularly unimpressive dub from Japanese to English of one of my favorite shows, Death Note:

<iframe width="560" height="315" src="https://www.youtube.com/embed/gWNRfeEHmp4" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

If you want to leave translation/dubbing to humans, well--I can't blame you. But if not, read on!

## Building an AI Translating Dubber

As always, you can find all of the code for this project in the [Making with Machine Learning Github repo](https://github.com/google/making_with_ml/tree/master/ai_dubs). To run the code yourself, follow the README to configure your credentials and enable APIs. Here in this post, I’ll just walk through my findings at a high level.

First, here are the steps we'll follow:

1. Extract audio from video files
2. Convert audio to text using the Speech-to-Text API
3. **Split transcribed text into sentences/segments for translation**
4. Translate text
5. Generate spoken audio versions of the translated text
6. **Speed up the generated audio to align with the original speaker in the video**
7. Stitch the new audio on top of the fold audio/video

I admit that when I first set out to build this dubber, I was full of hubris--all I had to do was plug a few APIs together, what could be easier? But as a programmer, all hubris must be punished, and boy, was I punished.

The challenging bits are the ones I bolded above, that mainly come from having to align translations with video. But more on that in a bit.

## Using the Google Cloud Speech-to-Text API

The first step in translating a video is transcribing its audio to words. To do this, I used Google Cloud's [Speech-to-Text API](?utm_source=blog&utm_medium=partner&utm_campaign=CDR_dal_aiml_ai-dubs_020221). This tool can recognize text spoken in 125 languages, but as I mentioned above, the quality is highest in English. For our use case, we'll want to enable a couple of special features, like:

\- [Enhanced models](cloud.google.com/speech-to-text?utm_source=blog&utm_medium=partner&utm_campaign=CDR_dal_aiml_ai-dubs_020221). These are Speech-to-Text models that have been trained on specific data types ("video," "phone_call") and are usually higher-quality. We'll use the "video" model, of course.

\- Profanity filters. This flag prevents the API from returning any naughty words.

\- Word time offsets. This flag tells the API that we want transcribed words returned along with the times that the speaker said them. We'll use these timestamps to help align our subtitles and dubs with the source video.

To enable these options, you'll the Speech-to-Text API with this configuration (in Python):

`config = speech.RecognitionConfig(`

`language_code="en-US"`

`enable_automatic_punctuation=True,`

`enable_word_time_offsets=True,`

`speech_contexts=[{"phrases": ["Dale", "Machine Learning"], "boost": 15}],`

`profanity_filter=True,`

`use_enhanced="video",`

`model="video")`

To extract audio from video files, I used the handy Python library [PyDub](https://github.com/jiaaro/pydub).

Let’s start with the Speech-to-Text API. To use this tool, we first take a video, extract the audio from it as a wav file, upload that audio to a Google Cloud bucket, and then call the API with a pointer to that file. It’s not the simplest API usage pattern in the world, but it works. To extract the audio from the video, I used the handy Python library [PyDub](https://github.com/jiaaro/pydub).

The Speech-to-Text API has some interesting configuration options that are worth talking about: