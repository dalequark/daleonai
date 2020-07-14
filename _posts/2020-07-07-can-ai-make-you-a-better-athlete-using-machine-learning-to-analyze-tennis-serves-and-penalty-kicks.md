---
layout: post
title: Can AI Make You a Better Athlete? Using Machine Learning to Analyze Tennis
  Serves and Penalty Kicks
description: In this post, well use Machine Learning to analyze key features athletes
  need to know, like their posture, angles of their bodies, and the speed or power
  of their throws.
date: 2020-07-07 05:00:00 +0000
feature_image: "/images/design-proposal.png"
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

Which is what we'll be looking at today! In this post, I'll show you how to use Machine Learning to analyze your performance in your sport of choice (as an example, I'll be using my tennis serve, but you can easily adopt the technique to other games). By the way, this project was inspired by my recent interview with Zack Akil, where we talked about analyzing penalty kicks, for the Making With Machine Learning YouTube show.

Already, machine learning plays a role in sports: companies [use it to](https://www.nytimes.com/2020/04/08/technology/ai-sports-athletes-machine-learning.html) identify players’ unique talents, detect injuries earlier, and broker optimal player trades. Plus, almost every professional sport (NFL, NHL, MLB, NBA, soccer, golf, cricket, to name a few) uses ML technology for tracking. The NBA, for example, has deployed a sophisticated vision-based system all on courts, tracking players’ motions, reading numbers off their jerseys, analyzing how fast they pass the ball, and determining how accurately they shoot under pressure.

But as a beginner, I'd love to use that same technology simply to tell me what I'm doing wrong and where I'm making mistakes. Ideally, I'd build an app that I set up on a tripod (for example) while I'm on the tennis court that analyzes video of me serving and gives me helpful tips (i.e. "straighten your arm," "bend your knees"). In this post, I'll show you the core techniques that would make an app like that possible.

_Want to jump straight to the code? Check out the_ [_repo_](https://github.com/google/making_with_ml/tree/master/sports_ai "repo") _on Github._

## Using Machine Learning to Analyze My Tennis Serve

A few weeks ago, I went to a tennis court, set up a tripod, and captured some footage of me serving a tennis ball. I sent it to my friend JT, a tennis coach, and asked him what I was doing wrong. He sent back this:

![Image of knees during tennis serve](/images/step-1-knee-bend-1.png "Image of knees during tennis serve")

![Diagram of arm during tennis serve](/images/step-2-trophy-pose-1.png "Diagram of arm during tennis serve")

![](/images/step-3-contact-point-1.png "Diagram of hitting the ball during a tennis serve")

You can see it was kind of a bloodbath.

But what JT had done was very useful--he analyzed key parts of my serve that differed from those of professional athletes. Wouldn't it be neat if a machine learning model could do the same thing? Compare your performance with professionals and let you know what you're doing differently?

With JT's feedback in hand, I decided to focus on three facets of serving:

1. Were my knees bent as I served?
2. Was my arm straight when I hit the ball?
3. How fast did the ball actually travel after I hit it? (This one was just for my personal interest)

### Analyzing Posture with Pose Detection

To compute the angle of my knees and arms, I decided to use pose detection--a machine learning technique that analyzes photos or videos of humans tries to locate their body parts. There are lots of tools you can use to do pose detection (like [TensorFlow.js](https://www.tensorflow.org/lite/models/pose_estimation/overview)), but for this project, I wanted to try out the new Person Detection (beta!) feature of the Google Cloud [Video Intelligence API](https://cloud.google.com/video-intelligence/docs). (You might recognize this API from my [AI-Powered Video Archive](https://daleonai.com/building-an-ai-powered-searchable-video-archive), where I used it to analyze objects, text, and speech in my family videos.) The Person Detection feature recognizes a whole bunch of body parts, facial features, and clothing. From the [docs](https://cloud.google.com/video-intelligence/docs/feature-person-detection):

![](/images/screen-shot-2020-07-14-at-3-45-56-pm.png "Features detected by the video intelligence API")

To start, I clipped the video of my tennis serves down to just the sections where I was serving. Since I only caught 17 serves on camera, this took me about a minute. Next, I uploaded the video to Google Cloud Storage and ran it through the Video Intelligence API. All of that code is conveniently documented in a [Colab notebook](https://github.com/google/making_with_ml/blob/master/sports_ai/Sports_AI_Analysis.ipynb) which you can run yourself on your own video (you'll just need a Google Cloud account). The notebook even shows you how to set up authentication and create buckets and all that jazz. The interesting bit--analyzing pose--is this bit:

    def detect_person(input_uri, output_uri):
        """Detects people in a video."""
    
        client = videointelligence.VideoIntelligenceServiceClient(credentials=service_account.Credentials.from_service_account_file(
        './key.json'))
    
        # Configure the request
        config = videointelligence.types.PersonDetectionConfig(
            include_bounding_boxes=True,
            include_attributes=True,
            include_pose_landmarks=True,
        )
        context = videointelligence.types.VideoContext(person_detection_config=config)
    
        # Start the asynchronous request
        operation = client.annotate_video(
            input_uri=input_uri,
            output_uri=output_uri,
            features=[videointelligence.enums.Feature.PERSON_DETECTION],
            video_context=context,
        )
    
        return operation

To call the API, you pass the location in Cloud Storage where your video is stored as well as a destination in cloud storage where the Video Intelligence API can write the results.  

_Here, I'm calling the asynchronous version of the Video Intelligence API. It analyzes video on Google's backend, in the cloud, even after my notebook is closed. This is convenient for long videos, but there's also a synchronous and streaming version of this API!_

When the Video Intelligence API finished analyzing my video, I visualized the results using [this neat tool](https://github.com/wbobeirne/video-intelligence-player) built by [@wbobeirne](https://github.com/wbobeirne). It spits out neat visualization videos like this:

![](/images/tennis_gif.gif)

Pose detection makes a great pre-processing step for training machine learning models. For example, I could use the output of the API (the position of my joints over time) as input features to a second machine learning model that tries to predict (for example) whether or not I'm serving, or whether or not my serve will go over the net. But for now, I want to do something much simpler: analyzer my serve with high school math!

For starters, I plotted the y position of my left and right wrists over time:

![](/images/wrist_pos-1.png)

It might look messy, but that data actually shows pretty clearly the lifetime of a serve. The blue line shows the position of my left wrist, which peaks as I throw the tennis ball, a few seconds before I hit it with my racket (the peak in the right wrist, or orange line).

Using this data, I can tell pretty accurately at what points in time I'm throwing the ball and hitting it. I'd like to align that with the _angle_ my elbow is making as I hit the ball. To do that, I'll have to convert the output of the Video Intelligence API--raw pixel locations--to angles. How do you do that? The Law of Cosines, _duh_! (Just kidding, I definitely forgot this and had to look it up. Here's [a great explanation](https://medium.com/@manivannan_data/find-the-angle-between-three-points-from-2d-using-python-348c513e2cd) and some Python code.)