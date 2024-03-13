---
layout: post
title: "Big Context Windows Are a Big Deal: Experiments with Gemini 1.5's 1
  million token context window"
date: 2024-03-13T20:54:51.292Z
description: LLMs with huge context windows are here. What opportunities do they unlock?
feature_image: /images/big_context_feature.jpeg
thumbnail_image: /images/big_context_feature_thumb.jpg
tags:
  - ai
  - genai
  - llm
  - ml
permalink: bigcontextwindows
---
Last week, I got my hands on Google's newest generative model: Gemini 1.5, a multi-modal behemoth that can consume up to an hour of video, 11 hours of audio, 30,000 lines of code, or 700,000 words. That's a big leap forward in terms of context length: Gemini accepts 5x times more input than its beefiest predecessor, Claude 2.1.

I've been excitedly anticipating the era of long context windows for a while, not just because they enable generative models to solve entirely new kinds of problems, but also because they just might just transform the way we develop with LLMs. But I'm getting ahead of myself. First, let me share with you some of my favorite Gemini 1.5 experiments.



## P﻿rompting with Video

### AI Family Video Archive 2.0

Back in the stone ages, i.e. 2020, I devoted a month of my life building an [AI-powered family video archive](https://www.youtube.com/watch?si=TC6gJuC1VcaBvFN5&v=_IeS1m8r6SY&feature=youtu.be). The idea was to use machine learning (image recognition, speech-to-text, embeddings, etc) to create what was essentially Google Search but for my personal family video archive. It worked, but there was a flaw between chair and keyboard: I didn't know what to search for. So many hours of video, from so long ago! What precious family moments had I entirely forgotten about, or was too young to form memories of in the first place?

Enter Gemini 1.5. One of the very first thing I uploaded to this bad boy was a one-hour family video from 1996. Unlike my original AI archive that took a month to build, this experiment took only a few minutes to set up, and most of that time was spent downloading and converting the video into the right format. I uploaded my family video to Google Drive, inserted it into the prompt, then added the instruction text:

```markdown
Summarize this family video. Create a bulleted list with a brief 
description summarizing every scene. Make sure not to forget any scenes, 
and pay careful attention to make sure you're very accurate.
```



![Prompting Gemini with a family video](/images/1996_video_prompt.png "Summarizing an hour-long family video from 1996")