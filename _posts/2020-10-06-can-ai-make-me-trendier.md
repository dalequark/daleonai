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
permalink: social-media-fashion-ai
---
Last year, in a universe where it still made sense to owns pants, I decided to hire a personal stylist. 

In our first appointment, the stylist came to my apartment and took pictures of every clothing item I owned.

In our second appointment, she met me at Nordstrom's, where she asked me to try on a $400 casual dress, a $700 blazer, and $300 sneakers. (I never thought to ask if she worked on commission.)

But only after our third and final appointment, when she finally sent me a folder full of curated "looks" made from my new and old clothing items, did it finally fall into place for me: I'd just blown a *lot* of money.

I had a suspicion we were on different pages when, as we walked through the shoes section at Nordstrom, the stylist said, "The problem with you people in tech is that you're always looking for some kind of theory or strategy or formula for fashion*.* But there is no formula--it's about *taste*.*"*

Pfffft. We'll see about *that*! 

I returned the pricey clothing and decided to build my own (cheaper!) AI-powered stylist. In this post, I'll show you how you can, too.

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

![Diagram of batch process for making outfit recommendations](/images/pxl_20201014_203905793.jpg "The \\\\\\\"batch process\\\\\\\" makes outfit recommendations using AI")

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

If you want the full code, check out this file. TODO: ADD FILE

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

