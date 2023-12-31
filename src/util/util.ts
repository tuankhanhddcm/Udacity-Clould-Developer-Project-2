import fs from "fs";
import Jimp from "jimp";

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
 export async function filterImageFromURL(inputURL:string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const photo = await Jimp.read(inputURL);
      const outpath =
        "/tmp/filtered." + Math.floor(Math.random() * 2000) + ".jpg";
      await photo
        .resize(256, 256) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .write(outpath, (img) => {
          resolve(outpath);
        });
    } catch (error) {
      reject(error);
    }
  });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
 export async function deleteLocalFiles(files:Array<string>) {
  for (let file of files) {
    fs.unlinkSync(file);
  }
}

// check image url exsits
export async function imageUrlExsits(image_url:string){
  var regex = /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
    return new Promise((resolve) => {
      // check url valid
      if(!regex.test(image_url)){
        resolve(false);
      }
      // check img url not found
      var XMLHttpRequest = require('xhr2');
      const xhr = new XMLHttpRequest();
      xhr.open('HEAD', image_url, true);
      xhr.send();
      xhr.onload =() => resolve(xhr.status === 200)
    });
}