# automatic-image-resize
Automatically inserts the correct image depending on Device Pixel Ratio and screen size

# What this app does  
Automatically inserts the correct image depending on Device Pixel Ratio and screen size.

# Why this app is useful?
This program enables you to avoid using `srcset`, which will save you a lot of time if you have a website with many images.

## HTML with this app:
```
<div class="auto-resize">
  <img      
    alt="Woman in Carnaval costume dancing"
    src="img/once-in-a-lifetime-1200.jpeg"
    class="lifetime" />
</div>
```

## HTML without this app
```
<img
  srcset="
  img/once-in-a-lifetime-400.jpeg   400w,
  img/once-in-a-lifetime-500.jpeg   500w,
  img/once-in-a-lifetime-600.jpeg   600w,
  img/once-in-a-lifetime-800.jpeg   800w,
  img/once-in-a-lifetime-1000.jpeg 1000w,
  img/once-in-a-lifetime-1200.jpeg 1200w
  "
  sizes="(max-width: 37.5em) 100vw, (max-width: 75em) 50vw, 600px"
  alt="Woman in Carnaval costume dancing"
  src="img/once-in-a-lifetime-1200.jpeg" 
/>
```
# No extra effort to add extra image sizes
With this app, it is not extra effort to add more image sizes to the HTML. The example app in the next section below uses a total of **15 sizes** for a total of **21 different images** (400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1400, 1600, 1800, 2000, 2100, 2200).
Imagine how large the `srcset` content would be if you included all of these image sizes using `srcset`.

