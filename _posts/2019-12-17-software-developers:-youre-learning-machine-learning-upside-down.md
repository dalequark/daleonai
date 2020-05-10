---
layout: post
title: "Software Developers: You’re Learning Machine Learning Upside Down"
description: "Most of us learn Machine Learning from the ground up. But the skills developers need to be effective users of ML is something totally different. So what should the forward-looking software engineer learn about AI today?"
date: 2019-12-17
feature_image: 
tags: []
---
    
    
{% include image_caption.html imageurl="/images/2019-12-17-software-developers:-youre-learning-machine-learning-upside-down/0.jpg" title="Don’t be this guy." caption="Don’t be this guy." %}

_Most of us learn Machine Learning from the ground up. But the skills developers need to be effective users of ML is something totally different. So what should the forward-looking software engineer learn about AI today?_

<!--more-->

I remember the first time I ever tried to learn to code. I was in middle school, and my dad, a programmer himself, pulled open a text editor and typed this on the screen:

```
public class HelloWorld {  
    public static void main(String\[\] args) {    
        System.out.println("Hello World.");  
    }  
}
```

“Excuse me?” I said.

“It prints ‘Hello World’,” he replied.

“What’s public? What’s class? What’s static? What’s — “

“Ignore that for now. It’s just boilerplate.”

But I was pretty freaked out by all that so-called boilerplate I didn’t understand, and so I set out to learn what each one of those keywords meant. That turned out to be complicated and boring, and pretty much put the kibosh on my young coder aspirations.

