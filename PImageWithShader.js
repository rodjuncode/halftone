class PImageWithShader {
  constructor(i,s) {
    this.pixels = [];
    this.shader = s;        
    this.content = createGraphics(i.width,i.height);
    this.content.image(i,0,0);
    this.rendered = createGraphics(this.content.width,this.content.height,WEBGL);    
    this.rendered.shader(this.shader);
    this.setUniform('tex0', this.content);
    this.rendered.rect(-this.rendered.width/2,-this.rendered.height/2,this.rendered.width,this.rendered.height);
  }

  setUniform(u,v) {
    this.shader.setUniform(u,v);
    this.rendered.rect(-this.rendered.width/2,-this.rendered.height/2,this.rendered.width,this.rendered.height);
  }

  updateImage(i) {
    this.content.resizeCanvas(i.width,i.height);
    this.content.image(i,0,0);    
    this.rendered.resizeCanvas(this.content.width,this.content.height);
  }

  loadPixels() {
    this.content.loadPixels();
    this.pixels = this.content.pixels;
  }

  updatePixels() {
    this.content.updatePixels();
    this.setUniform('tex0',this.content);
  }

  image() {
    return this.rendered;
  }



}