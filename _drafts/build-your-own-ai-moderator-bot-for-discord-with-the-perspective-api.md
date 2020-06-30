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

In this post, I’ll show you how to build your own AI-powered moderation bot for the chat platform Discord. Don’t worry if you’ve never done any machine learning before--we’ll use the [Perspective API](https://www.perspectiveapi.com/), a completely free tool from Google, to handle the complicated bits.

But, before we get into the tech-y details, let’s talk about some high-level moderation strategies. Most companies use one of three approaches:

1. **Pre-Moderation** is when a team of human moderators review every single piece of content before it’s ever posted. It’s a good approach when it’s _very, very_ important that no “bad” content slips through the cracks. Apple, for example, requires every app submitted to the App Store to be[ reviewed by an employee](https://www.cnbc.com/2019/06/21/how-apples-app-review-process-for-the-app-store-works.html) before it's published.
2. **Post-Moderation** is the opposite--content is allowed to be posted _before_ it’s reviewed by moderators. Instead, the job of flagging posts usually gets crowdsourced to users, who are able to “flag” or “report” content they believe violates a site’s TOS. You see this almost everywhere (YouTube, Facebook, Instagram, and many more).

**![](https://lh6.googleusercontent.com/XNb-vMdhaDs87QwOp0pL8YgKe-YL9Mr_wcJMLDbG6zRuzl8GzKoyUXw_YNccrWnQNbk69iijHEhTmqh2wqiRqsmycveE8fYTrAkcxdFHWQAVM7GJrDZGoQBvfqsWk7Eozvxg435KMg =624x409)**

Both of these approaches clearly come with drawbacks--pre-moderation requires a large human moderation team, and doesn’t work for real-time applications (chat, or any type of streaming). Post-moderation scales better, but forces your users to consume potentially offensive or disturbing media. Which leads us to:

1. **AI-Powered Moderation**. This approach uses AI to flag inappropriate content the moment it’s created and prevent it from ever surfacing. For example, the online gaming platform FACEIT [uses this technique](https://www.forbes.com/sites/mikestubbs/2019/10/23/faceit-and-google-partner-to-use-ai-to-tackle-in-game-toxicity/#1d78ab2079d0) to detect offensive messages in chat, send users warnings, and even potentially kick them from play.

AI moderators work around the clock and react near-instantaneously, so they can spot, for example, a livestream of a gory video seconds after it starts. Usually, AIs don’t _replace_ a human moderation team, but work in conjunction with one, helping to automatically prioritize content that needs to be checked.

So, without further ado, let’s build an AI-powered moderator bot for the chat platform Discord.

## Building an AI-Powered Moderation Bot for Discord

_Want to jump straight to the code? Check it out_ [_here_](https://github.com/google/making_with_ml/tree/master/discord_moderator)_._

Today I’ll show you how to build an AI-powered moderation bot for Discord.

The bot sits in a Discord channel and analyzes all messages users to see if they’re toxic, nonsensical, flirty, insulting, or spam-y. When it detects that a message does fit one of these buckets (i.e. toxic) it “reacts” to the message with an emoji (🧨). Later, you can check to see how many reactions each user has received using the “!karma” hot word. And if a user sends too many toxic messages, they get kicked from the channel.

![](/images/discord_moderator.gif)

Let’s see how to build it.

### Setup

First let’s grab the code for our moderator bot. Clone the \`making_with_ml\` [Github repo](https://github.com/google/making_with_ml) and navigate to the \`discord_moderator\` folder:

    > git clone git@github.com:google/making_with_ml.git
    > cd making_with_ml/discord_moderator

Here’s all the code you’ll need to run your ML moderator bot. Before we can run the bot, we’ll need to get some (completely free) services set up. First, make a copy of the file `.env_template` and name it `.env`.

    > cp .env_template .env`

Open that file up in your favorite text editor:

    PERSPECTIVE_API_KEY="YOUR_API_KEY"
    DISCORD_TOKEN="YOUR_DISCORD_TOKEN"
    KICK_THRESHOLD=4

As you can see, we’ll need a couple of different API and developer tokens to get started, one for the Perspective API, which we’ll use for analyzing messages, and one for Discord (more on that in a second).

What is the Perspective API?
The Perspective API is a free tool built by Jigsaw, a unit within Google that, in their own words, “forecasts and confronts emerging threats, creating future-defining research and technology to keep our world safer.” The Perspective API is one such tool they provide for keeping the (digital) world safer. It takes text as input (“You stink like butts”) and analyzes it for attributes like toxicity, insults, profanity, identity attacks, sexual explicitness, flirtation, threats, and more. You can quickly it out in their interactive web demo:

![A screenshot of the Perspective API's built in preview analyzing the text "You stink like butts" and labeling it as 90% likely to be toxic.](https://lh6.googleusercontent.com/9fv3SzQHQXVl3axxhBLCEgyalWv3jknmnkZHXtRAqNNjdCxgswEWC9meJ5DgvmWpPbZ0jMBRLvhj7ekO9uELfJ2B8jwheKPCcHF2SBSBcJutvHnOW6bk-t1Qb_4WASgX_pk7RDHfFQ "Perspective API preview" =624x328)

Today, The New York Times uses Perspective to help automatically moderate their comments section.

Unfortunately, the documentation to actually use the Perspective API in Javascript is a bit sparse, so I’ll fill in some of the details here.

### Enabling Perspective

First, sign in to your Google Cloud account (it’s [free to get started](https://www.googleadservices.com/pagead/aclk?sa=L&ai=DChcSEwjkoYmP96nqAhVRvsAKHZr2ADwYABAAGgJpbQ&ohost=www.google.com&cid=CAESQeD2mj7PglbdR5gh2gVTdo5o1jCSc9pBZZyZVK2oPapo3Qzhxx4huChpTLViF9aJXXXw3dvt0q_aN_5BJEVt_6KY&sig=AOD64_3zisckaS_RW1yT-ighx5qK_Hk32Q&q&adurl&ved=2ahUKEwiGsP6O96nqAhUDnq0KHbd1DysQ0Qx6BAgOEAE)), and either create a new project or select an existing one. In your project, enable the [Perspective Comment Analyzer API](https://console.cloud.google.com/apis/api/commentanalyzer.googleapis.com/overview). You’ll have to fill out a short survey to gain access (you should receive an email in a couple of hours).

Next you’ll need to generate an API key to access the API in code. In the Google Cloud console left hand menu, click API & Services -> Credentials. On that screen, click "+ Create Credentials" -> "API key". Copy that API key.

![](https://lh6.googleusercontent.com/P9BhvYeKWAMF0lRk7IcUEqnopAToNJ_G2ay1r638p4u69TW3gwodQU76uLvZm6fTJGf31doXRmmRj7lp7gJ4lKwSrkXU8N3_Is1DsKwelqk4LHU1I0Mg2P__UVVIzprFtsoqaFRLrQ =624x396)

Now go back to that file you created earlier--`.env`--and drop the key into the `PERSPECTIVE_API_KEY` field:

        PERSPECTIVE_API_KEY="YOUR_API_KEY"  \\paste yer key here
        DISCORD_TOKEN="YOUR_DISCORD_TOKEN"
        KICK_THRESHOLD=4

\##Analyzing Messages

Now you should be able to use the Perspective API to analyze text in code. To see an example, check out the file `perspective.js`. At the top of the file, you’ll all of the possible attributes the API can recognize:

    // Some supported attributes
    // attributes = ["TOXICITY", "SEVERE_TOXICITY", "IDENTITY_ATTACK", "INSULT",
    // "PROFANITY", "THREAT", "SEXUALLY_EXPLICIT", "FLIRTATION", "SPAM",
    // "ATTACK_ON_AUTHOR", "ATTACK_ON_COMMENTER", "INCOHERENT",
    // "INFLAMMATORY", "OBSCENE", "SPAM", "UNSUBSTANTIAL"];
    

On the next line, you’ll see the attributes we’ll actually using in our bot:

    // Set your own thresholds for when to trigger a response
    const attributeThresholds = {
     'INSULT': 0.75,
     'TOXICITY': 0.75,
     'SPAM': 0.75,
     'INCOHERENT': 0.75,
     'FLIRTATION': 0.75,
    };

See all those numbers next to each attribute? When you ask the Perspective API to analyze a comment (“You’re soooo sexy”), it returns a “summaryScore” for each attribute:

    “attributeScores”: {
    	“FLIRTATION”: {
    		“summaryScore”: {
    			“Value”: 0.88309
    		}
    	}
    }
    

The score represents roughly how confident the machine learning model is that a comment is really fliration or toxic or threatening, etc. The job is then on you, the developer, to choose a “cutoff” for deciding when a comment should really get a label. That’s what all those numbers mean in the `attributeThreshold` object I posted above. I’ll only consider a comment insulting or toxic or threatening if the summaryScore is above 0.75.

Pro tip: In your own application, you’ll want to choose a cutoff that aligns with how your human moderation team (if you have one) is already moderating content. For example, on Tinder, sending flirtatious messages is totally ok, and we might have a higher cutoff for filtering sexually explicit messages than, say, a site like LinkedIn.

Meanwhile, take a look at the function `analyzeText` to see how we actually call the Perspective API:

    /**
    * Analyze attributes in a block of text
    * @param {string} text - text to analyze
    * @return {json} res - analyzed atttributes
    */
    async function analyzeText(text) {
     const analyzer = new googleapis.commentanalyzer_v1alpha1.Commentanalyzer();
    
     // This is the format the API expects
     const requestedAttributes = {};
     for (const key in attributeThresholds) {
       requestedAttributes[key] = {};
     }
    
     const req = {
       comment: {text: text},
       languages: ['en'],
       requestedAttributes: requestedAttributes,
     };
    
     const res = await analyzer.comments.analyze({
       key: process.env.PERSPECTIVE_API_KEY,
       resource: req},
     );
    
     data = {};
    
     for (const key in res['data']['attributeScores']) {
       data[key] =
           res['data']['attributeScores'][key]['summaryScore']['value'] >
           attributeThresholds[key];
     }
     return data;
    }
    

To actually connect with the API, we call `const analyzer = new googleapis.commentanalyzer_v1alpha1.Commentanalyzer();`. We then package up a request (LINE TODO), specifying our language and the attributes we want to analyze, and send it to the API. That’s it! On line 30, we check to see if the scores returned from the Perspective API are above our threshold (0.75).

Congratulations, you can now use machine learning to analyze text! Now let’s throw that useful functionality into a Discord bot.

### Setting Up a Discord Bot

If you’ve never used [Discord](https://discord.com/), it’s a voice, video, and text chat platform that’s popular with gamers. You can use the methods in this post to build a bot for other messaging platforms, like [Hangouts](https://discord.com/) or [Slack](https://slack.com/), but I chose Discord because it’s got such a delightful developer experience.

To get started, download Discord (or use the web version), and [sign up](https://discord.com/developers) for a Discord developer account. Once you’re in, click “New Application,” and give your new app a name and a description.

![](https://lh5.googleusercontent.com/UuuwQnNemiNmXxpa34h_jKWgwIdEs1ieH31etzAtbZxDkvIh_93T4dSZyartmPUFlevi2oSnHj-DOweLCABu8aM85E84oo9OOyua7D019lPVpuSc0Wuv7RpZjiK7dzOJWTezgmaT5Q =624x384)

On the left hand panel, choose “Bot” to create a new bot. Select "Add Bot." Give your new Bot a username and upload a cute or intimidating user icon.

![](https://lh6.googleusercontent.com/D9Csn5YuGdjN5fa7StNaoqtk-RDOVsMwmBwWdy3ftt3CP4G7wj3GVL_scbg_Q712eZScew5Z3egdcTkNe5ZPmEMkSv1TnDXiPyLBbpKbmd-Ai84-J1_wmGvAXkAHwXqDbdhA-lmr3Q =624x232)

To be able to control your bot in code, you’ll need a Discord developer token, which you can grab straight from that bot page by clicking “Copy.” Drop that code in your \`.env\` file:

```
PERSPECTIVE_API_KEY="YOUR_API_KEY"
DISCORD_TOKEN="YOUR_DISCORD_TOKEN" \\ your Discord token here
KICK_THRESHOLD=4
```
hello