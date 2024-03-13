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

A﻿nd it worked!

![Gemini summarizes a family video](/images/1996_model_summary.png "Family video play by play")

Mostly. All of these scenes are indeed clips from my video, and in the correct order. Gemini did miss a scene or two, which is why I packed my prompt with clarifiers like: "Make sure not to forget any scenes." Overall, I was impressed. The chances of me watching this hour-long video end-to-end were nil, so it was nice to have Gemini give me the highlight reel.

### A﻿I Gardener

If you're a developer, you may occasionally be overcome with crippling insecurity when tasked with doing anything in the physical world, i.e. meatspace. At least, this was how I felt when I moved into a new house that came with a lawn. I don't know the first thing about landscaping. Keeping living organisms alive? Not really my area of expertise. Gemini 1.5 to the rescue?

My next experiment was to take a phone recording of my lawn and ask Gemini 1.5 to tell me how to handle it:

![Gemini analyzes a landscaping video](/images/landscaping_prompt.png "Asking Gemini for help with landscaping")

Here's what Gemini 1.5 had to say. (I've added asterisks around the interesting bits.)

```markdown
The landscaping in the video features a variety of plants, including:

**St. Augustine grass: This is a warm-season grass that is popular in Texas. It is relatively low-maintenance, but it does need to be watered regularly and fertilized occasionally.**

**Agave**: This is a succulent plant that is native to Mexico and the southwestern United States. It is very drought-tolerant and does not need to be watered often.

**Yucca**: This is another succulent plant that is native to the southwestern United States. It is also very drought-tolerant and does not need to be watered often.

Dandelions: These are weeds that can be difficult to control. They can be removed by hand or with a herbicide.

Overall, the landscaping is in good condition. However, there are a few problems that I see:

Weeds: There are a few weeds growing in the grass and in the gravel. These can be removed by hand or with a herbicide.

Dead leaves: There are some dead leaves on the ground. These should be raked up and removed.

**Broken planter**: There is a broken planter in the yard. This should be removed and replaced.

Here are some specific tips on maintaining the landscaping:

Water the grass regularly: St. Augustine grass needs to be watered deeply and infrequently. Water it once or twice a week, depending on the weather.

Fertilize the grass occasionally: St. Augustine grass should be fertilized once or twice a year. Use a fertilizer that is specifically designed for St. Augustine grass.

Remove weeds: Weeds can be removed by hand or with a herbicide. Be sure to use a herbicide that is safe for St. Augustine grass.

Rake up dead leaves: Dead leaves should be raked up and removed. This will help to prevent the spread of disease.

Trim the agave and yucca: Agave and yucca should be trimmed occasionally to remove dead leaves.

In addition to the problems that I mentioned above, there are a few other things that you might want to consider:

Mulch: Mulch can help to retain moisture and suppress weeds. You might want to consider adding mulch to the gravel areas.

Edging: Edging can help to create a clean line between the grass and the gravel. You might want to consider adding edging to the landscaping.

Lighting: Lighting can help to highlight the landscaping and make it more inviting. You might want to consider adding lighting to the yard.
```



Though I'm no gardener, I'm pretty sure Gemini was on the money here. It correctly identified my agave, yucca, and the profusion of dandelions/weeds, as well as a broken planter the former resident left behind. I was particularly impressed/weirded out by this line: "St. Augustine grass: This is a warm-season grass that is popular in Texas." It would seem that Gemini figured out where I lived by identifying my grass? Weird! But... useful?

### Improving My Tennis Serve

My final experiment with video was another throwback to an AI project I'd built back in olden times: a program for using pose-tracking to analyze and [improve my tennis serve](https://youtu.be/yLrOy2Xedgk?si=yzYPsxG4f7aVzQ6h). Even in the era of generative AI, simple pose-tracking models are a useful and accurate technique for analyzing human motion. But because it was so easy, I decided to throw some clips of my tennis serve into Gemini 1.5 and see if it had any suggestions for improvement:

![Gemini analyzing a tennis serve](/images/screenshot-2024-03-05-at-11.38.40 am.png "Gemini 1.5 analyzes my tennis serves.")

Is Gemini being overly generous when it says, "Your serve looks good!"? Probably yes. But still, it was definitely on point about the fact that I can't toss the ball consistently. And no one ever once told me I need to improve my "leg drive."