It’s immensely easier to learn software development today than it was when I was in high school, thanks to sites like [codecademy.com](http://codecademy.com), the ease of setting up basic development environments, and a general [sway towards teaching high-level, interpreted languages](https://insights.dice.com/2014/07/09/python-popular-languages-college-intro-courses/) like Python and Javascript. You can go from knowing nothing about coding to writing your first conditional statements in a browser in just a few minutes. No messy environmental setup, installations, compilers, or boilerplate to deal with — you can head straight to the juicy bits.

This is exactly how humans learn best. First, we’re taught core concepts at a high level, and only _then_ can we appreciate and understand under-the-hood details and why they matter. We learn Python, _then_ C, _then_ assembly, not the other way around.

Unfortunately, lots of folks who set out to learn Machine Learning today have the same experience I had when I was first introduced to Java. They’re given all the low-level details up front — layer architecture, back-propagation, dropout, etc — and come to think ML is really complicated and that maybe they should take a linear algebra class first, and give up.

That’s a shame, because in the very near future, most software developers effectively using Machine Learning aren’t going to have to think or know about any of that low-level stuff. Just as we (usually) don’t write assembly or implement our own TCP stacks or encryption libraries, we’ll come to use ML as a tool and leave the implementation details to a small set of experts. At that point — after Machine Learning is “democratized” — developers will need to understand not implementation details but instead best practices in deploying these smart algorithms in the world.

Where We Are Now
----------------

Today, if you want to build a neural network that recognizes your cat’s face in photos or predicts whether your next Tweet will go viral, you’d probably set off to learn either [TensorFlow](http://tensorflow.org) or [PyTorch](http://pytorch.org). These Python-based deep learning libraries are the most popular tools for designing neural networks today, and they’re both under 5 years old.

In its short lifespan, TensorFlow has already become way, _wa_y more user-friendly than it was five years ago. In its early days, you had to understand not only Machine Learning but also distributed computing and deferred graph architectures to be an effective TensorFlow programmer. Even writing a simple print statement was a challenge.

{% include image_caption.html imageurl="/images/2019-12-17-software-developers:-youre-learning-machine-learning-upside-down/1" title="Breakdown of Keras/TensorFlow/PyTorch popularity, courtesy [this](https://www.quora.com/What-are-the-major-differences-between-TensorFlow-Keras-and-PyTorch) Quora answer." caption="Breakdown of Keras/TensorFlow/PyTorch popularity, courtesy [this](https://www.quora.com/What-are-the-major-differences-between-TensorFlow-Keras-and-PyTorch) Quora answer." %}



Just earlier this fall, TensorFlow 2.0 officially launched, making the framework significantly more developer-friendly. Here’s what a Hello-World-style model looks like in TensorFlow 2.0:

If you’ve designed neural networks before, the code above is straight-forward and readable. But if you haven’t or you’re just learning, you’ve probably got some questions. Like, what is Dropout? What are these dense layers, how many do you need and where do you put them? What’s `sparse_categorical_crossentropy`? TensorFlow 2.0 removes some friction from building models, but it doesn’t abstract away designing the actual architecture of those models.

Where We’re Going
-----------------

So what will the future of easy-to-use ML tools look like? It’s a question that everyone from Google to Amazon to Microsoft and Apple are spending clock cycles trying to answer. Also — disclaimer — it is what _I_ spend all my time thinking about as an engineer at Google.

For one, we’ll start to see many more developers using pre-trained models for common tasks, i.e. rather than collecting our own data and training our own neural networks, we’ll just use Google’s/Amazon’s/Microsoft’s models. Many cloud providers already do something like this. For example, by hitting a Google Cloud REST endpoint, you can use a pre-trained neural networks to:

*   Extract text from images
*   Tag common objects in photos
*   Convert speech to text
*   Translate between languages
*   Identify the sentiment of text
*   And more

You can also run pre-trained models on-device, in mobile apps, using tools like Google’s [ML Kit](https://developers.google.com/ml-kit) or Apple’s [Core ML](https://www.google.com/search?q=apple+ml+core&oq=apple+ml+core&aqs=chrome..69i57j69i60l2j69i65j69i60l3.1240j0j7&sourceid=chrome&ie=UTF-8).

The advantage to using pre-trained models over a model you build yourself in TensorFlow (besides ease-of-use) is that, frankly, you probably cannot personally build a model more accurate than one that Google researchers, training neural networks on a whole Internet of data and tons GPUs and [TPUs](https://en.wikipedia.org/wiki/Tensor_processing_unit), could build.

The disadvantage to using pre-trained models is that they solve generic problems, like identifying cats and dogs in images, rather than domain-specific problems, like identifying a defect in a part on an assembly line.

But even when it comes to training custom models for domain-specific tasks, our tools are becoming much more user-friendly.

{% include image_caption.html imageurl="/images/2019-12-17-software-developers:-youre-learning-machine-learning-upside-down/2" title="Screenshot of Teachable Machine, a tool for building vision, gesture, and speech models in the browser." caption="Screenshot of Teachable Machine, a tool for building vision, gesture, and speech models in the browser." %}



Google’s free [Teachable Machine](https://teachablemachine.withgoogle.com/) site lets users collect data and train models in the browser using a drag-and-drop interface. Earlier this year, MIT released a similar [code-free interface](http://news.mit.edu/2019/drag-drop-data-analytics-0627) for building custom models that runs on touchscreen devices, designed for non-coders like doctors. [Microsoft](https://azure.microsoft.com/en-us/services/machine-learning-studio/) and startups like [lobe.ai](https://lobe.ai/) offer similar solutions. Meanwhile, [Google Cloud AutoML](https://cloud.google.com/automl/) is an automated model-training framework for enterprise-scale workloads.

What to Learn Now
-----------------

As ML tools become easier to use, the skills that developers hoping to use  this technology (but not become specialists) will change. So if you’re trying to plan for where, Wayne-Gretsky-style, the puck is going, what should you study now?

**Knowing When to Use Machine Learning Will Always Be Hard**

What makes Machine Learning algorithms distinct from standard software is that they’re probabilistic. Even a highly accurate model will be wrong some of the time, which means it’s not the right solution for lots of problems, especially on its own. Take ML-powered speech-to-text algorithms: it might be okay if occasionally, when you ask Alexa to “Turn off the music,” she instead sets your alarm for 4 AM. It’s not ok if a medical version of Alexa thinks your doctor prescribed you Enulose instead of Adderall.

Understanding when and how models should be used in production is and will always be a nuanced problem. It’s especially tricky in cases where:

1.  Stakes are high
2.  Human resources are limited
3.  Humans are biased or inaccurate in their own predictions

Take medical imaging. We’re globally short on doctors and ML models are often [more accurate](https://medium.com/how-machine-learning-is-transforming-healthcare-at-google-and-beyond-d4f664b7e27c) than trained physicians at diagnosing disease. But would you want an algorithm to have the last say on whether or not you have cancer? Same thing with models that help judges decide jail sentences. [Models can be biased](https://www.technologyreview.com/s/612775/algorithms-criminal-justice-ai/), but so are people.

Understanding when ML makes sense to use as well as how to deploy it properly isn’t an easy problem to solve, but it’s one that’s not going away anytime soon.

**Explainability**

Machine Learning models are notoriously opaque. That’s why they’re sometimes called “black boxes.” It’s unlikely you’ll be able to convince your VP to make a major business decision with “my neural network told me so” as your only proof. Plus, if you don’t understand why your model is making the predictions it is, you might not realize it’s making biased decisions (i.e. denying loans to people from a specific age group or zip code).

It’s for this reason that so many players in the ML space are focusing on building “Explainable AI” features — tools that let users more closely examine what features models are using to make predictions. We still haven’t entirely cracked this problem as an industry, but we’re making progress. In November, for example, Google launched a suite of explainability tools as well as something called [Model Cards](https://modelcards.withgoogle.com/face-detection) — a sort of visual guide for helping users understand the limitations of ML models.

{% include image_caption.html imageurl="/images/2019-12-17-software-developers:-youre-learning-machine-learning-upside-down/3.png" title="Google’s Facial Recognition Model Card shows the limitations of this particular model." caption="Google’s Facial Recognition Model Card shows the limitations of this particular model." %}



**Getting Creative with Applications**

There are a handful of developers good at Machine Learning, a handful of researchers good at neuroscience, and very few folks who fall in that intersection. This is true of almost any sufficiently complex field. The biggest advances we’ll see from ML in the coming years likely won’t be from improved mathematical methods but from people with different areas of expertise learning at least enough Machine Learning to apply it to their domains. This is mostly the case in medical imaging, for example, where the [most exciting breakthroughs](https://medium.com/how-machine-learning-is-transforming-healthcare-at-google-and-beyond-d4f664b7e27c) — being able to spot pernicious diseases in scans — are powered not by new neural network architectures but instead by fairly standard models applied to a novel problem. So if you’re a software developer lucky enough to possess additional expertise, you’re already ahead of the curve.

* * *

This, at least, is what _I_ would focus on today if I were starting my AI education from scratch. Meanwhile, I find myself spending less and less time building custom models from scratch in TensorFlow and more and more time using high-level tools like AutoML and AI APIs and focusing on application development.

But that’s just me — what do you think? Let me know in the comments below.

* * *

Thanks for feedback [Sara Robinson](https://medium.com/u/7f2ab73b39f8?source=post_page-----3867dc140862----------------------) and [Joshua Gordon](https://medium.com/u/4dde9eebddbd?source=post_page-----3867dc140862----------------------) !