If you, dear reader, want to make your own product set from your own closet pics, I wrote a Python script to help you make a product set from a folder on your desktop (TODO: LINK TO SCRIPT). Just:

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
[{'score': 0.8290401101112366,
  'label': 'Outerwear',
  'matches': [{'product': <pyvisionproductsearch.ProductSearch.ProductSearch.Product at 0x14f4ed700>,
    'score': 0.35919371247291565,
    'image': 'projects/mismatch/locations/us-west1/products/black_leather_jacket_*/referenceImages/eae20045-b4b8-44e7-8233-4d97c2197409'},
   {'product': <pyvisionproductsearch.ProductSearch.ProductSearch.Product at 0x14f4ed100>,
    'score': 0.3150341510772705,
    'image': 'projects/mismatch/locations/us-west1/products/high_rise_black_shorts_*/referenceImages/d4df4c03-f29e-4451-9ab9-7424d7e80aa4'},
   {'product': <pyvisionproductsearch.ProductSearch.ProductSearch.Product at 0x14f4ed0a0>,
    'score': 0.2849031090736389,
    'image': 'projects/mismatch/locations/us-west1/products/high_rise_black_jeans_pants_*/referenceImages/24663de9-92da-4c09-b01e-57eeaf854b65'},
   {'product': <pyvisionproductsearch.ProductSearch.ProductSearch.Product at 0x14f4eb6a0>,
    'score': 0.27588191628456116,
    'image': 'projects/mismatch/locations/us-west1/products/high_rise_blue_denim_shorts_*/referenceImages/dc575246-9070-4bf5-95de-09b13949d1b3'},
   {'product': <pyvisionproductsearch.ProductSearch.ProductSearch.Product at 0x14f4eb640>,
    'score': 0.2750135660171509,
    'image': 'projects/mismatch/locations/us-west1/products/brown_leather_jacket_*/referenceImages/933b2c60-6df0-4e21-95b4-2dd77f7e40a9'},
   {'product': <pyvisionproductsearch.ProductSearch.ProductSearch.Product at 0x14f4eb5b0>,
    'score': 0.26410242915153503,
    'image': 'projects/mismatch/locations/us-west1/products/high_rise_blue_jeans_pants_*/referenceImages/c3726180-7088-45f3-99ef-839d14c788ae'},
   {'product': <pyvisionproductsearch.ProductSearch.ProductSearch.Product at 0x14f4eb5e0>,
    'score': 0.26126375794410706,
    'image': 'projects/mismatch/locations/us-west1/products/leopard_skirt_*/referenceImages/8f45ab2b-0b41-4cc7-af5e-ae4fda0bfe61'},
   {'product': <pyvisionproductsearch.ProductSearch.ProductSearch.Product at 0x14f4ebf40>,
    'score': 0.2557549774646759,
    'image': 'projects/mismatch/locations/us-west1/products/black_sneaker_shoe_*/referenceImages/1b601717-cafc-490a-bf7e-5a2e7807a1d4'},
   {'product': <pyvisionproductsearch.ProductSearch.ProductSearch.Product at 0x14f4eb490>,
    'score': 0.24958018958568573,
    'image': 'projects/mismatch/locations/us-west1/products/high_rise_white_shorts_*/referenceImages/71cc9936-2a35-4a81-8f43-75e1bf50fc22'},
   {'product': <pyvisionproductsearch.ProductSearch.ProductSearch.Product at 0x14f4ebf10>,
    'score': 0.2430962175130844,
    'image': 'projects/mismatch/locations/us-west1/products/black_lace_boot_shoe_*/referenceImages/aadc7ed1-965c-41cf-ae0b-3bb1a41ebe06'}],
  'boundingBox': [x: 0.18633857369422913
  y: 0.19663989543914795
  , x: 0.6501320004463196
  y: 0.19663989543914795
  , x: 0.6501320004463196
  y: 0.5160660147666931
  , x: 0.18633857369422913
  y: 0.5160660147666931
  ]},
 {'score': 0.6601969003677368,
  'label': 'Dress',
  'matches': [{'product': <pyvisionproductsearch.ProductSearch.ProductSearch.Product at 0x14f4ebeb0>,
    'score': 0.3474685549736023,
    'image': 'projects/mismatch/locations/us-west1/products/high_rise_black_shorts_*/referenceImages/d4df4c03-f29e-4451-9ab9-7424d7e80aa4'},
   {'product': <pyvisionproductsearch.ProductSearch.ProductSearch.Product at 0x14f4eb8e0>,
    'score': 0.2839047610759735,
    'image': 'projects/mismatch/locations/us-west1/products/denim_vest_jacket_*/referenceImages/afc55750-05de-4f0a-84e1-ed26ae1c9e8a'},
   {'product': <pyvisionproductsearch.ProductSearch.ProductSearch.Product at 0x14f4ebe80>,
    'score': 0.27661362290382385,
    'image': 'projects/mismatch/locations/us-west1/products/high_rise_blue_denim_shorts_*/referenceImages/dc575246-9070-4bf5-95de-09b13949d1b3'},
   {'product': <pyvisionproductsearch.ProductSearch.ProductSearch.Product at 0x14f4ebfd0>,
    'score': 0.2677146792411804,
    'image': 'projects/mismatch/locations/us-west1/products/black_lace_boot_shoe_*/referenceImages/660e39ae-8b18-4d0e-8ee9-25e5a5b12215'},
   {'product': <pyvisionproductsearch.ProductSearch.ProductSearch.Product at 0x14f4ebdf0>,
    'score': 0.25523173809051514,
    'image': 'projects/mismatch/locations/us-west1/products/black_leather_jacket_*/referenceImages/eae20045-b4b8-44e7-8233-4d97c2197409'},
   {'product': <pyvisionproductsearch.ProductSearch.ProductSearch.Product at 0x14f4ebf70>,
    'score': 0.24909083545207977,
    'image': 'projects/mismatch/locations/us-west1/products/black_stud_boot_shoe_*/referenceImages/11b5a313-4e4f-4712-8d33-75ca68759f96'},
   {'product': <pyvisionproductsearch.ProductSearch.ProductSearch.Product at 0x14f4eb520>,
    'score': 0.24563151597976685,
    'image': 'projects/mismatch/locations/us-west1/products/high_rise_black_jeans_pants_*/referenceImages/5c5466d0-4d3d-4fd2-88b7-17277c670955'},
   {'product': <pyvisionproductsearch.ProductSearch.ProductSearch.Product at 0x14f4eb1f0>,
    'score': 0.21744869649410248,
    'image': 'projects/mismatch/locations/us-west1/products/spotted_dress_*/referenceImages/6d4d3a3a-267f-40ec-812d-78818b835c88'},
   {'product': <pyvisionproductsearch.ProductSearch.ProductSearch.Product at 0x14f4eb250>,
    'score': 0.2153632938861847,
    'image': 'projects/mismatch/locations/us-west1/products/black_boot_shoe_*/referenceImages/f593e385-20b5-42ba-b729-59a35fc86910'},
   {'product': <pyvisionproductsearch.ProductSearch.ProductSearch.Product at 0x14f4eb4f0>,
    'score': 0.20506373047828674,
    'image': 'projects/mismatch/locations/us-west1/products/sleeveless_black_dress_*/referenceImages/97111725-aecd-496e-9723-94fc08dbba15'}],
  'boundingBox': [x: 0.2914634048938751
  y: 0.2835150361061096
  , x: 0.5167719125747681
  y: 0.2835150361061096
  , x: 0.5167719125747681
  y: 0.7355437874794006
  , x: 0.2914634048938751
  y: 0.7355437874794006
  ]},
 {'score': 0.8847746849060059,
  'label': 'Skirt',
  'matches': [{'product': <pyvisionproductsearch.ProductSearch.ProductSearch.Product at 0x14f4eb9d0>,
    'score': 0.3513137102127075,
    'image': 'projects/mismatch/locations/us-west1/products/black_bomber_jacket_*/referenceImages/c3282849-ea54-4357-b040-0a662ac7e0d6'},
   {'product': <pyvisionproductsearch.ProductSearch.ProductSearch.Product at 0x14f4eb820>,
    'score': 0.32987311482429504,
    'image': 'projects/mismatch/locations/us-west1/products/high_rise_black_shorts_*/referenceImages/d4df4c03-f29e-4451-9ab9-7424d7e80aa4'},
   {'product': <pyvisionproductsearch.ProductSearch.ProductSearch.Product at 0x14f4eb580>,
    'score': 0.31892913579940796,
    'image': 'projects/mismatch/locations/us-west1/products/denim_vest_jacket_*/referenceImages/afc55750-05de-4f0a-84e1-ed26ae1c9e8a'},
   {'product': <pyvisionproductsearch.ProductSearch.ProductSearch.Product at 0x14f4eb8b0>,
    'score': 0.3061317801475525,
    'image': 'projects/mismatch/locations/us-west1/products/navy_jcrew_blazer_jacket_*/referenceImages/b3e81044-87b8-446c-b07f-5560cc309461'},
   {'product': <pyvisionproductsearch.ProductSearch.ProductSearch.Product at 0x14f4ebe50>,
    'score': 0.29948967695236206,
    'image': 'projects/mismatch/locations/us-west1/products/high_rise_blue_denim_shorts_*/referenceImages/a0e7c08b-5353-4c8a-86da-1ce558b7e093'},
   {'product': <pyvisionproductsearch.ProductSearch.ProductSearch.Product at 0x14f4ebc40>,
    'score': 0.27922067046165466,
    'image': 'projects/mismatch/locations/us-west1/products/high_rise_blue_jeans_pants_*/referenceImages/c3726180-7088-45f3-99ef-839d14c788ae'},
   {'product': <pyvisionproductsearch.ProductSearch.ProductSearch.Product at 0x14f4ebbe0>,
    'score': 0.2762813866138458,
    'image': 'projects/mismatch/locations/us-west1/products/blue_jacket_*/referenceImages/7f479285-1aa2-4763-b028-2cebdd3cbe70'},
   {'product': <pyvisionproductsearch.ProductSearch.ProductSearch.Product at 0x14f4ebca0>,
    'score': 0.27550992369651794,
    'image': 'projects/mismatch/locations/us-west1/products/bodycon_skirt_*/referenceImages/54d0269a-8dc5-4b6d-84de-8684cb119531'},
   {'product': <pyvisionproductsearch.ProductSearch.ProductSearch.Product at 0x14f4ebbb0>,
    'score': 0.26349344849586487,
    'image': 'projects/mismatch/locations/us-west1/products/chambray_top_*/referenceImages/325328f6-53ac-41bc-920b-462aa7223546'},
   {'product': <pyvisionproductsearch.ProductSearch.ProductSearch.Product at 0x14f4ebaf0>,
    'score': 0.2551405429840088,
    'image': 'projects/mismatch/locations/us-west1/products/black_leather_jacket_*/referenceImages/eae20045-b4b8-44e7-8233-4d97c2197409'}],
  'boundingBox': [x: 0.2696470618247986
  y: 0.4767058789730072
  , x: 0.5400000214576721
  y: 0.4767058789730072
  , x: 0.5400000214576721
  y: 0.7400000691413879
  , x: 0.2696470618247986
  y: 0.7400000691413879
  ]}]
  '''
```

The response contains lots of data, including which items were recognized in a the source photo (i.e. "skirt", "top") and what items in your project set matched with them. The API also returns a "score" field for each match which tells you how confident the the API is that an item in your product set

I did even more filtering using the **object detection** feature of the Cloud Vision API, which identifies individual objects (and their locations) in photos:

![Screenshot of using the Vision API to detect clothing item locations](/images/screen-shot-2020-10-15-at-11.43.07-am.png "The Vision API tags my top, shoes, and shorts.")

As you can see, this feature tags both *what* clothing items I'm wearing but also *where* they're located in the picture (i.e. the API returns the pixel coordinates of bounding boxes for each of my shoes). You can find a list of all the clothing-related tags the API returns here (TODO: ADD LINK). More on how I used that feature in a second.