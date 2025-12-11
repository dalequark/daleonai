---
layout: post
title: Reviving Ancient Code with Google Jules
date: 2025-12-10T20:41:03.137-06:00
author: Dale Markowitz
description: Using AI to modernize codebases so old and crufty, just thinking about them makes you want to die.
feature_image: /images/2025-12-10-reviving-ancient-code/header.png
thumbnail_image: /images/2025-12-10-reviving-ancient-code/header.png
tags: ["jules", "ai"]
permalink: reviving-ancient-code/
---

You know that feeling when you code an app, then shelve it for a month (or year) only to return and discover you have no recollection whatsoever how any part of it works? Meanwhile, your codebase has rotted into a cesspit of deprecated dependencies, dependabot alerts, TODOs, and a README so inscrutable you couldn’t run your own code if someone held a gun to your head?

Ha!  Surely that’s never happened to you. _👀_

But for me, reading through my list of Github repos is like sorting rotting corpses in an unmarked grave. I get anxious just thinking about them. So when I decided to revive a handful of old projects (including my blog that’s so ancient, no known version of Ruby will run it)--I knew I needed help.

So I called in [Jules](https://jules.google/).

Jules is Google’s autonomous coding agent powered by Gemini. It’s a chatbot-like-interface that connects directly to GitHub, so you can attach it to a dusty old repo and ask it half-formed questions like:

![](/images/2025-12-10-reviving-ancient-code/image2.png)

And it will tell you:

![](/images/2025-12-10-reviving-ancient-code/image3.png)

Jules is super quick to set up, offers a free tier, and can be accessed entirely through the browser. Then, you can ask Jules to do something like:

![](/images/2025-12-10-reviving-ancient-code/image4.png)

And it will just… modernize your app for you. All on its own.

Now, Jules isn’t the only AI agent that can analyze codebases and write code on your behalf. But what makes it unique is that it actually clones your Github repo, builds and runs it in the cloud (including running tests), and even renders previews of webpages, so that you can launch all sorts of changes and fixes _without ever running your app locally_. (With caveats–more on that later.)

To me, the idea of leaving all the work of fixing old projects to AI sounded a little too good to be true. But I was highly motivated by the possibility of thinking less and building more, so I decided to put Jules to the test.

I set Jules to the task of modernizing eight different outdated projects. Here’s what worked, what didn’t, and what I learned for next time.

## **Assessing the Problem**

Right out of the gate, Jules won me over with three major wins:

1.  Reminding me how my projects worked
2.  Evaluating my old code against modern, state-of-the-art design patterns
3.  Figuring out how difficult it would be to port an old project to a new framework (and whether it was worth updating a project, or rewriting it entirely)

The biggest win of all, though, is that it was able to tell me all of this info _without me ever having to download or install anything_. In fact, you can (and I did) interact with Jules entirely on your phone.

For example, I asked Jules to assess the status of seven code projects in my [making\_with\_ml](https://github.com/google/making_with_ml) mono repo. This repo, which contains now-completely-outdated machine learning projects that went along with my [Making With ML YouTube series](http://bit.ly/gmakingwithml), contains all manner of project: from simple scripts to Jupyter notebooks, Flutter apps, React apps, backends, frontends, cloud configurations–the whole range. So, I thought it was a good candidate to tell me what kind of projects Jules would be good at fixing:

![](/images/2025-12-10-reviving-ancient-code/image9.png)

Jules responded with [this extremely comprehensive Audit Report](https://gist.github.com/dalequark/89640f6f9ead3a941985b255ffc8d9e8). Here’s the start of it:

```markdown
# **Project Audit Report**

Here is an assessment of your legacy projects, how out-of-date they are, and what would be required to bring them into the modern AI era.

## **Summary**

Most of these projects rely on libraries and APIs from 2020-2021. In the world of AI and cloud development, this is a significant gap.

*   Frontend/Backend Frameworks: React, Flutter, and Node.js versions are mostly End-of-Life (EOL) or several major versions behind, requiring significant refactoring (e.g., Flutter Null Safety, Firebase v9+ modular SDK).
*   AI Models: Many projects use specialized, task-specific models (AutoML, Universal Sentence Encoder, COCO-SSD). Today, Multimodal LLMs (like Gemini 1.5 or GPT-4o) can often replace these entire pipelines with a single API call.
```
Then it went through each project, identifying its issues, suggesting upgrade paths, and ultimately assigning a “verdict”: should the product be updated, refactored, rewritten or completely abandoned?

| **Project Name** | **Status** | **Verdict** |
| --- | --- | --- |
| ai\_dubs | ⚠️ Moderately Outdated | **Refactor** |
| discord\_moderator | ☠️ Defunct (Major Rewrite Needed) | **Abandon & Rewrite** |
| instafashion | ⚠️ Heavily Outdated / Deprecated | **Abandon** |
| petcam | 🟠 Outdated (Frontend & Backend) | **Updateable** |
| semantic\_ml | 🟠 Outdated Model | **Replace Logic** |
| sports\_ai | ⚠️ Complex & Deprecated Dependencies | **Rewrite** |
| video\_archive | 🔴 Critical Updates Needed | **Abandon / Concept Port** |

Then, for each individual project, it gave me an in-depth description of what I’d have to do to “modernize it." To give just one example:
```markdown
## 1\. ai\_dubs **(Video Dubbing & Translation)**

Status: ⚠️ Moderately Outdated

*   Tech Stack: Python 3, Google Cloud Speech-to-Text / Text-to-Speech / Translation.
*   Issues:

*   Dependencies in requirements.txt are from early 2021 (e.g., pandas 1.2.0).
*   Uses pydub and moviepy which handle media well but may have API changes in newer versions.

*   Modern AI Upgrade:

*   Then: Chaining three separate APIs (Speech -> Text -> Translate -> Speech).
*   Now: Use a Multimodal Model (like Gemini 1.5 Pro) to ingest the video directly and output a translated script with timestamps, or use dedicated dubbing AI services (like ElevenLabs) that preserve voice characteristics.

*   Verdict: Refactor. The core logic is sound, but replacing the complex API chaining with a modern multimodal pipeline would simplify the code by 50%+.
```

## **Executing the Plan**

This assessment was all very well and good, but what happened when I told Jules to go ahead and modernize all these projects for me–even ones that were totally ☠️ Defunct? I knew I was insane to hope that Jules would solve all of my problems without me ever interceding--and I wasn't wrong. I _did_ have to help out at some points. Still, Jules was a big win for many projects, and for others, a major step forward. Here's how it went.

## **The Wins**

### **Migrating to Modern APIs and Libraries**

Several of my projects used APIs or libraries that have either been updated, deprecated, or entirely replaced with better methods. Take [ai_dubs](https://github.com/dalequark/making_with_ml/tree/master/ai_dubs). This script automatically translated and dubbed videos (a vestige of my short-lived quarantine anime phase). Back then, I  accomplished this feat by chaining together three different AI APIs (Speech -> Text -> Translate -> Speech). Jules identified I could replace these chained calls with one Multimodal Model. Better, it was able to make this fix _almost_ entirely on its own (I had to manually tell it which Gemini model  to use, but that was it). In general, Jules was good at updating libraries, replacing outdated tools with more modern ones (i.e. TensorFlow embeddings → Gemini embeddings), and implementing new syntax and best practices.

If you're curious how I intervened when it _did_ make an error, I just commented on its PR, like I would for any other PR:

![Screenshot of a GitHub pull request comment showing a user's feedback to an AI-generated code change.](/images/2025-12-10-reviving-ancient-code/image10.png)
_My comment on Jules's pull request, asking for  README. The side-eye emoji under my comment tells me that Jules is on the job_


### **Adding and Running Tests**

One of the perks of Jules running its own virtual environment is that it can do extensive testing on its own code changes. Testing was something that was sorely lacking in my old projects (Shh! Don’t tell!), so I found it helpful to ask Jules to write tests, then run them for me. (Sure, this is not the world's BEST testing practice, but compared to absolutely no tests, it was an improvement.) Even more useful, Jules was able to configure Github Actions to run my tests every time it made a pull request. Once I figured this out Jules-to-Github Actions workflow was a thing, I started using it in all my prompts. It made it way easier for me to verify that Jules had successfully modernized a project, without me even having to run testing locally.

![Screenshot showing GitHub actions running AI-generated tests.](/images/2025-12-10-reviving-ancient-code/image11.png)
_Jules configured Github Actions to run tests every time it made a pull request. For my AI dubber, the tests also dubbed a video and uploaded it as a GitHub artifact so I could watch the thing and verify it was working as expected._

### **Migrating to New Frameworks**

Switching out a library is one thing, but how about upgrading to an entirely new framework? 

This was the kind of complete overhaul my old blog needed. It was running on a version of Jekyll so old that no known version of Ruby could run it. So, I asked Jules to come up with a migration plan that ported my blog to a more modern blog framework ([Eleventy](https://www.11ty.dev/)) that would run on a new hosting platform (Vercel instead of GitHub pages). I chose this framework, Eleventy, only because Jules recommended it. I knew next to zero about it, so I was really depending on Jules to make this thing happen, since I'd be useless.

This Eleventy migration was one of Jules's biggest wins, in my book. With very few hiccups, it was able to modernize my blog. I think it had a few things going in its favor:
- My blog is a static site: every single part of it lives in its Github repo. There are no complicated external dependencies like databases or APIs or cloud configurations to worry about. That meant that Jules was able to test every piece of my blog within its VM environment--including doing a visual inspection:

![Screenshot showing Jules inspecting a static site.](/images/2025-12-10-reviving-ancient-code/image12.png)
_Jules was able to test every piece of my blog within its VM environment--including doing a visual inspection._

- Since I decided to host my blog on [Vercel](https://vercel.com), I got to take advantage of Vercel's PR preview feature--it automatically built and deployed every one of Jules's pull requests to a preview URL. This made verifying Jules's work fast, with no local pulling required. (If you're using a cloud-based AI agent, I highly recommend a deployment workflow with instant previews, like Vercel!)

Finally, to be extra sure I didn't break anything in the migration, I asked Jules to do an independent pass to check for potential errors. I was glad I did:

![Screenshot showing Jules inspecting a static site.](/images/2025-12-10-reviving-ancient-code/image14.png)
_On a second pass, Jules identified a few small issues, like SEO tagging, it missed in the initial migration._


### **Facelift**

Though it's not exactly a necessary part of _modernization_, I also used Jules to give my blog a frontend facelift. I'll say more about that in a future post, but I thought I'd mention it here because successful Jules was at applying styles from a mockup to my site:

![Screenshot showing Jules applying style changes to a site.](/images/2025-12-10-reviving-ancient-code/image6.png)
_I put all my frontend mocks in a folder in my repo and told Jules to implement them._

![Screenshot showing Jules inspecting a static site.](/images/2025-12-10-reviving-ancient-code/image5.png)
_Thanks to visual inspection, Jules was able to verify it updated the styles._

## Challenges and Takeaways

While Jules was great at modernizing many of my old projects, it wasn't _all_ flowers and sunshine. Especially when it came to: 

### **Complicated Cloud Infrastructure**

Many of my projects were built with stateful external dependencies, like Google Cloud Storage buckets, databases, Firebase storage, and so on. It's not that Jules can't work with these types of projects--it _can_ (in fact, it can even call APIs and use `gcloud`, if you set up the right environment variables)--but it just wasn't as easy for me to effortlessly _test_ Jules's output in these cases. That's why, for example, I abandoned modernizing my `instafashion` project--I didn't want to deal with running batch scripts, filling buckets with test data, enabling cloud APIs, etc. Moving some of this cloud config to terraform might have helped, but for now, I left this one as a `STATUS: WILL NOT FIX`.

### **Lots of Little Updates**
Jules is an _asynchronous_ agent. It's meant to work on its own thing while you do _your_ own thing--without constant feedback and interruption. If you want to make a lot of little changes and see the results instantly, Jules is not your tool. For that, it's better to switch to something like [AntiGravity](https://antigravity.dev) (Google's AI-augmented IDE) or [AI Studio](https://ai.studio). In my own case, I found that I would use Jules to make big sweeping first passes, then "fine tune" its results with a more reactive tool.

## **In Conclusion**

I didn't manage to resurrect every single corpse in my GitHub graveyard, but maybe some projects are best left to rest in peace. Meanwhile, Jules made the whole modernization process a whole lot easier. 