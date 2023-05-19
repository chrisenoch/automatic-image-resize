'use strict';
const Jimp = require('jimp');
const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ?
            walkDir(dirPath, callback) : callback(dirPath);
    });
};

let images = [];
walkDir('../img', function (filePath) {
    images.push(filePath);
});

function resizeImage(imagePath, newImageName, quality, width, height) {
    const pathSeparator = path.sep;
    imagePath = path.normalize(imagePath);

    const imageDirectoryParts = imagePath.split(pathSeparator);
    imageDirectoryParts.pop(); // get rid of image file name
    const imageLocation = imageDirectoryParts.join(pathSeparator) + pathSeparator;


    Jimp.read(imagePath)
        .then(image => {
            // console.log(image.bitmap.width);
            // console.log(image.bitmap.height);

            if (width && height) {
                image.resize(width, height);
            } else if (width && !height) {
                image.resize(width, Jimp.AUTO);
            } else {
                image.resize(Jimp.AUTO, height);
            }
            image.quality(quality);
            const fileExt = image.getExtension();
            image.write(imageLocation + newImageName + '.' + fileExt);
        })
        .catch(err => {
            console.error(err)
        });

}

let widths = [400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1400, 1600, 1800, 2000, 2100, 2200];

let count = 0;
const pathSeparator = path.sep;
images.forEach((image) => {
    let imageStart = image.substring(0, image.lastIndexOf('.'));
    widths.forEach((width) => {
        count++
        imageStart = path.normalize(imageStart);
        let currentName = imageStart.substring(imageStart.lastIndexOf(pathSeparator) + 1);
        let newName = currentName + '-' + width;
        console.log(count);
        resizeImage(image, newName, 75, width, false);
    })
});