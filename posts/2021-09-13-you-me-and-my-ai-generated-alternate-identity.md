---
layout: post
title: You, Me, and My AI-Generated Alternate Identity
date: 2021-09-13T16:54:48.174Z
description: Using machine learning and AI to generate a fake identity online,
  for art and profit
feature_image: /images/yellow-fishing-boat-blog-banner.png
thumbnail_image: /images/yellow-fishing-boat-blog-banner.png
tags:
  - ml
  - ai
  - deepfakes
  - gan
permalink: ai-generated-identity
---
[@azusagakuyuki](https://twitter.com/azusagakuyuki/status/1402512356769296384?s=20) is a young Japanese motorcyclist with long hair, a delicate chin, and 33,000 Twitter followers. There, she posts pictures of herself in a biker shirt, posing in front of her gleaming red-and-blue Yamaha Telkor on dirt roads and hilltops and misty beaches. She’s beautiful, adventurous, and envy-inducing. 

But one day, she accidentally posted a picture of her bike on Twitter that captured her reflection in the rear-view mirror. The reflection was of a middle-aged man--because the woman in the photo was actually a 50-year-old man named Soya who transformed his face using a machine-learning-powered face tune app. (To his credit, Soya’s luscious locks are 100% his own.) “No-one will read what a normal middle-aged man, taking care of his motorcycle and taking pictures outside, posts on his account,” Soya told the Japanese TV program *Getsuyou Kara Yofukashi*. That said, happily, his fans responded mostly positively to his late-in-life, accidental gender reveal. 

[Pretending to be a hot military dude](https://www.nytimes.com/2019/07/28/reader-center/facebook-military-soldier-scam.html) on Facebook to fleece divorced women out of their retirement savings is immoral. Altering your dating profile picture to the point that you’re “catfishing” isn’t great either. But what if your end goal isn’t money or sex, but instead, merely, to be a digital content creator? Is there anything wrong with wanting to be your own magician’s assistant in a black top hat, who reveals that the volunteer in the box wasn’t really chopped in half, and also, isn’t this a cool motorcycle pic? Is that lying or is it art? Is there a difference?

When someone sent me this story back in March, I’d been working on my own social presence for about a year--a YouTube show about machine learning and an Instagram account on the same topic. Hypothetically, it doesn’t matter what the person teaching you about vector embeddings and optimization functions looks like, but that doesn't stop me from spending an hour and a half before each shoot blow-drying and curling my hair and caking makeup all over my face. From a vanity perspective, it’s really the lighting that makes the difference. But although I have an impressive lighting setup, I can never seem to get it soft enough to eliminate that dastardly shine spot on my nose.

So naturally, when I downloaded [FaceApp](https://play.google.com/store/apps/details?id=io.faceapp&hl=en_US&gl=US) and applied the “stunning” neural filter to my selfie, I was engrossed. I ogled my before-and-after: *All it did was give me better makeup!* I told myself. *And imitate good lighting!* “And fuller lips! And some killer cheek fillers!” added my friend. *Well, sure, but–*

In middle school, I remember uploading me and my friends’ photos to some sketchy Web 1.0 website that let you download a picture of what your future kids would like, along with a computer virus. If that was around the last time you tried digital face effects, or even if you did so as recently as two years ago, I highly recommend you download something like FaceApp and try again. (Well–at your own risk.) Because recent advances in image-generating machine learning will blow your mind, and perhaps pull you deep into a vanity tailspin. You can make yourself more “stunning,” give yourself a nose job, make your hair longer/shorter/curlier/straighter/blonder, give yourself a professional makeover, clear your acne and wrinkles, straighten your teeth, and un-awkward-ify your smile. You can do this all in a way that looks shockingly “natural,” as though all you did was snap a photo in perfect lighting conditions, as you crouched down next to a tiger in Thailand. This is not hype-speak; neural photo editing has become so mainstream that today it’s even available in [Photoshop](https://helpx.adobe.com/photoshop/using/neural-filters.html).

As absorbed as I became in my own vain beautification, I was even more pulled in by the neural effects that let me change my identity altogether: to age myself, to make myself younger, to make me look more male. For a while, I used an AI-made male picture of myself as my profile photo on work chat. I looked young and vaguely Russian. I wondered if, thanks to my gender-ambiguous name, my engineer coworkers would treat me differently. I wondered if, as a guy, they’d respect me more. (They didn’t as far as I could tell, but did wonder if I'd "done something with my hair.")

I was fascinated. I could easily generate an entirely different version of myself with just a few taps on my phone. Was it just me or was I actually better-looking as a boy? No, it wasn’t just me, my friends agreed. As a guy, I really was a hottie. I easily understood, then, where Soya, the beautiful biker woman, was coming from. Why bother with blow dryers and makeup and an expensive lighting rig and a wig and a gender-bending morph suit when you can use neural networks to create an entirely new visual persona, exactly the way you want it?

## Generating Fake People

Just five years ago, this wouldn’t have been so easy. Machine learning for image generation started gaining traction back in 2014, when [researchers from the University of Montreal](https://arxiv.org/pdf/1406.2661.pdf) showed they could use what’s called a “generative adversarial network” (GAN for short) to generate blurry, black-and-white human faces:

![](https://lh3.googleusercontent.com/e1uW26Fr2APReggNw8xgcgpbWYHqh6RTjRBSSWpEkumHJa85KWLHFzFcP9kfOnrpt7iL6k7p8N0JezthCQtv_hWo8u6IukPZSy6xael-OI29S59MXDwrPJfkPH2IljWF9EGf5VRU=s0)

It’s hard to think of a field that’s advanced more quickly in recent memory than machine learning. Just four years later, in 2018, Nvidia showed they could generate infinite faces using an improved-upon technique that looked like this:

![](https://lh6.googleusercontent.com/cmD0KH6rFggydzLwAWFOjxcadMrUNPhsW0_vxoDrIKPbCtLHuO26BpvY8mMOyC_yW3Y9TM6OgHQTEedPDD1VBaidE9AKVx8bRZyGHYX0lDcsOnbi2XjRKwW69k8Dib6SivF7JFdm=s0)

None of these people are real, but it’s almost impossible to tell that unless you know what to look for (like, an earring on one ear but not the other). You can click through an endless number of these generated faces at [thispersondoesnotexist.com](thispersondoesnotexist.com). What’s more, Nvidia’s method allowed researchers not only to generate faces, but also to tweak those faces along various visual axes, like age, skin color, gender, and density of facial hair.

What can you do with this weird technology? One interesting application is [Anonymizer](https://generated.photos/anonymizer#), software which lets you turn your face into a slightly anonymized version of yourself. For example, if you wanted to create a Tinder account but didn’t want to reveal your true appearance to strangers on the internet, you could instead upload an Anonymizer photo: a relatively honest (perhaps) but completely synthetic likeness to yourself.

![](https://lh6.googleusercontent.com/O-_e-Pvob1ifiRkrAZMFYE3ZWE7m85oJK9RPGvQwG59wsDDgu0GFnGFfZyZUD3m9D7txrdAHK_Bah9ywEYEN3atrAbPDXwNQYmT1_Srap0Fo_H0hY7zF98uVD08oUG0NIcBoeoqt=s0)

A generated Anonymizer photo of the author

[Last year, the filmmaker David France](https://www.nytimes.com/2020/07/01/movies/deepfakes-documentary-welcome-to-chechnya.html) used an AI-powered tool like Anonymizer in his documentary “Welcome to Chechnya.” The film chronicles violet anti-gay and lesbian purges in Chechnya, and in it, France wanted to include real interviews with gay and lesbian Chechens who were fleeing the region. For this, he needed a way to shield their identities. So he turned to machine learning. The interviewees could be seen on screen without ever really being seen on screen.

Today, ML can be used not only to change someone’s appearance, but also their voice. A recent documentary called “Roadrunner: A Film About Anthony Bourdain,” used machine learning to create a voiceover for the film in the chef’s own AI-simulated voice, posthumously. That movie wasn’t received [nearly as wel](https://www.newyorker.com/culture/annals-of-gastronomy/the-ethics-of-a-deepfake-anthony-bourdain-voice)l by fans.

## More than just Deepfakes

If this idea gives you a queasy feeling (and you could not be blamed for that), you might be remembering deepfakes, that neural-network-powered technology that generates convincingly altered videos. It’s been used to [put fake words](https://www.theguardian.com/technology/2020/jan/13/what-are-deepfakes-and-how-can-you-spot-them) into Donald Trump and Mark Zuckerberg’s mouths, and is thought to be a dangerous tool for generating fake news. [Researchers](https://www.nytimes.com/2019/11/24/technology/tech-companies-deepfakes.html) and governments are already funneling funding and brain-power into building tools to identify and fight deepfakes.

These concerns are completely valid. Like any new technology, machine learning can be used for good and evil, and we’ve yet to discover all the ways it will ultimately manifest. But as a creator, I cannot help but find myself intrigued by the creative applications of this technology, too.

What, for example, do you do if you desire generation over imitation? The same company that built Anonymizer–[Generated Media](https://generated.photos/)–offers a product called “Face Generator” that lets you build fake faces from scratch, controlling attributes like head pose, sex, age, ethnicity, eye color, and more. It’s like the character creator screen in The Sims, but the avatars you create look real and don’t drown in the pool when you delete their ladder.

How are completely generated photos useful? You can imagine using them in place of stock photos on a website. If you’re an app developer, you could use them as stand-ins for real users, as you're prototyping. (You could use AI to create scam users, but that’s a whole different thing.) 

Or, you could use a tool like Face Generator to create a completely new, uncopyrighted persona for yourself, one you could use as a digital vessel for a life you live entirely online--like an amped up version of Soya’s motorcycle account.

## Playing an AI on IG

After I learned @azusagakuyuki’s account, I became wickedly curious about how I’d make one for myself. What I discovered was that Soya’s method didn’t work as well for me as it did for him. Whenever I put my own photo through FaceApp and turned myself into a guy (for example), it always worked–but didn’t always turn me into the same guy. That wasn’t going to fly if I wanted an Insta that looked like it belonged to a single person. (I’m still not sure why it worked for Soya but not for me.)

So down the research hole I went. On Facebook, I discovered a group called [Virtual Beings](https://www.facebook.com/groups/virtualbeings), “A group where Virtual Creators AND Virtual Beings can post about the future of our relationships with interactive, persistent, AI-powered characters, real or imagined!” Through this community, I learned that while AI is used for some aspects of virtual being creation, it’s not the main way life-like avatars are made. Most of today’s life-like-but-fake digital people are very high-quality digital models created by professional (human) 3D modelers.

[One of the most famous](https://www.instagram.com/lilmiquela/?hl=en) of these virtual entities is a 19-year-old girl with Princess Leia buns in her hair and 3M followers on Instagram. Her name is “Lil Miquela.” Lil Miquela has been 19 for five years now. She wears insanely hip (but entirely digital) clothes and posts about food and breakups. She’s popular. She’s “collabed” with Calvin Klein and Bella Hadid and Samsung. Her creators, Trevor McFedries and Sara DeCou, use her as both a medium of artistic expression but also as a marketing tool.

As an influencer, Lil Miquela is easy to work with. She doesn’t age, travels between cities at fiber-optic speed, never complains about food or lodging, and is completely incapable of catching or spreading coronavirus. Her only drawback is that actually rendering photos of her–in places like restaurants or parks or liquor stores, sometimes with other humans or digital entities–is a lot of work. 

I asked my friend, who’s a professional 3D artist, what it would take for me, a digitally savvy person, to make an account like Lil Miquela’s. When he finished explaining the process–how you sculpt a high-poly mesh, transform it with retopology, bake a normal map, do UV unwrapping–I concluded that the amount of time, money, and training I would need to pull this off would be, succinctly, a shit ton.

And Lil Miquela still looks like a high-res Sim. It’s hard to find a virtual being created via 3D modeling that’s realistic-enough to fool the human eye. There aren’t none: [@imma.gram](https://www.instagram.com/imma.gram/) and her brother [@plusticboy](https://www.instagram.com/plusticboy/), two Japanese virtual people, really do look realistic enough you wouldn’t suspect they were generated (except for the fact that they’re unrealistically, unfairly beautiful). But being able to create avatars like them is so far out of grasp for most of us that it’s akin to wanting to build your own washing machine.

So, for now, I’ve abandoned that approach. I’ll wait. I believe that in the near-near-future, machine learning tools will become powerful and user-friendly enough that someone like me will be able craft my own realistic virtual being, one who can travel anywhere in the world in an instant and fit into size 2 pants, without having to spend more than $2.99 on an Android app.



## But Why?

But why, you might wonder, would I want to? 

A few weeks ago, I got drinks with my friend who’s a psychology PhD. When I told her about my fascination with generating a fake identity, she thought that was fascinating. Like surely, if this were an interest of mine, I was suffering from some deep and unresolved internal psychosis.

I tried to think of an answer. 

I am a software engineer, but also a writer. In my day job, I often give presentations and talks, sometimes in front of many people. I'm kind of small. When I wear sneakers, I look like an adult child, and when I wear a blazer, I look like a child playing dress-up as an adult. I prefer myself on paper to IRL. I believe others would find my jokes hilarious if only I could stop botching the delivery. 

I’m exaggerating here slightly. I usually enjoy being me.

But sometimes I think I'd also like being on Instagram as a hot, middle-aged Russian guy who looks distantly like me. There was an older Russian man at my previous job, a new hire named Boris, who saw me writing code one day and said over my shoulder, “I can help you with that. I’m an expert in C++.” Maybe I want to be Boris. I would post pictures online that my current followers would find depraved, like: me, by the side of a pool, my bare, hairy legs in the water, a laptop perched precariously on my lap while I write raw Javascript without a linter.

I’d be a married man, of course. I’m not a creep. Probably wouldn’t tell anybody about it, I wouldn’t want them to think I was psychotic. But that’s an activity for another day. For now, I’m just me, Dale Markowitz, 28/F/Texas. Right?