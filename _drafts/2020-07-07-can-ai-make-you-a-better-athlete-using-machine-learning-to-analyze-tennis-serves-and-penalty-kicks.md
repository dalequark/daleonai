---
layout: post
title: Can AI Make You a Better Athlete? Using Machine Learning to Analyze Tennis
  Serves and Penalty Kicks
description: In this post, well use Machine Learning to analyze key features athletes
  need to know, like their posture, angles of their bodies, and the speed or power
  of their throws.
date: 2020-07-07 05:00:00 +0000
feature_image: ''
tags:
- machine learning
- automl
- video intelligence
- computer vision
- google cloud
permalink: machine-learning-for-sports

---
_I'll show you how to use machine learning to analyze your performance in your sport of choice (mine's Tennis!)._

<!--more-->

Ah, _sportsball_. Can you ever forget the first time you grab that pass, fly down the court, and sink that puck right through the net as your fans yell adoringly from the bleachers, _TOUCHDOWN!_

No? Not ringing a bell? Me neither. That's what you get when you spend your high school years learning calculus and icing pi on cookie cakes instead of doing sports.

![Pi on a cookie cake](/images/pi_cookie.jpg "Pi on a cookie cake")

_How many friends do you think this made me?_

It's time you never get back. Unless, of course, you figure out a way use that high school math to become a better athlete.

Which is what we'll be looking at today! In this post, I'll show you how to use Machine Learning to analyze your performance in your sport of choice (as an example, I'll be using my tennis serve, but you can easily adopt the technique to other games).

Already, machine learning plays a role in sports: companies [use it to](https://www.nytimes.com/2020/04/08/technology/ai-sports-athletes-machine-learning.html) identify players’ unique talents, detect injuries earlier, and broker optimal player trades. Plus, almost every professional sport (NFL, NHL, MLB, NBA, soccer, golf, cricket, to name a few) uses ML technology for tracking. The NBA, for example, has deployed a sophisticated vision-based system all on courts, tracking players’ motions, reading numbers off their jerseys, analyzing how fast they pass the ball, and determining how accurately they shoot under pressure.

But as a beginner, I'd love to use that same technology simply to tell me what I'm doing wrong and where I'm making mistakes. Ideally, I'd build an app that I set up on a tripod (for example) while I'm on the tennis court that analyzes video of me serving and gives me helpful tips (i.e. "straighten your arm," "bend your knees"). In this post, I'll show you the core techniques that would make an app like that possible.

_Want to jump straight to the code? Check out the [repo](https://github.com/google/making_with_ml/tree/master/sports_ai "repo") _on Github._