# Example App
Understanding how to use this app is much easier if you see an example. See: [travelnews](]https://github.com/chrisenoch/travelnews) and pay particular attention to the following:
- How the images are named in the img directory. (For this app images must be named **<image_name>-<width_size>.<file_extension>** E.g. `aito-conference-2200.jpeg`
- The elements with the class “auto-resize” in the index.html file
- Files in the sass/layout directory that include the classes auto-resize and was-auto-resized. See [here](https://github.com/chrisenoch/travelnews/blob/develop/sass/layout/_travel-guides.scss) 
- The files in the js directory

# Important
The app renders the appropriate image based on the **image width** and not on the image height.

# What this app contains
`renderImages.js` and `renderImageController.js` are for automatically inserting the image with the correct dimensions depending on Device Pixel Ratio and screen size of the user’s device.
`resize-images.js` is a program for batch creating images of various dimensions using the Node.js library Jimp. It creates the images with the filenames necessary for this program to work. The quality of the images is excellent and is almost (but not quite as good as) images resized with PhotoShop **according to the tests I did**.

# How to use this app

## Step 1

First you need to prepare different sizes for your images and name them correctly. The **same sizes must be available for every image**. An easy way to do this is to generate the images in batch using `resize-images.js` as it creates images with the correct naming convention (see Step 2). The functionality of `renderImages.js` (the program that renders images of different sizes in the browser) depends on the file format of the images being rendered in the format: **<image_name>-<width_size>.<file_extension>** E.g. `aito-conference-2200.jpeg` 

**Important:** The file extension must be exactly the same for each size variation of each image. E.g. **If one image has the file extension `jpg` and another size variation has `jpeg`, the app will not work.**

### Correct example of how an image directory could look:
```
mountain-lion-400.jpeg
mountain-lion-600.jpeg
mountain-lion-800.jpeg
tenerife-400.jpeg
tenerife-600.jpeg
tenerife-800.jpeg
<more images ...>
```
### Incorrect example of how an image directory could look:
This is incorrect because each image must have the same variation in sizes. Also, the sizes of images in one directory may not be different from the sizes in another directory. Here, there should be a `tenerife-800.jpeg`but it does not exist. 
```
mountain-lion-400.jpeg
mountain-lion-600.jpeg
mountain-lion-800.jpeg
tenerife-400.jpeg
tenerife-600.jpeg
<more images ...>
```

## Step 2
This Step explains how to use the included program resize-images.js to resize images in batch. You can skip to Step 3 if you will do this your own way.

**Warning**: `resize-images.js`. modifies files on your computer. This program is intended as a starting poitn for you to use. Do not use if you do not understand the code.

If you decide to use `resizeImages.js` , add the desired widths to the `widths` array. E.g. if you want every image to have the sizes 400, 800 and 1000, you would add these values to the widths array. 75% quality is used because it is arguably a good trade-off between quality and file size. This is also the default quality used for image-resizing in Next.js as you can see [here](https://nextjs.org/docs/pages/api-reference/components/image) Feel free to change the quality as you see fit. 

**Terminology**
- **width suffix** For the image `tenerife-800.jpeg`,  **-800.jpeg** is the width suffix. <dash>.<number>.<file_extension>
- **base image** - An image with no width suffix in the name, which is used to generate all other size variations of the image.

For every image you want the program to create an image for, ensure that there is at least one base image in the appropriate directory. Images with a width suffix will be ignored. The program uses these base images as a base to generate other images. The larger the size and the higher the quality of this base image, the higher the quality will be of the images this app generates.

The program traverses the file system recursively starting from the file path you provide and renders an image of each width you specify in the `widths`array in each directory where a base image exists.

If images with a width suffix already exist for widths you specify in the `widths` array, they will be recreated and overwritten. At each directory, the program visits while traversing the file system, if no image exists with a width suffix equal to a width you specified in the `widths`array, it will be created.

Example of images rendered by the program:
`guyana-400.jpeg, guyana-600.jpeg, …, guyana-2200.jpeg`

## Step 3
In `renderImagesController.js`, define which image widths you decided to make available in the `availableWidths` array. The program assumes that every image this app is responsible for rendering has images available for every width you define in this array and that they are appropriately named (e.g.  `guyana-400.jpeg` ). If you use the `resize-images.js` program mentioned in Step 2, this is easy to achieve.

If an image of a width you have included in this array is not available as a file, the app will try to load the image you originally specified in the `src` attribute in the HTML. If this is successful (i.e. the image exists in the specified location), the program will not try to load other images upon a screen resize. If this is unsuccessful, the program will stop trying to load an image and no image will be loaded.
### Correct example:
```
//renderImagesController.js
const availableWidths = [1800, 2200];
```

For the above array, you need every image being rendered by this app to have the following variations:
`<imageName>-1800.jpeg` and `<imageName>-2200.jpeg`

### Incorrect example:
In this example only the image `guyana-1800.jpeg` is available on the file system.
//renderImagesController.js
const availableWidths = [1800, 2200];

Here, the developer has forgotten to add the image `guyana-2200.jpeg` to the file system. This could result in the `src` attribute of the HTML being set to guyana-2200.jpeg. This would fail as the image does not exist. Upon error, the program would try to load the image you originally specified in the `src` attribute in the HTML. See the previous paragraph for more information on this.

## Step 4
In your HTML code, ensure that for each image you want to be rendered using this app is inside a container with the class `auto-resize`. In the following example the container is a `div`, but 
it doesn’t have to be. It can be any valid HTML element suitable for a container. It is important that each container contains **only one image and no other element that occupies space at all.**

In your HTML, you write for example:
```
<div class="auto-resize">
  <img
  src="img/guyana-2200.jpeg"
  alt="Kaieteur Falls, Guyana"
  loading="lazy" />
</div>
```
Include an image in the `src` attribute. This image is used to decide which image to eventually load. Choose an image you rendered in Step 1. This image will be used as a fallback if you forget 
to provide a correctly-named image of a size you added to the `availableWidths` array. Furthermore, it is important that the image is located in the same folder as all of the size variations of the 
image. E.g. if you include `src="img/guyana-2200.jpeg`, then all the size variations (e.g. `guyana-400.jpeg, guyana-600.jpeg, …, guyana-2200.jpeg`) must be in the same folder. 
See [this images folder](https://github.com/chrisenoch/travelnews/tree/develop/img) and [this index.html file](https://github.com/chrisenoch/travelnews/blob/develop/index.html) for an example.

`src` is also set for SEO purposes. It** does not serve as a back-up should the JavaScript program fail or if the user has disabled JavaScript in the browser**. In this case, no image would be rendered at all. 

**Do not use srcset** on images you want to be rendered with this application. If you do, the app will not work correctly.

## Step 5
Ensure the container with the class `auto-resize` occupies the width and height you want the image to occupy. The width and height of the container must not depend on the nested image as the image will not be present when the app is loaded. To test you have styled the container correctly, you can delete the image using the DevTools (deleteElement in Chrome) when you inspect the HTML. If the width and height of the container are what you expect the image to be when it is loaded, you have styled the container correctly. The reason this is necessary is because `renderImages.js` measures the height and width of the container and renders an image of an appropriate size based on this.

## Step 6
To define the height and width of the containers use the class 'was-auto-resized` and `auto-resize` in your CSS. At load time each container with the class `auto-resize` has the class `auto-resize` replaced with the class 'was-auto-resized` The purpose of the class `auto-resize` is to allow the app to get the width and height dimensions of the container and to ensure the browser does not download an image before the JavaScript has decided the most appropriate image to load. The purpose of 'was-auto-resized` is to ensure the app continues to function and that the most appropriate image is shown if the user resizes the screen.

### Correct example of styling an image container
```
.some-class {
  /* some styles */

  /* you need to define both */
  .was-auto-resized, .auto-resize {
  width: 17.7rem;
  height: 13rem;
  }
}
```
  
## Step 7
Finally, add the following CSS classes to your CSS.

```
.auto-resize img {
  display: none !important;
}

.was-auto-resized img {
  height: inherit;
  width: inherit;
  min-width: inherit;
  max-width: inherit;
  min-height: inherit;
  max-height: inherit;
  object-fit: cover;
}
```

### Explanation
Images in a container with the class `was-auto-resized` will now automatically occupy the width and height of the container. You could also add object-position to  `.was-auto-resized img`  in order to change how the images are rendered.`.auto-resize img` is set to `display:none` so that the browser does not automatically download the image. One of the main goals of responsive images is to ensure the browser does not download images with unnecessarily large file sizes. If `display:none` was not set, first the browser would download the image defined in the `src` attribute, and then the `renderImages.js` would load another image. This would increase the total file size the user downloads rather than reducing it due to two images being downloaded.

# Resizing the screen
When the screen is resized, the correct image is inserted if the size of the image container changes. This is achieved by using the `was-auto-resized` CSS class.

# Positive features of the app
- Once you know how to use this app and have it set-up, it is very easy to use and it will save you lots of time.
- The best available image is selected according to the exact screen size (to the nearest pixel). The advantage of using this app instead of srcset is that srcset only covers the cases that you explicitly tell it to.

# Limitations
1. As the images are loaded with JavaScript, the images will not load as fast as they would if JavaScript were not used.
- Possible workaround
  - Use `srcset` for images that are in the viewport when the user opens your application. Use this program to render images below the initial viewport. This way, the images rendered with this application will probably have loaded by the time the user scrolls down.
2. If the JavaScript fails, no image will be loaded at all. 
- Possible workarounds:
  - Include images in the `<noscript>` tag as a back-up
  - Redirect the user to a different page if JavaScript is disabled.
3. See browsers below.

# Browsers
This app has **only been tested** in the latest versions of Chrome, Edge and Firefox.

# Design decisions
## Why use a container for the image? Why not set the width and the height on the image?
Before the JavaScript is loaded, the image is set to `display:none`. To calculate the width of the image the program uses the `clientWidth` property. As the image is initially set to `display:none`, the `clientWidth` will be equal to zero, which does not reflect the size the image would be if it were displayed. Consequently, this app first uses the `clientWidth` of the image container to decide the best available image to load and subsequently removes the class `auto-resize` from the container. As a result of removing the class `auto-resize`, the `display:none` on the image is removed and the image is displayed.

## Can’t we use `visibility:hidden` instead of `display:none`?
No. Using `visability:hidden` will not work. If the image is initially set to `visibility:hidden`, the browser will download the image, which **is exactly what we do not want to happen**. Setting the image to `display:none` stops the browser from downloading the image.


