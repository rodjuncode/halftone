// person
let person;

// image
let img;
let imgShader;
let imgBlurred;

// halftone
let halftoneBlurred;
let halftonePattern;
let halftoneShader;

let seed;

// interface
let _UI_MARGIN_X = 10;
let _UI_MARGIN_Y = 10;
let _UI_ELEM_MARGIN_Y = 30;
let _UI_COLUMN_WIDTH = 155;
let interface = [];
let imgBlurSlider;
let halftoneBlurSlider;
let thresholdSlider;
let linesQtySlider;
let linesThicknessSlider;
let frequencySlider;
let amplitudeSlider;
let smoothSlider;

function preload() {
  imgShader = loadShader('assets/shaders/blur.vert', 'assets/shaders/blur.frag');
  halftoneShader = loadShader('assets/shaders/blur.vert', 'assets/shaders/blur.frag');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  seed = random(1000);

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
  thresholdSlider = createSlider(0, 1, 0.5, 0.01);
  interface.push(thresholdSlider);
  linesQtySlider = createSlider(0, 100, 50, 5);
  linesQtySlider.input(refreshHalftonePattern);
  interface.push(linesQtySlider);
  linesThicknessSlider = createSlider(0, 20, 10, 1);
  linesThicknessSlider.input(refreshHalftonePattern);
  interface.push(linesThicknessSlider);
  frequencySlider = createSlider(0, 50, 25, 1);
  frequencySlider.input(refreshHalftonePattern);
  interface.push(frequencySlider);
  amplitudeSlider = createSlider(0, 50, 25, 1);
  amplitudeSlider.input(refreshHalftonePattern);
  interface.push(amplitudeSlider);
  smoothSlider = createSlider(1,100,50,1);
  smoothSlider.input(refreshHalftonePattern);
  interface.push(smoothSlider);
  let saveButton = createButton('Salvar');
  saveButton.mousePressed(saveResult);
  interface.push(saveButton);
  let generateButton = createButton('Gerar Padrão');
  generateButton.mousePressed(generate);
  interface.push(generateButton);  
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
 filter(THRESHOLD, thresholdSlider.value());
}

function refreshImgBlur() {
  imgBlurred.setUniform('texelSize', [imgBlurSlider.value(), imgBlurSlider.value()]);
}

function refreshHalftoneBlur() {
  halftoneBlurred.setUniform('texelSize', [halftoneBlurSlider.value(), halftoneBlurSlider.value()]);
}

function refreshHalftonePattern() {
  
  let lines = linesQtySlider.value();
  let thickness = linesThicknessSlider.value();
  let amplitude = amplitudeSlider.value();
  let frequency = frequencySlider.value();
  let smoothness = smoothSlider.value();
    
  halftonePattern.clear();
  halftonePattern.stroke(0);
  halftonePattern.noFill();  
  halftonePattern.strokeWeight(thickness);

  // generates one line
  let z = seed;
  let linePattern = [];
  for (let i = 0; i < width; i++) {
    linePattern.push(map(noise(z),0,1,-amplitude*10,amplitude*10));
    z += frequency/10000;
  }
  
  // draws several lines
  for (let j = -height*0.5; j < height*1.5; j += (int) (height/lines)) {
    halftonePattern.push();
    halftonePattern.translate(0,j);
    halftonePattern.beginShape();
    for (let i = 0; i < width; i+=smoothness) {
      halftonePattern.vertex(i,linePattern[i]);
    }
    halftonePattern.endShape();
    halftonePattern.pop();
  }

  // simple waves
  // for (let i = 0; i < lines; i++) {
  //   halftonePattern.beginShape();
  //   for (let j = 0; j < width; j+=smoothness) {
  //     halftonePattern.vertex(j,height/lines*i+sin(j/freq)*amp);
  //   }
  //   halftonePattern.endShape();
  // }  

  if (halftoneBlurred) {
    halftoneBlurred.content.clear();
    halftoneBlurred.content.image(halftonePattern,0,0);
    halftoneBlurred.rendered.rect(-halftoneBlurred.rendered.width/2,-halftoneBlurred.rendered.height/2,halftoneBlurred.rendered.width,halftoneBlurred.rendered.height);
  }
}


function generate() {
  seed = random(1000);
  refreshHalftonePattern();
}


function saveResult() {
  save();  
}


// this is a PImageWithShader.js + PUploadedImage.js showcase
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


