---
layout: post
title: An Impractical Guide to AI on Google Cloud
date: 2021-09-08T16:48:34.285Z
description: Everything you wanted to know about AI on Google Cloud, and much more
feature_image: /images/untitled-design.png
thumbnail_image: /images/untitled-design.png
tags:
  - machinelearning
  - ml
  - googlecloud
  - ""
permalink: impractical-gcp-ai-guide
---
Your manager holds a gun to the side of your head and says, “Sell me a Google Cloud AI product in the next ten minutes or you’re toast.” It’s that time of year again. Performance reviews. *Perf*.

“Okay, okay,” you say. “Cool it. There are so many products in the GCP AI portfolio, I’m sure we can find one to fit your use case.”

“I don’t *have* a use case,” your manager says. “AWS said I didn’t need one.” Now you’re sweating bullets. “And if you don’t start selling me something in the next three seconds, I’m turning this thing on,” he says, patting the metal rail next to you. You’re chained to a treadmill desk.

You jab your fingers into your Android-shaped stress ball and try to summon all of the GCP AI product offerings into your mind. *Vertex AI, Deep Learning Engine, Document AI, Conversational AI, AutoML, Natural Language API, Translation API*… they won’t all fit on a single page in your mind, the way they do on [cloud.google.com/products/ai](http://cloud.google.com/products/ai).

“Are you… do you… um… have a team of data scientists with expertise in machine learning?” you stammer.

“Ha!” your manager says. “We’re a two-person startup, my co-founder just learned how to code.” He gets this sparkly, evil look in his eye like he’s really nailed you.

But joke’s on him. “*That makes it easy!*” you say. “You want the Google Cloud AI APIs. They can do everything from [translation](https://cloud.google.com/translate) to [recognizing objects and faces in images](https://cloud.google.com/vision). They can detect [text sentiment](https://cloud.google.com/natural-language), [transcribe voices](https://cloud.google.com/speech-to-text), [digitize documents](https://cloud.google.com/document-ai), [produce realistic-sounding voices](https://cloud.google.com/speech)–”

“Our server’s a Raspberry Pi.”

“Doesn’t matter, everything runs in the cloud.”

“My co-founder only writes Erlang.”

“There’s a REST API.” *Got ‘em*.

Your manager narrows his eyes. He turns your treadmill desk on and starts to pace.

“What was *that* for?” you ask, now jogging in place in your red, blue, yellow, and green-colored spandex biker shorts. You sweat more.

“I assume you’re aiming for an *Exceeds Expectations*. Or were you merely going for *Consistently Meets*?”

“Exceeds, exceeds!” you yell. “Strongly exceeds!”

If you get *Consistently Meets Expectations* on Perf, they make you wear that rainbow propeller hat for a whole quarter.

“That’s what I thought,” your manager says.

He walks towards you and pulls a deck of cards from his pocket. “Now, let’s play a game.” He starts to shuffle it. “My business doesn’t need to digitize documents or transcribe speech. Our clients require something a little more–unique.” 

“I thought you said you didn’t have a use case.”

“Quiet,” your manager says. He deals himself a hand from the deck and fans it out in front of you. They’re Pokémon cards. “Our customers have been holding on to these bad boys for years and years,” he says. “As you can imagine, by now, they’re very valuable.” He’s holding a holographic Charizard a foot from your face. It’s got to be worth, you don’t know–[6,500 dollars](https://www.ebay.com/itm/265145028941?chn=ps&norover=1&mkevt=1&mkrid=711-117182-37290-0&mkcid=2&itemid=265145028941&targetid=1262749490302&device=c&mktype=pla&googleloc=9028277&poi=&campaignid=10459841982&mkgroupid=123050527820&rlsatarget=pla-1262749490302&abcId=2146002&merchantid=6296724&gclid=CjwKCAjwvuGJBhB1EiwACU1AiSXvWFe_uZCHrjkBDu3KLBC-TuK13ljVsWindZvr1DL61RQ_Fl46yxoCIqgQAvD_BwE). “We need a way to get a computer to recognize pictures of these cards and to identify the creatures on them.”

“Like a Pokédex!” you say.

Your manager’s eyes narrow again. “I don’t know what that is.”

“Forget it.” You squeeze your Android stress ball more and do some thinking. “That’s a very… custom task,” you say. And now you come up with a clever little trick, which is to follow up with the question, “Do you have a lot of pictures of Pokémon cards?”

“Thousands.”

“And have your users, I don’t know… labeled them with tags that indicate what type of Pokémon each card contains?”

Your manager looks suspicious. “They might have.”

“Because if you do, you already have a labeled image training dataset. You can use the pictures of the cards you’ve got labeled to train a model that recognizes new cards.”

“Train a model? That sounds like something you’d need more than Erlang to know how to do,” he says. “And besides, my co-founder is busy. He’s building our Apple Watch app.”

“No problem,” you say. “You can do it yourself. There’s this tool called [AutoML Vision](https://cloud.google.com/vision/automl/docs)–it lets you train your own custom vision model, and it has an easy-to-use UI that you don’t even have to know how to code to use.”

“Really?” says your manager, looking genuinely surprised. He ramps your treadmill’s incline up ten degrees.

“Well what was *that* for?”

“You are supposed to be L5, aren’t you?” 

You start to pant.

“I’m intrigued by this AutoML Vision concept of yours,” your manager says, “but I don’t think our privacy-conscious users are going to want to send their highly valuable pictures of rare Pokémon cards up to the cloud.”

“I mean, it’s not like Google could ever use that data, or look at it, it’s against our Terms of Service–”

“Ha!” your manager says. “Try again.”

You pant some more. Sweat drips from your forehead down onto your keyboard. “Look, if you really don’t want to send any photos to the cloud, you can [export your AutoML Vision model to the edge](https://cloud.google.com/vision/automl/docs/export-edge#:~:text=Select%20the%20row%20for%20the,to%20export%20your%20Edge%20model.). That way it will run totally on-device. You can even run it on your Raspberry Pi, probably,” you say.

“Really?” Your manager looks so pleased with you now you think he might send you a Spot Bonus. But then there’s a big BUZZZZZZZ and the treadmill slows to a stop. “Ah,” he says. “It’s been five minutes. Time for your mandatory microkitchen break.”

In the microkitchen–the MK–you use a paper towel to wipe the moisture from your face and down a bag of baby carrots and pickled eggs. “God, after that, what I really need is a Snickers bar,” you say. “Isn’t there anything calorically dense in this place?”

Your manager laughs. “Yeah. No. If you want that, go work for Facebook.” He runs his hand through his hair and you feel kind of sorry for him, because you know he’s actually not a bad guy. It’s just that he’s been stuck working exclusively on performance review crap for sixteen years straight. 

“I’m sorry about that back there,” he says now. “I’m just stressed. If I ever had free time, I’d actually learn about all that stuff. You know, I’ve been trying to teach myself [Tensorflow](https://tensorflow.org/).”

“*Tensorflow*?” you say. “You mean, the popular open-source machine learning framework built and maintained by Google that lets you build neural networks and other types of other machine learning models?”

“Yeah,” your manager says, and makes a confused face. “Is there another one or–?”

“No, just the one,” you say. “Unfortunately, if you’re trying to build a neural network, Tensorflow is your only option. Except for– well– yeah, that’s your only option.” You don’t tell him he can just as easily run [PyTorch](https://pytorch.org/) or [Scikit Learn](https://scikit-learn.org/stable/) or any other machine learning framework on GCP, because of your personal bias.

“Crap,” he says. He starts filling his Yeti thermos with lightly-sweetened, prebiotic soda from the tap. “To be honest, the real trouble I’m having isn’t with Tensorflow. It’s that whenever I try to train a model on my laptop, the whole thing starts to heat up like a nuclear reactor.”

“Are you also running Chrome?” you ask.

“No, not even.”

“Well, and I promise I’m not trying to pull a Spot Bonus out of you here, but you’d really be better off training your model in the Cloud. Google just launched this new platform called [Vertex AI](https://cloud.google.com/vertex-ai) at I/O this year–”

“Hold on,” your manager says, and looks down at his watch. “Let’s get you on the trapeze.”

On the trapeze, hanging upside down, you explain everything you know about Vertex AI: GCP’s one-stop-shop for prototyping, training models, dataset management, deploying models, testing–it’s hard to keep track of all the features, because it seems like they keep adding new ones.

But you can tell your manager’s getting impatient.

“I mean, do you know how critical that functionality is?” you tell him amidst an aerial somersault. “If you want to do real, enterprise-scale machine learning in a way that’s maintainable, reproducible, and accessible by your entire org, you need a framework like Vertex.”

“I bet,” your manager says, and looks down at his Apple Watch. Even behind his blue-light-blocking glasses, you can see his eyelids start to droop.

This is bad. You are NOT wearing that propeller hat again.

You start throwing other GCP AI product offerings at him rapid fire, and twirling yourself on the trapeze.

“Wanna build an AI-powered call center? Because there’s [Contact Center AI](https://cloud.google.com/solutions/contact-center) for that. Or a chatbot? You could check out [Dialogflow](https://dialogflow.cloud.google.com/). Or, uh–maybe you want to automate document scanning! Or parse tax forms! You could use [Document AI](http://cloud.google.com/document-ai)!” Your heart rate is like 200. “SOLUTIONS, WE HAVE SO MANY SOLUTIONS!” you yell. “HAVE YOU SEEN THE NEW [RETAIL AI](https://cloud.google.com/solutions/retail)? BUILD A CUSTOM [RECOMMENDATION MODEL](https://cloud.google.com/recommendations)! OR [VISUAL INSPECTION AI](https://cloud.google.com/solutions/visual-inspection-ai)! AUTOMATICALLY DETECT FLAWS ON AN ASSEMBLY LINE!”

You’re halfway through a Full Twisting Triple Back when you realized you’re completely tied up in the ropes.

Your manager sighs.  “Alright, alright,” he says. “Let’s get you down from there. You did it. You passed. Clearly you know a lot about doing machine learning on GCP. Oh, sorry, I meant AI. What’s the difference between those two again?”

“You said the test was over,” you say quickly.

“Yeah, you’re right, it is.” Your manager runs a hand through his hair, then helps you dismount. “You did good, kid,” he says. “I’m going to recommend you for a ‘Superb’ rating. And in the box that says, ‘What could you do to improve?’ I’m going to write, ‘drink less cold brew.’”

“HA HA HA!” you say.

“So, you know, take it easy, while you can. Before you become a manager, ha ha. And for the rest of perf, just make sure your peer reviewers say nice things about. You did remember to ask for peer reviews, didn’t you?”