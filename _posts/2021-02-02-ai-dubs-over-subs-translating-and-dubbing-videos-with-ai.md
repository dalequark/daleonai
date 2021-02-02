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
A monkey poking at a typewriter for eternity will eventually print all possible stories, and a person stuck in quarantine long enough will eventually attempt every possible solo human hobby. So I'd say it was inevitable that post baking/roller skating/sewing/sewing I would eventually become introduced to (and soon addicted to) Japanese cartoons.

If you are also a person who watches anime, 

The problem with watching anime is that, short of learning Japanese, you become dependent on human translators and voice actors to port the content to your language. Sometimes you get the subtitles (“subs”) but not the voicing (“dubs”). Other times, entire seasons of shows aren’t translated at all, and you’re left on the edge of your seat with only Wikipedia summaries and 90s web forums to ferry you through the darkness. 

So what are you supposed to do? The answer is obviously not to ask a computer to transcribe, translate, and voice-act entire episodes of a TV show from Japanese to English. Translation is a careful art that can’t be automated.

 A machine would never decide, of its own accord, to translate the onigiri rice balls [they eat in Pokémon](https://www.youtube.com/watch?v=48ztfailhnU) to “jelly donut.” Besides, even if you did use machine learning to translate a video, you couldn’t use a computer to voice act, I mean who would want to listen to machine voices for an entire season? It’d be awful. Only a real sicko would want that.

So in this post, I’ll show you how to use machine learning to transcribe, translate, and voice-act videos from one language to another, i.e. “AI-Powered Video Dubs.” It might not get you Netflix-quality results, but you can use it to localize online talks and YouTube videos in a pinch. We’ll start by transcribing audio to text using Google Cloud’s [Speech-to-Text API](https://cloud.google.com/speech-to-text). Next, we’ll translate that text with the [Translate API](https://cloud.google.com/translate). Finally, we’ll “voice act” the translations using the [Text-to-Speech API](https://cloud.google.com/text-to-speech), which produces voices that are, according to the docs, “humanlike.”

By the way, before you flame-blast me in the comments, dear reader, I should tell you that YouTube will [automatically and for free](https://support.google.com/youtube/answer/6373554#zippy=%2Cautomatic-captions-on-videos-on-demand) transcribe (and even translate?) your videos for you. So you can treat this project like your new hobby of baking sourdough from scratch: a really inefficient use of 30 hours.