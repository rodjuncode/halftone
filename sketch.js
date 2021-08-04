// image
let img;
let imgShader;
let imgBlurred;

// halftone
let halftoneBlurred;
let halftonePattern;
let halftoneShader;

// interface
let _UI_MARGIN_X = 10;
let _UI_MARGIN_Y = 10;
let _UI_ELEM_MARGIN_Y = 30;
let _UI_COLUMN_WIDTH = 155;
let interface = [];
let imgBlurSlider;
let halftoneBlurSlider;
let threshold;
let linesQty;
let linesThickness;
let frequency;
let amplitude;
let smooth;
let bgcolor;

function preload() {
  imgShader = loadShader('assets/shaders/blur.vert', 'assets/shaders/blur.frag');
  halftoneShader = loadShader('assets/shaders/blur.vert', 'assets/shaders/blur.frag');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // image
  img = new PUploadedImage();
  img.init();
  img.position(0,0);
  img.callback = () => {
    if (imgBlurred == undefined) {
      imgBlurred = new PImageWithShader(img.image,imgShader);
    } else {
      imgBlurred.content.clear();
      imgBlurred.content.resizeCanvas(img.image.width,img.image.height);
      imgBlurred.rendered.resizeCanvas(img.image.width,img.image.height);
      imgBlurred.content.image(img.image,0,0);
      imgBlurred.rendered.rect(-imgBlurred.rendered.width/2,-imgBlurred.rendered.height/2,imgBlurred.rendered.width,imgBlurred.rendered.height);
    }
  }  

  // interface
  interface.push(img.dom);
  imgBlurSlider = createSlider(0.0001, 0.001, 0.0001, 0.0001);
  imgBlurSlider.input(refreshImgBlur);
  interface.push(imgBlurSlider);
  halftoneBlurSlider = createSlider(0.0001, 0.001, 0.0001, 0.0001);
  halftoneBlurSlider.input(refreshHalftoneBlur);
  interface.push(halftoneBlurSlider);
  threshold = createSlider(0, 1, 0.5, 0.01);
  interface.push(threshold);
  linesQty = createSlider(0, 50, 25, 5);
  linesQty.input(refreshHalftonePattern);
  interface.push(linesQty);
  linesThickness = createSlider(0, 20, 10, 1);
  linesThickness.input(refreshHalftonePattern);
  interface.push(linesThickness);
  frequency = createSlider(0, 50, 25, 1);
  frequency.input(refreshHalftonePattern);
  interface.push(frequency);
  amplitude = createSlider(0, 50, 25, 1);
  amplitude.input(refreshHalftonePattern);
  interface.push(amplitude);
  smooth = createSlider(1,100,50,1);
  smooth.input(refreshHalftonePattern);
  interface.push(smooth);
  let btn = createButton('Salvar');
  btn.mousePressed(save);
  interface.push(btn);
  for (let i = 0; i < interface.length; i++) {
    interface[i].position(_UI_MARGIN_X, _UI_MARGIN_Y + _UI_ELEM_MARGIN_Y*i);
  }

  // halftone
  halftonePattern = createGraphics(width, height);
  refreshHalftonePattern();
  halftoneBlurred = new PImageWithShader(halftonePattern,halftoneShader);

}

function draw() {
  background(200);
  if (imgBlurred) {
    image(imgBlurred.image(),(width-imgBlurred.image().width)/2+_UI_COLUMN_WIDTH,0);
  }
  
 image(halftoneBlurred.image(),_UI_COLUMN_WIDTH,0);
 filter(THRESHOLD, threshold.value());
}

function refreshImgBlur() {
  imgBlurred.setUniform('texelSize', [imgBlurSlider.value(), imgBlurSlider.value()]);
}

function refreshHalftoneBlur() {
  halftoneBlurred.setUniform('texelSize', [halftoneBlurSlider.value(), halftoneBlurSlider.value()]);
}

function refreshHalftonePattern() {
  let lines = linesQty.value();
  let thickness = linesThickness.value();
  halftonePattern.clear();
  halftonePattern.stroke(0);
  halftonePattern.noFill();  
  halftonePattern.strokeWeight(thickness);
  for (let i = 0; i < lines; i++) {
    halftonePattern.beginShape();
    for (let j = 0; j < width; j+=smooth.value()) {
      halftonePattern.vertex(j,height/lines*i+sin(j/frequency.value())*amplitude.value());
    }
    halftonePattern.endShape();
  }
  if (halftoneBlurred) {
    halftoneBlurred.content.clear();
    halftoneBlurred.content.image(halftonePattern,0,0);
    halftoneBlurred.rendered.rect(-halftoneBlurred.rendered.width/2,-halftoneBlurred.rendered.height/2,halftoneBlurred.rendered.width,halftoneBlurred.rendered.height);
  }
}

function save() {
  save();  
}

// PImageWithShader.js + PUploadedImage.js showcase
// let u1, u2;
// let s1 = undefined, s2;
// let b;
// let reloadShader = false;

// function preload() {
//   b1 = loadShader('assets/shaders/blur.vert', 'assets/shaders/blur.frag');
//   b2 = loadShader('assets/shaders/blur.vert', 'assets/shaders/blur.frag');
// }

// function setup() {
//   createCanvas(windowWidth,windowHeight);

//   u1 = new PUploadedImage();
//   u1.init();
//   u1.position(0,0);
//   u1.callback = () => {
//     if (s1 == undefined) {
//       s1 = new PImageWithShader(u1.image,b1);
//     } else {
//       s1.updateImage(u1.image);
//     }
//   }

//   u2 = new PUploadedImage();
//   u2.init();
//   u2.position(width/2,0);
//   u2.callback = () => {
//     if (s2 == undefined) {
//       s2 = new PImageWithShader(u2.image,b2);
//     } else {
//       s2.updateImage(u2.image);
//     }
//   }

// }

// function draw() {
//   background(200);
//   if (s1) {
//     s1.setUniform('texelSize', [mouseX/1000000, mouseY/1000000]);
//     image(s1.image(),0,0,s1.image().width,s1.image().height);
//   }
//   if (s2) {
//     s2.content.rect(mouseX,mouseY, 10,10);
//     s2.setUniform('texelSize', [mouseX/100000, mouseY/100000]);
//     image(s2.image(),width/2,0,s2.image().width,s2.image().height);
//   }
// }


function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}

