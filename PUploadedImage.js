const _PUPIMAGE_EMPTY_WIDTH = 100;
const _PUPIMAGE_EMPTY_HEIGHT = 100;
const _PUPIMAGE_ID = 'PUP_';

class PUploadedImage {

  constructor() {
    this.id = _PUPIMAGE_ID + str(millis()).replace('.','');
    this.image = createGraphics(_PUPIMAGE_EMPTY_WIDTH,_PUPIMAGE_EMPTY_HEIGHT);
    this.image.rect(0,0,_PUPIMAGE_EMPTY_WIDTH,_PUPIMAGE_EMPTY_HEIGHT);
    this.image.line(0,0,_PUPIMAGE_EMPTY_WIDTH,_PUPIMAGE_EMPTY_HEIGHT);
    this.image.line(_PUPIMAGE_EMPTY_WIDTH,0,0,_PUPIMAGE_EMPTY_HEIGHT);
    this.isImageReady = false;
    this.pixels = [];
  }

  init() {
    const handleFile = (file) => {
      this.isImageReady = false;
      let _oldImg = select('#' + this.id);
      if (_oldImg) {
        _oldImg.remove();
      }      
      if (file.type === 'image') {
        this.uploadedImg = createImg(file.data, '', '', loadUploadedImage);
        this.uploadedImg.id(this.id);
        this.uploadedImg.hide();
      } else {
        this.uploadedImg = null;
      }
    }
    const loadUploadedImage = (img) => {
      this.image = createGraphics(img.width, img.height);
      this.image.image(img,0,0);
      this.isImageReady = true;
      this.callback();
    }

    this.dom = createFileInput(handleFile);
    return this.dom;
  }

  callback() {
    console.log("image was loaded!");
  }

  position(x,y) {
    this.dom.position(x,y);
  }

  loadPixels() {
    this.image.loadPixels();
    this.pixels = this.image.pixels;
  }

  updatePixels() {
    this.image.updatePixels();
  }

  pixels() {
    return this.image.pixels;
  }



}