---
layout: post
title: Build Your Own AI Moderator Bot for Discord with the Perspective API
description: Build a moderator bot that instantly flags toxic, insulting, flirtation,
  or spam messages with machine learning--no data science experience required.
date: 2020-06-30 05:00:00 +0000
feature_image: "/images/flag-toxic-flirty-or-spam-messages-instantly-with-an-ai-moderator-bot-for-discord-1.png"
tags:
- google cloud
- natural language processing
- machine learning
- chatbots

---
I’ve been fascinated by the topic of moderation--deciding who gets to post what on the internet--ever since I started working at the online dating site OkCupid, five years ago . The moderation team there was responsible for the [near-impossible task](https://www.thecut.com/2017/02/banned-from-okcupid-sexting-moderation.html) of drawing the line between which messages counted as riské flirtation (usually ok), ilicit come-ons (possibly ok), and sexual harassment (which would get you banned). As RadioLab put it in their [excellent podcast episode](https://www.wnycstudios.org/podcasts/radiolab/articles/post-no-evil) on the topic, “How much butt is too much butt?” Questions like these are tough enough, and then, if you’re Twitter, you have to decide what to do when the President’s tweets [violate your Terms of Service](https://www.nytimes.com/2020/06/05/technology/twitter-trump-facebook-moderation.html).

It’s a dirty job, but someone’s got to do it. Or do they? Can an AI handle moderation instead?

Some policy questions, like what to do with the President’s tweets or how to define hate speech, have no right answer. But in many more instances, and for many more platforms, bad content is easy to spot. You probably can’t share any sort of nudity or gore or hate speech on a professional networking app or an educational site for children. Plus, since most apps aren’t public forums like Facebook or Twitter (where we have strong expectations of free speech), the consequences of being too harsh or conservative in filtering risky content are lower. For these applications, machine learning can really help.