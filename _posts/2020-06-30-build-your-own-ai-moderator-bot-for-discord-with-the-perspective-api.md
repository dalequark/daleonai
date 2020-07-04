---
layout: post
title: Build Your Own AI Moderator Bot for Discord with the Perspective API
description: Build a moderator bot that instantly flags toxic, insulting, flirtation,
  or spam messages with machine learning--no data science experience required.
date: 2020-06-30 05:00:00 +0000
feature_image: "/images/copy-of-flag-toxic-flirty-or-spam-messages-instantly-with-an-ai-moderator-bot-for-discord.png"
tags:
- google cloud
- natural language processing
- machine learning
- chatbots

---
_In this post, I'll show you how to build an AI-powered moderator bot for the Discord chat platform using the Perspective API._

<!--more-->

<iframe width="560" height="315" src="https://www.youtube.com/embed/ABr_HkO0eGk" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

I’ve been fascinated by the topic of moderation--deciding who gets to post what on the internet--ever since I started working at the online dating site OkCupid, five years ago . The moderation team there was responsible for the [near-impossible task](https://www.thecut.com/2017/02/banned-from-okcupid-sexting-moderation.html) of drawing the line between which messages counted as riské flirtation (usually ok), illicit come-ons (possibly ok), and sexual harassment (which would get you banned). As RadioLab put it in their [excellent podcast episode](https://www.wnycstudios.org/podcasts/radiolab/articles/post-no-evil) on the topic, “How much butt is too much butt?” Questions like these are tough enough, and then, if you’re Twitter, you have to decide what to do when the President’s tweets [violate your Terms of Service](https://www.nytimes.com/2020/06/05/technology/twitter-trump-facebook-moderation.html).

It’s a dirty job, but someone’s got to do it. Or do they? Can an AI handle moderation instead?

Some policy questions, like what to do with the President’s tweets or how to define hate speech, have no right answer. But in many more instances, and for many more platforms, bad content is easy to spot. You probably can’t share any sort of nudity or gore or hate speech on a professional networking app or an educational site for children. Plus, since most apps aren’t public forums like Facebook or Twitter (where we have strong expectations of free speech), the consequences of being too harsh or conservative in filtering risky content are lower. For these applications, machine learning can really help.

In this post, I’ll show you how to build your own AI-powered moderation bot for the chat platform Discord. Don’t worry if you’ve never done any machine learning before--we’ll use the [Perspective API](https://www.perspectiveapi.com/), a completely free tool from Google, to handle the complicated bits.

But, before we get into the tech-y details, let’s talk about some high-level moderation strategies. Most companies use one of three approaches:

1. **Pre-Moderation** is when a team of human moderators review every single piece of content before it’s ever posted. It’s a good approach when it’s _very, very_ important that no “bad” content slips through the cracks. Apple, for example, requires every app submitted to the App Store to be[ reviewed by an employee](https://www.cnbc.com/2019/06/21/how-apples-app-review-process-for-the-app-store-works.html) before it's published.
2. **Post-Moderation** is the opposite--content is allowed to be posted _before_ it’s reviewed by moderators. Instead, the job of flagging posts usually gets crowdsourced to users, who are able to “flag” or “report” content they believe violates a site’s TOS. You see this almost everywhere (YouTube, Facebook, Instagram, and many more).

![Screenshot of reporting a video on YouTube](/images/screen-shot-2020-06-30-at-12-42-05-pm.png "Reporting a video on youtube")

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

What is the Perspective API? The Perspective API is a free tool built by Jigsaw, a unit within Google that, in their own words, “forecasts and confronts emerging threats, creating future-defining research and technology to keep our world safer.” The Perspective API is one such tool they provide for keeping the (digital) world safer. It takes text as input (“You stink like butts”) and analyzes it for attributes like toxicity, insults, profanity, identity attacks, sexual explicitness, flirtation, threats, and more. You can quickly try it out in their interactive web demo:

![Example of Perspective interactive demo](/images/screen-shot-2020-06-30-at-11-10-09-am.png "Example of Perspective interactive demo")

Today, The New York Times uses Perspective to help automatically moderate their comments section.

Unfortunately, the documentation to actually use the Perspective API in Javascript is a bit sparse, so I’ll fill in some of the details here.

### Enabling Perspective

First, sign in to your Google Cloud account (it’s [free to get started](https://console.cloud.google.com)), and either create a new project or select an existing one. In your project, enable the [Perspective Comment Analyzer API](https://console.cloud.google.com/apis/api/commentanalyzer.googleapis.com/overview). You’ll have to fill out a short survey to gain access (you should receive an email in a couple of hours).

Next you’ll need to generate an API key to access the API in code. In the Google Cloud console left hand menu, click API & Services -> Credentials. On that screen, click "+ Create Credentials" -> "API key". Copy that API key.

![Creating an api key from the google developer console](/images/screen-shot-2020-06-30-at-12-44-05-pm.png "Create an API key")

Now go back to that file you created earlier--`.env`--and drop the key into the `PERSPECTIVE_API_KEY` field:

        PERSPECTIVE_API_KEY="YOUR_API_KEY"  \\paste yer key here
        DISCORD_TOKEN="YOUR_DISCORD_TOKEN"
        KICK_THRESHOLD=4

\##Analyzing Messages

Now you should be able to use the Perspective API to analyze text in code. To see an example, check out the file `perspective.js`. At the top of the file, you’ll see all of the possible attributes the API can recognize:

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

The score represents roughly how confident the machine learning model is that a comment is really flirtation or toxic or threatening, etc. The job is then on you, the developer, to choose a “cutoff” for deciding when a comment should really get a label. That’s what all those numbers mean in the `attributeThreshold` object I posted above. I’ll only consider a comment insulting or toxic or threatening if the summaryScore is above 0.75.

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

To actually connect with the API, we call `const analyzer = new googleapis.commentanalyzer_v1alpha1.Commentanalyzer();`. We then package up a request on line 21, specifying our language and the attributes we want to analyze, and send it to the API. That’s it! On line 30, we check to see if the scores returned from the Perspective API are above our threshold (0.75).

Congratulations, you can now use machine learning to analyze text! Now let’s throw that useful functionality into a Discord bot.

### Setting Up a Discord Bot

If you’ve never used [Discord](https://discord.com/), it’s a voice, video, and text chat platform that’s popular with gamers. You can use the methods in this post to build a bot for other messaging platforms, like [Hangouts](https://discord.com/) or [Slack](https://slack.com/), but I chose Discord because it’s got such a delightful developer experience.

To get started, download Discord (or use the web version), and [sign up](https://discord.com/developers) for a Discord developer account. Once you’re in, click “New Application,” and give your new app a name and a description.

![Create a new Discord application](/images/screen-shot-2020-06-30-at-12-44-15-pm.png "Create a new Discord application")

On the left hand panel, choose “Bot” to create a new bot. Select "Add Bot." Give your new Bot a username and upload a cute or intimidating user icon.

![](/images/screen-shot-2020-06-30-at-10-41-42-am.png)

To be able to control your bot in code, you’ll need a Discord developer token, which you can grab straight from that bot page by clicking “Copy.” Drop that code in your \`.env\` file:

    PERSPECTIVE_API_KEY="YOUR_API_KEY"
    DISCORD_TOKEN="YOUR_DISCORD_TOKEN" \\ your Discord token here
    KICK_THRESHOLD=4

Now that you’ve created a bot in Discord, you can immediately add it to a channel. In any Discord app (I’m using the desktop app), log in and create a new server:

![Create a new Discord server](/images/screen-shot-2020-06-30-at-11-46-53-am.png "Create a new Discord server")

Now let’s add your bot to the server. Back in the Discord [Developer Portal](https://discord.com/developers), in your application, click on OAuth on the left side panel

Discord has a very nice system for handling bot permissions. Under “SCOPES,” tick off the box next to “bot.” This should open a “BOT PERMISSIONS” section below.

![Setting bot permissions on Discord](/images/screen-shot-2020-06-30-at-11-51-40-am.png "Setting bot permissions on Discord")

Tick the permissions “Send Messages,” “Add Reactions” (for reacting to message with emojis), and “Kick Members” (to bad ban members from the channel).

If you scroll up, just above the BOT PERMISSIONS panel, you should see a url, like: `https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=2114&scope=bot`. Paste that url in your browser. If everything’s set up correctly, you should be able to add your bot to your server. And there you go! You created your first Discord bot without writing a single line of code. But right now, it doesn’t do anything. You need to give it a brain.

### Building a Discord Moderator

In this project, our bot’s brain lives in the file `discord.js.`

At the top of the file, we import the Perspective file I talked about earlier:

`const perspective = require('./perspective.js');`

Then we set up an emoji map, which tells the bot how to react when various attributes are detected:

    // Set your emoji "awards" here
    const emojiMap = {
     'FLIRTATION': '💋',
     'TOXICITY': '🧨',
     'INSULT': '👊',
     'INCOHERENT': '🤪',
     'SPAM': '🐟',
    };

Feel free to change those to whatever you’d like.

What we’d like our bot to do is analyze every message in a channel. We do that by creating a new Discord client and passing our developer token (that’s the last line in the file):

    // Log our bot in using the token from https://discordapp.com/developers/applications/me
    const client = new Discord.Client();
    client.login(process.env.DISCORD_TOKEN);

To listen for messages, we write a function that listens on the client `message` event:

    client.on('message', async (message) => {
     // Ignore messages that aren't from a guild
     // or are from a bot
     if (!message.guild || message.author.bot) return;
    
     // If we've never seen a user before, add them to memory
     const userid = message.author.id;
     if (!users[userid]) {
       users[userid] = [];
     }
    
     // Evaluate attributes of user's message
     let shouldKick = false;
     try {
       shouldKick = await evaluateMessage(message);
     } catch (err) {
       console.log(err);
     }
     if (shouldKick) {
       kickBaddie(message.author, message.guild);
       delete users[message.author.id];
       message.channel.send(`Kicked user ${message.author.username} from channel`);
       return;
     }
    
    
     if (message.content.startsWith('!karma')) {
       const karma = getKarma(message);
       message.channel.send(karma ? karma : 'No karma yet!');
     }
    });

There’s a lot going on here.

* On line 4, we make sure that the messages we're analyzing only come from other users (not bots)
* On 8, we allocate some memory to keep track of our users. This is how we'll remember how many emojis we've given them, and how many times they've said toxic things.
* On 14, we call the `evaluateMessage` function, which uses the Perspective API to analyze a user's message. That function (which you can further investigate in the file) passes text to the Perspective API, responds with an emoji reaction if an attribute is found, and counts up the number of times a user has said something toxic. If it's more than `KICK_THRESHOLD`, a value set in our `.env` file, the function returns True (i.e. we should kick the user from the channel).
* On line 19, we actually kick the user from the channel, using the function `kickBaddie`.
* Finally, on line 27, we watch for the "!karma" hot word. If a user types this hot word, we'll send a message with a roundup of the stats for users in the channel.

To really see what's going on here in detail, you'll have to look at the functions `evaluateMessage` and `kickBaddie` in the file. I've added lots of documentation in line. But in a nutshell, that's all there is to it.

So there you go--you have your own AI-powered moderator bot for Discord. What do you think? And what do you want to learn how to build next? Let me know in the comments below, but guess what? Disqus uses the Perspective API to flag toxic comments too. 😉