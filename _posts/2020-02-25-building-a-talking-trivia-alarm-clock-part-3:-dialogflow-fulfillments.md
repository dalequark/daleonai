---
layout: layouts/post.njk
title: 'Building a Talking Trivia Alarm Clock, Part 3: Dialogflow Fulfillments'
description: Learn how to use Fulfillments with Dialogflow to augment your chatbot
  with custom code.
date: 2020-02-25
feature_image: "/images/2020-02-25-building-a-talking-trivia-alarm-clock,-part-3:-dialogflow-fulfillments/0.png"
feature_image_pos: right center
tags:
- chatbots
- dialogflow
- google cloud

---

Welcome back, and _wow_ —if you’re here because you finished reading [Part 1](https://daleonai.com/building-a-talking-trivia-alarm-clock-part-1-intro-to-dialogflow) and [Part 2](https://daleonai.com/building-a-talking-trivia-alarm-clock-part-2-streaming-dialogflow-on-a-raspberry-pi) of this series, I applaud you. You have enviable endurance or are _really really_ hard to wake up in the morning.


But, if you got here some other way, some context: this is Part 3 of a series of articles explaining how to build a talking trivia alarm clock that wakes you up by asking you things like, “What’s 8923 times 2893084?” It’s also a sneaky good way to learn some about some advanced concepts in [Dialogflow](http://www.dialogflow.com) (Google’s framework for building AI-powered chatbots) like Fulfillments, Event Triggers, and complex logic flows. If you’re new to Dialogflow, make sure to check out those [earlier posts](https://daleonai.com/building-a-talking-trivia-alarm-clock-part-1-intro-to-dialogflow) first.

And now, on with the alarm clock building!

* * *

In parts 1 and 2, we learned how to:

1.  Build an alarm-setting Voice User Interface in Dialogflow and
2.  Deploy that “VUI” on a Raspberry Pi (or Macbook or desktop or whatever)

The trickiest bit of those two parts was probably figuring out how to get Dialogflow streaming on a computer (see some [additional reading](https://daleonai.com/streaming-dialogflow-on-your-desktop-device-raspberry-pi)). That more challenging section aside, the alarm-setting Dialogflow agent we created in Part 1 (designed to recognize phrases like, “Set an alarm for 8 AM” or “Delete my alarm”) was fairly simple in terms of Dialogflow agents.

But now we need to build the real fun part of this trivia alarm clock — the trivia part! The plan is to build a _second_ Dialogflow agent (call it something like `TriviaGame`) that works like this:

> Agent: “GOOD MORNING! GOOD MORNING! WAKE UP! WAKE UP! IT’S TIME TO PLAY SOME TRIVIA!”
> 
> Sleeping Person: “Snooze.”
> 
> Agent: “Sorry, I don’t support that function yet, slacker. It’s time to play trivia. Your first question is, what’s 9 plus 11?”
> 
> Sleeping Person: “Snooze.”
> 
> Agent: “WHAT’S 9 PLUS 11?”
> 
> Sleeping Person: “Fine. It’s 20.”
> 
> Agent: “Good job, that’s right! Your next question is: what’s 38 times 289?”
> 
> Sleeping Person: \*sigh\*

You are of course welcome to customize your alarm clock’s personality. After all, you’ll be forming a very intimate relationship.

The idea here is that we’ll set our alarm time with the first Dialogflow agent (i.e. “Set an alarm for 8”) and then, when it’s 8, we’ll trigger streaming the new trivia-asking Dialogflow agent.

So let’s go ahead and create our new trivia Dialogflow Agent.

Creating a Dialogflow Trivia Agent
==================================

To get started, create a new Dialogflow Agent called something like `TriviaGame`. When you’re asked if you’d like to create a new GCP project to go along with this Agent, say yes (at this time, a GCP project can support at most one Dialogflow agent). If you need a refresher on how to create a new Dialogflow agent, check out [Part 1](http://daleonai.com/building-a-talking-trivia-alarm-clock-part-1-intro-to-dialogflow).

If you haven’t already, go ahead and clone the Talking to Machines [Github repo](https://github.com/dalequark/talking_to_machines):

```
git clone [git@github.com](mailto:git@github.com):dalequark/talking_to_machines.git
```

The `trivia_alarm` folder in this repository contains all the code you’ll need to complete your trivia alarm. There, you’ll a file called `TriviaAgent.zip`. That file contains all the entities and intents you’ll need for our new Dialogflow Agent. To import it into your agent, click the gear icon in the Dialogflow left hand bar, then click “IMPORT FROM ZIP” and select the file `TriviaAgent.zip`.

<!-- TODO: Fix image include -->



<!-- TODO: Fix image include -->



You’ll notice the `Default Welcome Intent`, which comes with every Dialogflow Agent, that responds to phrases like “Hello” and “How ya doin?”

There’s also an intent called `Ask Question`, which is responsible for asking the user trivia questions. If you type something like, “Let’s play trivia,” in the right hand bar of the Dialogflow test console, you’ll trigger that intent:

<!-- TODO: Fix image include -->



Notice that, although your agent recognizes your intent as the “Ask Question” intent, it doesn’t actually ask you any trivia questions yet. That’s because we haven’t implemented question asking yet!

You can also saying something like “Snooze,” “Later,” or, “I don’t want to play.” All of these will match the `Snooze` intent, which we will use to remind the user there’s no time for snoozing.

Meanwhile, the phrase “I don’t know” will match the “Next Question” intent, which we’ll use to give the user a new question if they’re really stumped on the current trivia question.

Finally, if you try typing something like “The answer is 7” into the Dialogflow console, you’ll match the “Answer Question” intent.

<!-- TODO: Fix image include -->



Actually, if you go back and try the phrase “gobbledy gobbledy goop” or “What is love?” you’ll find these also match the intent `Answer Question`. That’s because `Answer Question` is actually, sneakily, a [fallback intent](https://cloud.google.com/dialogflow/docs/intents-default)! Remember those from Part 1? They’re wildcard intents that are matched when Dialogflow doesn’t find an alternative matching intent. You can verify this by clicking on the `Answer Question` intent in the Dialogflow console:

<!-- TODO: Fix image include -->



Here we’ve decided to make `Answer Question` a fallback intent because we’ll assume that anything the user says that doesn’t match an alternate intent (i.e. not “Snooze” or “Next question”) is the user’s attempt at answering a question. It’s a bit of a hack, but it works!

So far, with those intents alone, we have the skeleton of a trivia bot in place. But to actually make this thing work, we’re going to need to dip into some more 🌈advanced✨ Dialogflow concepts, like **Fulfillments**!

What are Dialogflow Fulfillments?
---------------------------------

When a user interacts with a voice assistant or a chatbot, they usually expect it to _do_ something for them. In Parts 1 and 2, for example, we built a voice assistant that, when the user says, “Set an alarm for 8 AM,” then goes and sets an alarm for 8 AM. In that case, we were streaming Dialogflow through a Raspberry Pi using Node.js, and we _fulfilled_ the user’s request to set an alarm in that Node.js code, running on-device.

There’s another way to inject code into Dialogflow so that it’s dynamic and useful, and it’s called [Fulfillments](https://cloud.google.com/dialogflow/docs/fulfillment-overview). The idea is this: when your DF Agent matches an intent, rather than responding with a hard-coded response (like the ones pictured written below), your Agent sends the request to code that runs in the Cloud.

<!-- TODO: Fix image include -->



For example: you could build an Agent that, when you ask, “What’s the weather today?”, uses Fulfillment code to call a weather API and return a dynamic response (i.e. “It’s 68º today in Austin, Texas”). Or, when you ask, “When’s my dinner reservation?”, your agent could query a database and respond “It looks like you have a reservation for tonight at 7PM.” The possibilities are endless! And in our case, we’ll use Fulfillments to dynamically generate trivia questions and check users’ responses.

Fulfillment are the first tool you’ll need to start building complex, dynamic Dialogflow apps (like our alarm), and we’ll talk about how to build them in a minute. But first, there’s another tool we’ll need to get started, and those are **Events**.

What are Dialogflow Events?
---------------------------

Typically, the way we match intents in Dialogflow is by saying stuff, i.e. the phrase “I want to go to sleep” matches our trivia alarm’s `Snooze` Intent. However, intents can also be triggered by Dialogflow **Events**. From the [docs](https://cloud.google.com/dialogflow/docs/events-overview):

> There are two types of events:
> 
> [**Platform events**](https://cloud.google.com/dialogflow/docs/events-platform): These built-in events are provided by platform [integrations](https://cloud.google.com/dialogflow/docs/integrations). They are invoked when platform-specific events occur. For example, the `FACEBOOK_LOCATION` event is invoked by the Facebook integration when an end-user accepts or rejects a request for the end-user's location.
> 
> [**Custom events**](https://cloud.google.com/dialogflow/docs/events-custom): These are events that you define. You can invoke these events using either [fulfillment](https://cloud.google.com/dialogflow/docs/fulfillment-overview) or [the API](https://cloud.google.com/dialogflow/docs/api-overview). For example, you might set a timed alert during a conversation, which invokes an event at a certain time. This event could trigger an intent that alerts the end-user about something.

That second type — custom events — allows you to invoke events with code. Combining this with Fulfillments means that you can chain intents together, so that one intent triggers another intent triggers another intent…

Sound crazy? It is! Wondering why you’d ever want to do something like that? Understandable. But turns out this is exactly what we need to make our trivia alarm work.

Up and Running with Fulfillments
--------------------------------

If you take a look at any of our project’s intents in the Dialogflow UI, you’ll notice there’s a header called “Fulfillment” at the bottom with the slider next to “Enable webhook call for this intent” activated:

<!-- TODO: Fix image include -->



This means that when the `Ask Question` intent is invoked (i.e. by a user saying, “Let’s play trivia”), Dialogflow will respond by running Fulfillment code rather than with a hard-coded Text Responses (as you can see above, the Text Response field is empty).

Let’s take a look at where that Fulfillment code lives. In the Dialogflow UI, click on the tab that says “Fulfillment” in the left hand sidebar:

<!-- TODO: Fix image include -->



If you’re writing in Javascript/Node.js, you can use the [Dialogflow Fulfillment library](https://dialogflow.com/docs/reference/fulfillment-library/webhook-client) to make building Fulfillments easier. You can also use the “Inline Editor,” which allows you to paste Node.js code directly into the Dialogflow UI and allow DF to handle hosting for you. By default, the Inline Editor shows some code using the Fulfillment library that’s greyed out. If you check “Disabled” -> “Enabled” next to the Inline Editor option, you’ll be able to scroll through some very basic and educational Fulfillment examples.

**Trivia Alarm Fulfillments**
-----------------------------

You can find all the code we’ll need for trivia alarm fulfillments on Github [here](https://github.com/dalequark/talking_to_machines/tree/master/trivia_alarm/fulfillment/functions), spread across two main files. `trivia.js` is a small Javascript library for generating easy, medium, and hard math trivia questions. For example, calling the function `getEasyQuestion` returns a json response like:

```json
{          
   "question" : "What is 3 plus 4?",
   "answer" : 7     
}
```

The `index.js` file contains all the actual Dialogflow Fulfillment code. In that file, there’s a function corresponding to each of our agent’s intents (i.e.`function askQuestion(agent)`, `function snooze(agent)`). At the very bottom of the file, we connect those functions to their corresponding intents using a `Map`:

```js
// Map Dialogflow intent names to their matching functions const intentMap = new Map();    
intentMap.set('Ask Question', askQuestion);    
intentMap.set('Snooze', snooze);    
intentMap.set('Next Question', nextQuestion);    
intentMap.set('Answer Question', answerQuestion);  agent.handleRequest(intentMap);
```

In typical web development, this is sort of like routing.

If you want to understand the logic of that [file](https://github.com/dalequark/talking_to_machines/blob/master/trivia_alarm/fulfillment/functions/index.js), take a look at the comprehensive inline comments. It works like this:

*   The `Ask Question` Intent is handle by a function appropriately named `askQuestion`. This is the function that is responsible for asking trivia questions.
*   The `Answer Question` Intent is a fallback Intent, so it’s matched whenever none of the other Intents (`Snooze`, `Next Question`, etc) are matched. It’s responsible for checking whether the user’s answer to a trivia question was correct. It stores that information in a variable called `lastState`, which can be set to either “Right Answer,” “Wrong Answer,” or “No Number” if the user didn’t give a number in their answer. It then triggers the Intent `Ask Question`, passing that information along with it.
*   The `Snooze` Intent is matched when the user says “Later” or “I want to go to sleep” or something like it in response to a question. Because we are mean, we will simply trigger the Intent `Ask Question` from `Snooze`, which will say to the user, “No time for snoozing! Your question is…”
*   The `Next Question` Intent will also trigger the Intent `Ask Question`, setting the variable `lastState` to “Next Question.” This lets the `Ask Question` handler know it should generate a new trivia question
*   Finally, the `Quiz Done` Intent is triggered when the user has answered 3 questions successfully, and will respond by saying, “Congratulations, you’re probably awake now. See you tomorrow!”

If you do decide to take a look at the code, some additional Dialogflow concepts might be good to know:

Context, Event Triggers, Parameters
-----------------------------------

**Contexts.** [Contexts](https://cloud.google.com/dialogflow/docs/contexts-overview)  in Dialogflow can be used to store information across multiple turns of a conversation. Here, we use context to remember what quiz question is currently being asked, its answer, and how many questions the user has already answered correctly. In code, that looks like this:

```js
agent.context.set({
  name: 'quiz_data', // this can be any name you like
  lifespan: 99,      // how long to keep this context alive for
  parameters: {      // where we put the info we want to store
    question: "What's 5 plus 9?",
    answer: 14,
    questions_correct: 1,
  },
});
```

**Event Triggers.** Earlier, we talked about how we can invoke Intents in Fulfillment code, so that we can “chain” Intents. In our alarm clock, we use these triggers several times. For example, if the user says “Next Question,” they’ll invoke the `Next Question` Intent. In this case, the user wants to be asked a _new_ question. So (in Fulfillment code), the`Next Question` Intent uses an event trigger to invoke the `Ask Question` Intent, which generates a new question and asks it to the user. In code, this looks like:

```js
agent.setFollowupEvent({
  name: 'ask-question',
  parameters: {
    lastState: lastState,
  },
  languageCode: 'en',
});
```

The sample above invokes the Intent with the name `ask-question`. You can see there’s also a `parameters` field, which lets you pass arbitrary information from the calling Intent to the target Intent. Here, we use that field to indicate why we’ve triggered an event (was it because the user got the question wrong? Right? They wanted to Snooze?).

\*This is a lot to take in all at once, so if you want a more thorough explanation of what’s going on in the code here, leave a note below in the comments.

Deploying Fulfillments
----------------------

The next and final step to putting our alarm clock together is to deploy our fulfillment code. You can either do this in the inline Dialogflow code editor or by hosting it yourself. Because I have code spread across multiple files (`index.js` and `trivia.js`), I thought it’d be neater to host the code myself. I deployed it in using [Firebase Cloud Functions](https://firebase.google.com/products/functions?gclid=Cj0KCQiAqNPyBRCjARIsAKA-WFwrRYwgSYTXmTBilH5yrzppwSQRHFZTX6GPmpGpwT5f7avX9-OPR1waApNuEALw_wcB). If you’ve decided to take this route, go to the Fulfillment tab and configure your webhook, like so:

<!-- TODO: Fix image include -->



* * *

Thanks for reading! And if there are any more details you need in this blog post, leave a comment below and I’ll add them!
