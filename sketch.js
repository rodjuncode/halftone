// ok, so we have a descent POC, but we need to organize better this code, for two main reasons:
// 1) scalability
// 2) so it can deliver value to people. I see opportunities on: a) uploaded files as PGraphics, seamlessly; b) how to apply shaders to images to PGraphics, seamlesslt




let art;
let halftone;
let halftonePattern;
let artBlurShader;
let halftoneBlurShader;
let img;

let uploadedImg;
let isImageUploaded = false;
let isArtLoaded = false;

let _UI_MARGIN_X = 10;
let _UI_MARGIN_Y = 10;
let _UI_ELEM_MARGIN_Y = 30;
let interface = [];
let artBlur;
let halftoneBlur;
let threshold;
let linesQty;
let linesThickness;
let frequency;
let amplitude;
let smooth;
let bgcolor;

function preload() {
  artBlurShader = loadShader('assets/blur.vert', 'assets/blur.frag');
  halftoneBlurShader = loadShader('assets/blur.vert', 'assets/blur.frag');
  img = loadImage('assets/person.jpg');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  art = createGraphics(width, height, WEBGL);
  art.shader(artBlurShader);

  // interface
  interface.push(createFileInput(handleImageFile));
  artBlur = createSlider(0.0001, 0.001, 0.0001, 0.0001);
  artBlur.input(updateArt);
  interface.push(artBlur);
  halftoneBlur = createSlider(0.0001, 0.001, 0.0001, 0.0001);
  halftoneBlur.input(updateHalftone);
  interface.push(halftoneBlur);
  threshold = createSlider(0, 1, 0.5, 0.01);
  interface.push(threshold);
  linesQty = createSlider(0, 50, 25, 5);
  linesQty.input(updateHalftonePattern);
  interface.push(linesQty);
  linesThickness = createSlider(0, 20, 10, 1);
  linesThickness.input(updateHalftonePattern);
  interface.push(linesThickness);
  frequency = createSlider(0, 50, 25, 1);
  frequency.input(updateHalftonePattern);
  interface.push(frequency);
  amplitude = createSlider(0, 50, 25, 1);
  amplitude.input(updateHalftonePattern);
  interface.push(amplitude);
  smooth = createSlider(1,100,1,1);
  smooth.input(updateHalftonePattern);
  interface.push(smooth);
  let btn = createButton('Salvar');
  btn.mousePressed(save);
  interface.push(btn);
  for (let i = 0; i < interface.length; i++) {
    interface[i].position(_UI_MARGIN_X, _UI_MARGIN_Y + _UI_ELEM_MARGIN_Y*i);
  }

  halftone = createGraphics(width, height, WEBGL);
  halftone.shader(halftoneBlurShader);
  halftonePattern = createGraphics(width, height);
  loadHalftonePattern();
  loadHalftone();




}

function draw() {
  background(200);
  if (isImageUploaded && uploadedImg.width && uploadedImg.height) { 
    if (!isArtLoaded) {
      loadArt();
    }
    image(art,(width-uploadedImg.width)/2,0,uploadedImg.width,uploadedImg.height);
  }
  image(halftone,0,0,width,height);
  filter(THRESHOLD, threshold.value());
}

function loadHalftonePattern() {
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


  // for (let i = 0; i < lines; i++) {
  //   halftone.line(0,height/lines*i,width,height/lines*i);
  // }
}

function handleImageFile(file) {
  if (file.type === 'image') {
    reset();
    uploadedImg = createImg(file.data, '');
    uploadedImg.hide();
    isArtLoaded = false;
    isImageUploaded = true;
  } else {
    uploadedImg = null;
  }
}

function reset() {
  let previousImage = selectAll('img');
  for (let i = 0; i < previousImage.length; i++) {
    previousImage[i].remove();
  }
  artBlur.value(0.0001);
}

function updateArt() {
  //loadArt();
  updateArtBlur();
}

