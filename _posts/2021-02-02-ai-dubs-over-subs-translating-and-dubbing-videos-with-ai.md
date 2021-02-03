---
layout: post
title: AI Dubs Over Subs? Translating and Dubbing Videos with AI
date: 2021-02-02T20:49:32.304Z
description: Use AI-powered translation and text-to-speech to automatically
  translate and "dub" any video.
feature_image: /images/ai-dubs-2-.png
thumbnail_image: /images/ai-dubs-3-.png
tags:
  - nlp
permalink: translate-dub-videos-with-ml
---
Alongside cooking for myself and walking laps around the house, anime (i.e. Japanese cartoons) is something I've learned to love during quarantine.

The problem with watching anime, though, is that short of learning Japanese, you become dependent on human translators and voice actors to port the content to your language. Sometimes you get the subtitles (“subs”) but not the voicing (“dubs”). Other times, entire seasons of shows aren’t translated at all, and you’re left on the edge of your seat with only Wikipedia summaries and 90s web forums to ferry you through the darkness. 

So what are you supposed to do? The answer is obviously not to ask a computer to transcribe, translate, and voice-act entire episodes of a TV show from Japanese to English. Translation is a careful art that can’t be automated, and requires the loving touch of a human hand. Besides, even if you did use machine learning to translate a video, you couldn’t use a computer to dub... I mean, who would want to listen to machine voices for an entire season? It’d be awful. Only a real sicko would want that.

