---
layout: post
title: I Built an AI Stylist Inspired by Social Media
date: 2020-10-28T19:16:29.745Z
description: I let an AI pick out my outfits using computer vision and pictures
  of social media fashion influencers.
feature_image: /images/ai-stylist.png
thumbnail_image: /images/ai-stylist-thumb.png
tags:
  - computer vision
  - machine learning
  - google cloud
permalink: social-media-fashion-ai/
---
Last year, in a universe where it still made sense to own pants, I decided to hire a personal stylist. 

In our first appointment, the stylist came to my apartment and took pictures of every clothing item I owned.

In our second appointment, she met me at Nordstrom's, where she asked me to try on a $400 casual dress, a $700 blazer, and $300 sneakers. (I never thought to ask if she worked on commission.)

But only after our third and final appointment, when she finally sent me a folder full of curated "looks" made from my new and old clothing items, did it finally click: I'd just blown a *lot* of money.

I had a suspicion we were on different pages when, as we walked through the shoes section at Nordstrom, the stylist said, "The problem with you people in tech is that you're always looking for some kind of theory or strategy or formula for fashion*.* But there is no formula--it's about *taste*.*"*

Pfffft. We'll see about *that*! 

I returned the pricey clothing and decided to build my own (cheaper!) AI-powered stylist. In this post, I'll show you how you can, too.

*Want to see a video version of this post? Check out:*

<iframe width="560" height="315" src="https://www.youtube.com/embed/o6nGn1euRjk" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

My AI Stylist was half based on this smart closet from the movie *Clueless*:

<iframe src="https://giphy.com/embed/l0IulEDITBSPyt1BK" width="480" height="270" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>

and half based on the idea that one way to dress fashionably is to copy fashionable people. Particularly, fashionable people on Instagram.

The app pulls in the Instagram feeds of a bunch of fashion "influencers" on Instagram and combines them with pictures of clothing you already own to recommend you outfits. Here's what it looks like: 

![Screenshot of the AI Stylist](/images/mismatch_ui.png "AI Stylist UI")