function loadArt() {
  let imgHeight = height;
  let imgWidth = (uploadedImg.width/uploadedImg.height)*height;
  artBlurShader.setUniform('tex0', uploadedImg);
  art.clear();
  art.rect(0,0,imgWidth,imgHeight); 
  isArtLoaded = true;
  console.log('art loaded');
}

function loadHalftone() {
  halftoneBlurShader.setUniform('tex0', halftonePattern);
  halftone.clear();
  halftone.rect(0,0,halftone.width,halftone.height); 
  console.log('halftone loaded');
}

function updateArtBlur() {
  //art.filter(BLUR,artBlur.value());
  //art.shader(blurShader);
  //blurShader.setUniform('tex0', art);
  artBlurShader.setUniform('texelSize', [artBlur.value(), artBlur.value()]);
  art.clear();
  art.rect(-art.width/2,-art.height/2,art.width,art.height); 

}

function updateHalftone() {
  loadHalftone();
  updateHalftoneBlur();
}



function updateHalftonePattern() {
  loadHalftonePattern();
  loadHalftone();
}

function updateHalftoneBlur() {
  halftoneBlurShader.setUniform('texelSize', [halftoneBlur.value(), halftoneBlur.value()]);
  halftone.clear();
  halftone.rect(0,0,width,height); 
}

function save() {
  save();  
}


// ###################################################
// trying to pull image from thispersondoesntexist.com
// ###################################################

// let thisPersonDoesNotExist;
// let person, personCopy;
// let isPersonLoaded = false;
// let personImage;

// function setup() {
//   createCanvas(windowWidth,windowHeight);

//   thisPersonDoesNotExist = createImg(
//     'https://thispersondoesnotexist.com/image', personLoaded
//   );
//   console.log(thisPersonDoesNotExist)
//   thisPersonDoesNotExist.crossOrigin = "Anonymous";
//   thisPersonDoesNotExist.hide();
// }


// function personLoaded() {

//   person = createGraphics(thisPersonDoesNotExist.width, thisPersonDoesNotExist.height);
//   person.image(thisPersonDoesNotExist,0,0,50,50); 
//   console.log('person loaded!');
//   isPersonLoaded = true;
// }

// function draw() {
//   background(255);
// //  if (isPersonLoaded) {
//     image(thisPersonDoesNotExist, mouseX, mouseY, 50, 50);
// //    filter(BLUR);

// //  }

// }

// ###################################################
// using shaders to blur things out (https://github.com/aferriss/p5jsShaderExamples)
// ###################################################

// let camShader;
// let img;
// let pg;

// // the camera variable
// let cam;

// function preload(){
//   // load the shader
//   camShader = loadShader('assets/blur.vert', 'assets/blur.frag');
//   img = loadImage('assets/person.jpg');
// }

// function setup() {
//   // shaders require WEBGL mode to work
//   createCanvas(windowWidth, windowHeight);
//   noStroke();
//   pg = createGraphics(img.width,img.height,WEBGL);
//   pg.shader(camShader);
//   camShader.setUniform('tex0', img);
//   //camShader.setUniform('texelSize', [0.01, 0.01]);
//   pg.rect(0,0,img.width,img.height);
//   //pg.image(img,-width/2,-height/2,width,height);

//   // initialize the webcam at the window size

// }

// function draw() {  
//   // shader() sets the active shader with our shader
//   //background(200);

//     // lets just send the cam to our shader as a uniform
//   //camShader.setUniform('tex0', pg);1


//   camShader.setUniform('texelSize', [1/mouseX, 1/mouseY]);
//   pg.clear();
//   pg.rect(0,0,img.width,img.height);

//   // also send the size of 1 texel on the screen
//   //camShader.setUniform('texelSize', [0.01, 0.01]);

//   image(pg,0,0,img.width,img.height);

//   // rect gives us some geometry on the screen
//   //rect(0,0,width, height);

//   filter(THRESHOLD);
// }

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}