So in this post, I’ll show you how to use machine learning to transcribe, translate, and voice-act videos from one language to another, i.e. “AI-Powered Video Dubs.” It might not get you Netflix-quality results, but you can use it to localize online talks and YouTube videos in a pinch. We’ll start by transcribing audio to text using Google Cloud’s [Speech-to-Text API](https://cloud.google.com/speech-to-text). Next, we’ll translate that text with the [Translate API](https://cloud.google.com/translate). Finally, we’ll “voice act” the translations using the [Text-to-Speech API](https://cloud.google.com/text-to-speech), which produces voices that are, according to the docs, “humanlike.”

(By the way, before you flame-blast me in the comments, I should tell you that YouTube will [automatically and for free](https://support.google.com/youtube/answer/6373554#zippy=%2Cautomatic-captions-on-videos-on-demand) transcribe and translate your videos for you. So you can treat this project like your new hobby of baking sourdough from scratch: a really inefficient use of 30 hours.)

## AI-Dubbed Videos: Do they axe usually sound grood? 

Before you embark on this journey, you probably want to know what you have to look forward to. What quality can we realistically expect to achieve from an ML-video-dubbing pipeline? 

Here's one example dubbed automatically from English to Spanish (the subtitles are also automatically generated in English). I haven't done any tuning or adjusting on it:

<iframe width="560" height="315" src="https://www.youtube.com/embed/cURHKESgNaI" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

As you can see, the transcriptions are decent but not perfect, and the same for the translations. (Ignore the fact that the speaker sometimes speaks too fast--more on that later.) Overall, you can easily get the gist of what's going on from this dubbed video, but it's not exactly near human-quality.

What makes this project trickier (read: more fun) than most is that there are at least three possible points of failure:

1. The video can be incorrectly transcribed from audio to text by the Speech-to-Text API
2. That text can be incorrectly or awkwardly translated by the Translation API
3. Those translations can be mispronounced by the Text-to-Speech API

In my experience, the most successful dubbed videos were those that featured a single speaker over a clear audio stream and that were dubbed from English to another language. This is largely because the quality of transcription (Speech-to-Text) was much higher in English than other source languages.

Dubbing from non-English languages proved substantially more challenging. Here’s one particularly unimpressive dub from Japanese to English of one of my favorite shows, Death Note:

<iframe width="560" height="315" src="https://www.youtube.com/embed/gWNRfeEHmp4" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

If you want to leave translation/dubbing to humans, well--I can't blame you. But if not, read on!

## Building an AI Translating Dubber

As always, you can find all of the code for this project in the [Making with Machine Learning Github repo](https://github.com/google/making_with_ml/tree/master/ai_dubs). To run the code yourself, follow the README to configure your credentials and enable APIs. Here in this post, I’ll just walk through my findings at a high level.

First, here are the steps we'll follow:

1. Extract audio from video files
2. Convert audio to text using the Speech-to-Text API
3. **Split transcribed text into sentences/segments for translation**
4. Translate text
5. Generate spoken audio versions of the translated text
6. **Speed up the generated audio to align with the original speaker in the video**
7. Stitch the new audio on top of the fold audio/video

I admit that when I first set out to build this dubber, I was full of hubris--all I had to do was plug a few APIs together, what could be easier? But as a programmer, all hubris must be punished, and boy, was I punished.

The challenging bits are the ones I bolded above, that mainly come from having to align translations with video. But more on that in a bit.

## Using the Google Cloud Speech-to-Text API

The first step in translating a video is transcribing its audio to words. To do this, I used Google Cloud's [Speech-to-Text API](?utm_source=blog&utm_medium=partner&utm_campaign=CDR_dal_aiml_ai-dubs_020221). This tool can recognize text spoken in 125 languages, but as I mentioned above, the quality is highest in English. For our use case, we'll want to enable a couple of special features, like:

* [Enhanced models](https://cloud.google.com/speech-to-text/docs/enhanced-models?utm_source=blog&utm_medium=partner&utm_campaign=CDR_dal_aiml_ai-dubs_020221). These are Speech-to-Text models that have been trained on specific data types ("video," "phone_call") and are usually higher-quality. We'll use the "video" model, of course.
* Profanity filters. This flag prevents the API from returning any naughty words.
* Word time offsets. This flag tells the API that we want transcribed words returned along with the times that the speaker said them. We'll use these timestamps to help align our subtitles and dubs with the source video.
* [Speech Adaption](https://cloud.google.com/speech-to-text/docs/context-strength?utm_source=blog&utm_medium=partner&utm_campaign=CDR_dal_aiml_ai-dubs_020221). Typically, Speech-to-Text struggles most with uncommon words or phrases. If you know certain words or phrases are likely to appear in your video (i.e. "gradient descent," "support vector machine"), you can pass them to the API in an array that will make the more likely to be transcribed:

```python
client = speech.SpeechClient()  
# Audio must be uploaded to a GCS bucket if it's > 5 min
audio = speech.RecognitionAudio(uri="gs://path/to/my/audio.wav")
    
config = speech.RecognitionConfig(
  language_code="en-US"
  # Automatically transcribe punctuation 
  enable_automatic_punctuation=True,
  enable_word_time_offsets=True,
  speech_contexts=[
    # Boost the likelihood of recognizing these words:
    {"phrases": ["gradient descent", "support vector machine"], 
     "boost": 15}
  ],
  profanity_filter=True,
  use_enhanced="video",
  model="video")

res = client.long_running_recognize(config=config, audio=audio).result()
```

The API returns the transcribed text along with word-level timestamps as JSON. As an example, I transcribed [this video](https://youtu.be/o6nGn1euRjk). You can see the JSON returned by the API in [this gist](https://gist.github.com/dalequark/e983b929b6194adb49d00a9c55ae4e33). The output also lets us do a quick quality sanity check:

*What I actually said:* 

> "Software Developers. We're not known for our rockin' style, are we? Or *are* we? Today, I'll show you how I used ML to make me trendier, taking inspiration from influencers."

*What the API thought I said:*

> "Software developers. We're not known for our Rock and style. Are we or are we today? I'll show you how I use ml to make new trendier taking inspiration from influencers."

In my experience, this is about the quality you can expect when transcribing high-quality English audio. Note that the punctuation is a little off.

At this point, we can use the API output to generate (non-translated) subtitles. In fact, if you run my script with the \`--srt\` flag, it will do exactly that for you ([srt](<https://blog.hubspot.com/marketing/srt-file#:~:text=An%20SRT%20file%20(otherwise%20known,the%20sequential%20number%20of%20subtitles.>) is a file type for closed captions):

```shell
python dubber.py my_movie_file.mp4 "en" outputDirectory --srt --targetLangs ["es"]
```

## Machine Translation

Now that we have the video transcripts, we can use the [Translate API](cloud.google.com/translate?utm_source=blog&utm_medium=partner&utm_campaign=CDR_dal_aiml_ai-dubs_020221) to... uh... translate them. 

This is where things start to get a little 🤪.

Our objective is this: we want to be able translate words in the original video and then play them back at roughly the same point in time, so that my "dubbed" voice is speaking in alignment with my actual voice.

The problem, though, is that translations aren't word-for-word. A sentence translated from English to Japanese may have word order jumbled. It may contain fewer words, more words, different words, or (as is the case with idioms) completely different wording.

One way we can get around this is by translating entire *sentences* and then trying to align the time boundaries of those sentences. But even this becomes complicated, because how do you denote a single sentence? In English, we can split words by punctuation mark, i.e.:

`"Hi! My name is Dale. What's up?" --> ["Hi", "My name is Dale", "What's up"]`

But punctuation differs by language (there's no ¿ in English), and some languages don't seperate sentences by punctuation marks at all.

Plus, in real life speech, we often don't talk in complete sentences. Y'know?

Another wrinkle that makes translating transcripts difficult is that, in general, the *more* context you feed into a translation model, the higher quality translation you can expect. So for example, if I translate the following sentence into French:

"I'm feeling blue, but I like pink too."

I'll get the translation:

"Je me sens bleu, mais j'aime aussi le rose."

This is accurate. But if I split that sentence in two ("I'm feeling blue" and "But I like pink too") and translate each part separately, I get:

"Je me sens triste, mais j'aime aussi le rose", i.e. "I'm feeling sad, but I like pink too."

This is all to say that the more we chop up text before sending it to the Translate API, the worse quality the translations will be (though it'll be more easy to temporally align them with the video).

Ultimately, the strategy I chose was to split up spoken words every time the speaker took a greater-than-one-second pause in speaking. Here's an example of what that looked like:

```json
   {
        "en": "Software developers.",
        "start_time": 0.2,
        "end_time": 1.5,
    },
    {
        "en": "We're not known for our Rock and style. Are we",
        "start_time": 1.6,
        "end_time": 4.4,
    },
    {
        "en": "or are we",
        "start_time": 5,
        "end_time": 6.2,
    },
```

This naturally led to some awkward translations (i.e. "or are we" is a weird fragment to translate"), but I found it worked good enough. [Here's](https://github.com/google/making_with_ml/blob/e653e86e7378b15372ad762b9d61df47d4c4879f/ai_dubs/dubber.py#L157) where that looks like in code.

Side bar: I also noticed that the accuracy of the timestamps returned by the Speech-to-Text API was significantly less for non-English languages, which further decreased the quality of Non-English-to-English dubbing.

### The Media Translation API

As it happens, Google Cloud is working on a new API to handle exactly this problem. It's called the [Media Translation API](https://cloud.google.com/media-translation?utm_source=blog&utm_medium=partner&utm_campaign=CDR_dal_aiml_ai-dubs_020221), and it runs translation on audio directly (i.e. no transcribed text intermediary). I wasn't able to use that API in this project because it doesn't yet return timestamps (the tool is currently in beta), but I think it'd be great to use in future iterations!

## Text-to-Speech

Now for the fun bit--picking out computer voices! If you read about my [PDF-to-Audiobook converter](https://daleonai.com/pdf-to-audiobook), you know that I love me a funny-sounding computer voice. To generate audio for dubbing, I used the Google Cloud [Text-to-Speech API](cloud.google.com/text-to-speech?utm_source=blog&utm_medium=partner&utm_campaign=CDR_dal_aiml_ai-dubs_020221). The TTS API can generate lots of different  voices in different languages with different accents, which you can find and play with [here](https://cloud.google.com/text-to-speech/docs/voices?utm_source=blog&utm_medium=partner&utm_campaign=CDR_dal_aiml_ai-dubs_020221). The "Standard" voices might sound a bit, er, *tinny,* if you know what I mean, but the [WaveNet](https://deepmind.com/blog/article/wavenet-generative-model-raw-audio) voices, which are generated by high-quality neural networks, sound decently human.

Here I ran into another problem I didn't foresee: what if a computer voice speaks a lot slower than a video's original speaker does, and so the generated audio file is too long? Then the dubs would be impossible to align to the source video. Or, what if a translation is more verbose than the original wording, leading to the same problem?

To deal with this issue, I played around with the `speakingRate` parameter available in the Text-to-Speech API. This allows you to speed up or slow down a computer voice:

```python
    # Instantiates a client
    client = texttospeech.TextToSpeechClient()

    # Set the text input to be synthesized
    synthesis_input = texttospeech.SynthesisInput(text="Hello World")

    voice = texttospeech.VoiceSelectionParams(
        language_code=languageCode, name=voiceName
    )

    # Select the type of audio file you want returned
    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3,
        # Speed up or slow down speaking
        speaking_rate=speakingRate 
    )

    # Perform the text-to-speech request on the text input with the selected
    # voice parameters and audio file type
    response = client.synthesize_speech(
        input=synthesis_input,
        voice=voice,
        audio_config=audio_config
    )
```

To get this to work, I used the timestamps from the Speech-to-Text API (used in Step 1) to determine the duration of a sentence in the original video. Then, I called the Text-to-Speech API on the translation of that sentence and measured the dub's duration. If the computer speaker took longer to voice a sentence than the original speaker did, I upped the \`speakingRate\` until the generated audio fit in the bounds of the original audio.

Sound a little complicated? Here's what the code looks like:

```python
def speakUnderDuration(text, languageCode, durationSecs, voiceName=None):
    """Speak text within a certain time limit.
    If audio already fits within duratinSecs, no changes will be made.

    Args:
        text (String): Text to be spoken
        languageCode (String): language code, i.e. "en"
        durationSecs (int): Time limit in seconds
        voiceName (String, optional): See https://cloud.google.com/text-to-speech/docs/voices

    Returns:
        bytes : Audio in wav format
    """
    # First, generate audio with speakingRate = 1
    baseAudio = speak(text, languageCode, voiceName=voiceName)
 
    # Save audio to a temporary file
    f = tempfile.NamedTemporaryFile(mode="w+b")
    f.write(baseAudio)
    f.flush()
 
    # Get the sample's duration
    baseDuration = AudioSegment.from_mp3(f.name).duration_seconds
    f.close()

    # How fast was the generated audio compared to the original?
    ratio = baseDuration / durationSecs

    # if the audio fits, return it
    if ratio <= 1:
        return baseAudio

    # If the base audio is too long to fit in the segment, increase
    # the speaking rate
    ratio = round(ratio, 1)
    # speakingRate must be <= 4
    if ratio > 4:
        ratio = 4
    return speak(text, languageCode, voiceName=voiceName, speakingRate=ratio)
```

This solved the problem of aligning audio to video, but it did sometimes mean the computer speakers in my dubs were a little awkwardly fast.

## Was it worth it?

You know the expression, "Play stupid games, win stupid prizes?" It feels like every ML project I build here is something of a labor of love, but this time, I love my stupid prize: the ability to generate an unlimited number of weird, robotic, awkward anime dubs, that are sometimes kinda decent.