(You can also check out the live app [here](http://mismatch.daleonai.com/).)

On the left pane--the closet screen--you can see all the clothing items I already own. On the right pane, you'll see a list of Instagram accounts I follow for inspiration. In the middle pane (the main screen), you can see the actual outfit recommendations the AI made for me. The Instagram inspiration picture is at the top, and items for my closet are shown below:

![Screenshot of swiping through outfit recommendations in the app](/images/mismatch.gif "Outfits recommended by the AI Stylist")

Here my style muse is Laura Medalia, an inspiring software developer who's [@codergirl_](https://www.instagram.com/codergirl_/) on Instagram (make sure to follow her for fashion and tips for working in tech!).

The whole app took me about a month to build and cost ~$7.00 in Google Cloud credits (more on pricing later). Let's dive in.

## The Architecture

I built this app using a combination of [Google Cloud Storage](https://cloud.google.com/storage/?utm_source=google&utm_medium=cpc&utm_campaign=na-US-all-en-dr-bkws-all-all-trial-e-dr-1009135&utm_content=text-ad-none-any-DEV_c-CRE_79747411687-ADGP_Hybrid+%7C+AW+SEM+%7C+BKWS+%7C+US+%7C+en+%7C+EXA+~+Google+Cloud+Storage-KWID_43700007031545851-kwd-11642151515&utm_term=KW_google%20cloud%20storage-ST_google+cloud+storage&gclid=CjwKCAjww5r8BRB6EiwArcckC8WRFN95onXmZi1ly_pfNslOQMjZ6Ex03ypCr7irmeuzPsrDydBL8xoCUV8QAvD_BwE), [Firebase](firebase.com), and Cloud Functions for the backend, [React](https://reactjs.org/) for the frontend, and the [Google Cloud Vision API](https://goo.gle/3e61wwb) for the ML bits. I divided the architecture into two bits.

First, there's the *batch process*, which runs every hour (or however frequently you like) in the Cloud:

![Diagram of batch process for making outfit recommendations](/images/pxl_20201014_203905793.jpg "The \\\\\\\\\\\\"batch process\\\\\\\\\\\\" makes outfit recommendations using AI")

"Batch process" is just a fancy way of saying that I wrote a Python script which runs on a scheduled interval (more on that later). The process:

1. Pulls photos from social media
2. Uses the Vision API's [Product Search](https://goo.gle/3otRoCi) feature to find similar items in my closet
3. Scores the matches (i.e. of all the social media pictures, which can I most accurately recreate given clothing in my closet?)
4. Writes the matches to [Firestore](https://firebase.google.com/docs/firestore)

This is really the beefy part of the app, where all the machine learning magic happens. The process makes outfit recommendations and writes them to Firestore, which is my favorite ever lightweight database for app development (I use it in almost all my projects). 

The actual *app* (in this case, just a responsive web app) is simple: it just reads the outfit recommendations from Firestore and displays them in a pretty interface:

![Architecture diagram of a web app reading from Firestore](/images/pxl_20201014_204154884.jpg "The web app just displays data from Firestore")

Let's take a look!

## Grabbing Social Media Data

Ideally, I wanted my app to pull pictures from Instagram automatically, based on which accounts I told it to follow. Unfortunately, Instagram doesn't have an API (and using a [scraper](https://github.com/arc298/instagram-scraper) would violate their TOS). So I specifically asked Laura for permission to use her photos. I downloaded them to my computer and then uploaded them to a [Google Cloud Storage bucket](https://cloud.google.com/storage/?utm_source=google&utm_medium=cpc&utm_campaign=na-US-all-en-dr-bkws-all-all-trial-e-dr-1009135&utm_content=text-ad-none-any-DEV_c-CRE_79747411447-ADGP_Hybrid+%7C+AW+SEM+%7C+BKWS+%7C+US+%7C+en+%7C+EXA+~+Google+Cloud+Storage-KWID_43700007031545851-kwd-11642151515&utm_term=KW_google%20cloud%20storage-ST_google+cloud+storage&gclid=CjwKCAjw5p_8BRBUEiwAPpJO6xIv5t69bTUdDMVgY_7hC04hj1xyRz-o90_T3a332_F-QUqmofOeqhoCneUQAvD_BwE):

```shell
# Create a cloud storage bucket
gsutil mb gs://inspo-pics-bucket

# Upload inspiration pics 
gsutil cp path/to/inspo/pics/*.jpg gs://inspo-pics-bucket
```

## Filtering for Fashion Pics

I like Laura's account for inspiration because she usually posts pictures of herself in head-to-toe outfits (shoes included). But some pics on her account are more like this:

![Dog in front of a laptop](/images/doggy.jpg "Laura's cute pooch")

Adorable, yes, but I can't personally pull off the dressed-in-only-a-collar look. So I needed some way of knowing which pictures contained outfits (worn by people) and which didn't.

For that, I turned to my trusty steed, the [Google Cloud Vision API](https://goo.gle/3e61wwb) (which I use in many different ways for this project). First, I used its **classification** feature, which assigns labels to an image. Here's the labels it gives me for a picture of myself, trying to pose as an influencer:

![Screenshot of the Vision API analyzing an outfit](/images/screen-shot-2020-10-15-at-11.43.18-am.png "The Vision API returns lots of labels for this photo")

The labels are ranked by how confident the model is that they're relevant to the picture. Notice there's one label called "Fashion" (confidence 90%). To filter Laura's pictures, I labeled them all with the Vision API and removed any image that didn't get a "Fashion" label. Here's the code:

```python
from google.cloud import vision
from google.cloud.vision import types

# Path to all my inspo pics in the cloud
uris = [
  "gs://inspo-pics-bucket/pic1.jpg", 
  "gs://inspo-pics-bucket/pic2.jpg",
  ...
 ]

# Create a Vision API Client
client = vision.ImageAnnotatorClient()

# Keep track of all the fashion pics
fashionPics = []

for uri in uris:
  image_source = vision.types.ImageSource(image_uri="gcs/path/to/file")
  labels = client.label_detection(image=image).label_annotations
  # Only save images that have the label "Fashion"
  if any([x.description == "Fashion" for x in labels]):
    fashionPics.append(uri)
```

If you want the full code, check it out [here](https://github.com/google/making_with_ml/tree/master/instafashion).

## Digitizing my Closet

Now the goal is to have my app look at Laura's fashion photos and recommend me items in my closet I can use to recreate them. For that, I had to take a pictures of item of clothing I owned, which would have been a pain except I happen to have a very lean closet.

I hung each item up on my mannequin and snapped a pic.

![gif of trying different outfits on a mannequin and taking pictures](/images/photos_of_closet.gif "Photographing clothing for my dataset")

## Using the Vision Product Search API

Once I had all of my fashion inspiration pictures and my closet pictures, I was ready to start making outfit recommendations using the [Google Vision Product Search API](https://goo.gle/3otRoCi).

This API is designed to power features like "similar product search." Here's an example from the Pinterest app:

![Screenshot of Pinterest's similar item search feature](/images/pinterest.png "Screenshot of Pinterest's similar item search feature")

IKEA also built a nice demo that allows customers to search their products via images with this kind of tech:

![Video of customer searching an IKEA product catalog by photo](/images/ikea_gif.gif "Original image from TechCrunch")

I'm going to use the Product Search API in a similar way, but instead of connecting a product catalog, I'll use my own wardrobe, and instead of recommend similar individual *items*, I'll recommend entire outfits.

To use this API, you'll want to:

1. Uploading your closet photos to Cloud Storage
2. Create a new Product Set using the Product Search API
3. Create a new product for each item in your closet
4. Upload (multiple) pictures of those products

At first I attempted this using the [official Google Python client library](https://cloud.google.com/vision/product-search/docs/libraries?utm_campaign=dama_awareness_visionprod_102620&utm_source=da&utm_medium=blog), but it was a bit clunky, so I ended up writing my own Python Product Search wrapper library, which you can find [here](https://pypi.org/project/pyvisionproductsearch/) (on PyPi). Here's what it looks like in code:

```python
from visionproductsearch.ProductSearch import ProductSearch, ProductCategories

# Initialize ProductSearch with your credentials
# Pass a path to the storage bucket where you'd like to save image files
ps = ProductSearch(`my_gcp_project_id`, 'us-west1', 'path/to/creds.json', 'my_gcp_bucket_name' )

# Create a new product set
productSet = ps.createProductSet('my_test_set')

# Create a new product
product = ps.createProduct('my_fancy_shirt', ProductCategories.APPAREL)

# Add a reference image to a product
product.addReferenceImage('./skirt_pic.jpg')

# List all reference images for a product
for img in product.listReferenceImages():
    print(img)

# Add a product to a product set
product.addProduct(product)

# List all products in a product set
for p in productSet.listProducts():
    print(p)

# Search for similar products by image
productSet.search(ProductCategories.APPAREL, file_path='img/to/search.jpg')
```

Note this wrapper library **handles uploading photos to a Cloud Storage bucket automatically**, so you can upload a new clothing item to your product set from a local image file:

```python
# Create a new product
product = ps.createProduct('my_fancy_shirt', ProductCategories.APPAREL)

# Add a reference image to a product
product.addReferenceImage('./skirt_pic.jpg')
```

If you, dear reader, want to make your own product set from your own closet pics, I wrote a [Python script](https://github.com/google/making_with_ml/blob/master/instafashion/scripts/product_set_from_dir.py) to help you make a product set from a folder on your desktop. Just:

1. Download the code from GitHub  and navigate to the instafashion/scripts folder:

```shell
# Download the code 
git clone git@github.com:google/making_with_ml.git

# CD into the right folder
cd making_with_ml/instafashion/scripts
```

2. Create a new folder on your computer to store all your clothing items (mine's called `my_closet`):

```shell
mkdir my_closet
cd my_closet
```

3. Create a new folder for each clothing item and put all of your pictures of that item in the folder:

![Create a folder for each clothing item](/images/local_closet.gif "Create a folder for each clothing item")

So in the gif above, all my black bomber pics are in a folder named `black_bomber_jacket`.

To use my script, you'll have to name your product folders using the following convention: `name_of_your_item_shoe` where `shoe` can be any of `[skirt, dress, jacket, top, shoe, shorts, scarf, pants]`.

![](/images/screen-shot-2020-10-28-at-4.49.16-pm.png)

4. After creating your directory of product photos, you'll need to set up some config by editing the \`.env_template\` file:

```powershell
cp .env_template .env

# In the .env file, fill out these fields:
export PROJECTID="YOUR_GCP_PROJECT_ID"
export BUCKET="YOUR_CLOSET_STORAGE_BUCKET"
export CREDS="path/to/key.json"
export CLOSET_DIR="./my_closet"
export PRODUCT_SET="PRODUCT_SET_NAME"
```

(Oh, by the way: you need to have a Google Cloud account to use this API! Once you do, you can create a new project and download a credentials file.)

5. Then install the relevant Python libraries and run the script `product_set_from_dir.py`:

```powershell
> pip install -r requirements.txt
> python product_set_from_dir.py
"Added 200 products to set"
```

Phew, that was more steps than I thought! 

When you run that Python script, `product_set_from_dir.py`, your clothing photos get uploaded to the cloud and then processed or "indexed" by the Product Search API. The indexing process can take up to 30 minutes, so go fly a kite or something.

## Searching for Similar Items

Once your product set is done indexing, you can start using it to search for similar items. Woohoo! 🎊

In code, just run:

```python
# Create a Product Search client
ps = ProductSearch("YOUR_GCP_PROJECTID", "path/to/creds.json", "YOUR_CLOSET_BUCKET")
# Grab the product set you just created
productSet = ps.getProductSet("YOUR_PRODUCT_SET_NAME")

# Call "search" with a path to an inspiration picture
results = ProductSet.search(ProductCategories.APPAREL, image_uri="gs://path/to/inspo.jpg")

''' Returns:
{'score': 0.7648860812187195,
  'label': 'Shoe',
  'matches': [{'product': <pyvisionproductsearch.ProductSearch.ProductSearch.Product at 0x14992d2e0>,
    'score': 0.35719582438468933,
    'image': 'projects/yourprojectid/locations/us-west1/products/high_rise_white_jeans_pants/referenceImages/6550f579-6b26-433a-8fa6-56e5bbca95c1'},
   {'product': <pyvisionproductsearch.ProductSearch.ProductSearch.Product at 0x14992d5b0>,
    'score': 0.32596680521965027,
    'image': 'projects/yourprojectid/locations/us-west1/products/white_boot_shoe/referenceImages/56248bb2-9d5e-4004-b397-6c3b2fb0edc3'},
   {'product': <pyvisionproductsearch.ProductSearch.ProductSearch.Product at 0x14a423850>,
    'score': 0.26240724325180054,
    'image': 'projects/yourprojectid/locations/us-west1/products/tan_strap_sandal_shoe/referenceImages/f970af65-c51e-42e8-873c-d18080f00430'}],
  'boundingBox': [x: 0.6475263833999634
  y: 0.8726409077644348
  , x: 0.7815263271331787
  y: 0.8726409077644348
  , x: 0.7815263271331787
  y: 0.9934644103050232
  , x: 0.6475263833999634
  y: 0.9934644103050232
  ]},
 {'score': 0.8066604733467102,
  'label': 'Shorts',
  'matches': [{'product': <pyvisionproductsearch.ProductSearch.ProductSearch.Product at 0x106a4fa60>,
    'score': 0.27552375197410583,
    'image': 'projects/yourprojectid/locations/us-west1/products/white_sneaker_shoe_*/referenceImages/a109b530-56ff-42bc-ac73-d60578b7f363'},
   {'product': <pyvisionproductsearch.ProductSearch.ProductSearch.Product at 0x106a4f400>,
    'score': 0.2667400538921356,
    'image': 'projects/yourprojectid/locations/us-west1/products/grey_vneck_tee_top_*/referenceImages/cc6f873c-328e-481a-86fb-a2116614ce80'},
   {'product': <pyvisionproductsearch.ProductSearch.ProductSearch.Product at 0x106a4f8e0>,
    'score': 0.2606571912765503,
    'image': 'projects/yourprojectid/locations/us-west1/products/high_rise_white_jeans_pants_*/referenceImages/360b26d8-a844-4a83-bf97-ef80f2243fdb'},
   {'product': <pyvisionproductsearch.ProductSearch.ProductSearch.Product at 0x106a4fb80>],
  'boundingBox': [x: 0.4181176424026489
  y: 0.40305882692337036
  , x: 0.6837647557258606
  y: 0.40305882692337036
  , x: 0.6837647557258606
  y: 0.64000004529953
  , x: 0.4181176424026489
  y: 0.64000004529953
  ]}]
  '''
```

The response contains lots of data, including which items were recognized in a the source photo (i.e. "skirt", "top") and what items in your project set matched with them. The API also returns a "score" field for each match which tells you how confident the the API is that an item in your product set matched the picture.

## From Matching Items to Matching Outfits

The Product Search API looks at an inspiration picture (in this case, Laura's fashion pics) and finds similar items in my wardrobe. But what I really want to do is put together whole *outfits*, which consist of a single top, a single pair of pants, a single set of shoes, etc. Sometimes the Product Search API doesn't return a logical outfit. For example, if Laura is wearing a long shirt that looks like it could *almost* be a dress, the API might return both a similar shirt and dress in my wardrobe. To get around that, I had to write my own outfit logic algorithm to build an outfit from the Search API results:

```python
# This code snippet lets you avoid pairing items that don't
# make sense together in an outfit (i.e. a top AND a dress 
def canAddItem(existingArray, newType):
    bottoms = {"pants", "skirt", "shorts", "dress"}
    newType = newType.lower()
    if newType in existingArray:
        return False
    if newType == "shoe":
        return True
    if newType in bottoms and len(bottoms.intersection(existingArray)):
        return False
    if newType == "top" and "dress" in existingArray:
        return False
    return True
```

## Scoring Outfits

Naturally, I couldn't recreate every one of Laura's outfits using only items in my limited wardrobe. So I decided my approach would be to look at the outfits I could most accurately recreate (using the confidence scores returned by the Product Search API) and create a "score" to sort the recommended outfits.

Figuring out how to "score" an outfit is a creative problem that has no single answer! Here are a couple of score functions I wrote. They give outfits containing items that have high confidence matches more gravitas, and give a bonus to outfits that matched more items in my closet:

```python
# Option 1: sum up the confidence scores for each closet item matched to the inspo photo
def scoreOutfit1(matches):
    if not matches:
        return 0
    return sum([match['score'] for match in matches]) / len(matches)

# Option 2: Sum up the confidence scores only of items that matched with the inspo photo 
# with confidence > 0.3. Also, because shoes will match most images _twice_ 
# (because people have two feet), only count the shoe confidence score once
def scoreOutfit2(matches):
    if not len(matches):
        return 0
    
    noShoeSum = sum([x['score'] for x in matches if (x['score'] > 0.3 and not isTypeMatch("shoe", x["label"]))])
    shoeScore = 0
    try:
        shoeScore = max([x['score'] for x in matches if isTypeMatch("shoe", x["label"])])
    except:
        pass
    return noShoeSum + shoeScore * 0.5 # half the weight for shoes
```

If you want to see all this code together working in action, check out [this Jupyter notebook](https://github.com/google/making_with_ml/blob/master/instafashion/scripts/getMatches.ipynb).

## Putting It All Together

Once I had written all the logic for making outfits in a Python script, I ran the script and wrote all the results to Firestore. Firestore is a serverless database that's designed to be used easily in apps, so once I had all my outfit matches written there, it was easy to write a frontend around it that made everything look pretty. I decided to build a React web app, but you could just easily display this data in a Flutter or iOS or Android app!

And that's pretty much it! Take that, expensive stylist.