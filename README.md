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
1.	First you need to prepare different sizes for your images and name them appropriately. The same sizes must be available for every image. An easy way to do this is to generate the images in batch using resize-images.js.

**Warning**: `resize-images.js`. modifies files on your computer. This program is intended as a startig poitn for you to use. Do not use if you do not understand the code.

If you decide to use `resizeImages.js` , add the desired widths to the `widths` array. E.g. if you want every image to have the sizes 400, 800 and 1000, you would add these values to the widths array. 75% quality is used because it is arguably a good trade-off between quality and file size. This is also the default quality used for image-resizing in Next.js as you can see [here](https://nextjs.org/docs/pages/api-reference/components/image) Feel free to change the quality as you see fit. 

Example of images rendered by the program:
`guyana-400.jpeg, guyana-600.jpeg, …, guyana-2200.jpeg`

## Step 2
The functionality of `renderImages.js` depends on the file format of the images being rendered in the format: **<image_name>-<width_size>.<file_extension>** E.g. `aito-conference-2200.jpeg` 
resize-images.js creates images with the correct naming convention

**Important:** The file extension must be exactly the same for each size variation of each image. E.g. **If one image has the file extension `jpg` and another size variation has `jpeg`, the app will not work.**

## Step 3
In `renderImagesController.js`, define which image widths you decided to make available in the `availableWidths` array. The program assumes that every image this app is responsible for rendering has images available for every width you define in this array and that they are appropriately named (e.g.  `guyana-400.jpeg` ). If you use the `resize-images.js` program mentioned in Step 1, this is easy to achieve.

If an image of a width you have included in this array is not available as a file, the app will try to load the image you originally specified in the `src` attribute in the HTML. If this is successful (i.e. the image exists in the specified location), the program will not try to load other images upon a screen resize. If this is unsuccessful, the program will stop trying to load an image and no image will be loaded.
### Correct example:
//renderImagesController.js
const availableWidths = [1800, 2200];

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





