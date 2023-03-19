// Define the flow field parameters
const cols = 50;
const rows = 50;
const resolution = 30; 
let vectors = [];

// Define the particle parameters
const particleCount = 20000;
let particles = [];

// Global variables for noise frequency and amplitude
let noiseFreq = 0.01;
let noiseAmp = 200;

// generate a random number between 0 and 0.1
// let noiseFreq = Math.random() * 0.1;

function setup() {
  // Create a canvas
  createCanvas(windowWidth, windowHeight);
  colorMode(RGB);
//   set background colour to dark grey
  background(0);

  // Initialize the flow field vectors
  for (let i = 0; i < cols; i++) {
    vectors[i] = [];
    for (let j = 0; j < rows; j++) {
      const angle = noise(x * noiseFreq, y * noiseFreq) * noiseAmp;
      vectors[i][j] = createVector(cos(angle), sin(angle));
    }
  }

  // Initialize the particles
  for (let i = 0; i < particleCount; i++) {
    particles[i] = new Particle();
  }
}

function draw() {
  // Draw the flow field
  drawFlowField();

  // Update and draw the particles
  for (let i = 0; i < particleCount; i++) {
    particles[i].update();
    particles[i].draw();
  }

  // Apply a blur effect to the entire screen
  filter(BLUR, 10);
}

function drawFlowField() {
  // Draw the flow field vectors
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const x = i * resolution + resolution / 2;
      const y = j * resolution + resolution / 2;
      const vector = vectors[i][j].copy().mult(resolution / 2);
      drawVector(vector, x, y, resolution - 2);
    }
  }
}

class Particle {
    constructor() {
      this.pos = createVector(random(width), random(height));
      this.vel = createVector();
      this.acc = createVector();
      this.maxSpeed = 5;
      this.color = color(random(128,255), random(128,255), random(128,255));
    }
  
    update() {
      // Get the vector at the particle's position in the flow field
      const x = floor(this.pos.x / resolution);
      const y = floor(this.pos.y / resolution);
  
      if (vectors[x] && vectors[x][y]) {
        const vector = vectors[x][y].copy();
  
        // Apply the vector to the particle's acceleration
        vector.setMag(this.maxSpeed);
        this.acc = vector;
  
        // Update the particle's position and velocity
        this.vel.add(this.acc);
        this.vel.limit(this.maxSpeed);
        this.pos.add(this.vel);
  
        // Make the particle's position appear to the other side if it goes offscreen
        if (this.pos.x < 0) {
          this.pos.x = width;
        }
        if (this.pos.x > width) {
          this.pos.x = 0;
        }
        if (this.pos.y < 0) {
          this.pos.y = height;
        }
        if (this.pos.y > height) {
          this.pos.y = 0;
        }
      }
    }
  
    draw() {
      // Draw the particle
      noStroke();
      fill(this.color);
      ellipse(this.pos.x, this.pos.y, 2, 2);
    }
  }
  
  function drawFlowField() {
    // Draw the flow field vectors
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = i * resolution + resolution / 2;
        const y = j * resolution + resolution / 2;
        const vector = vectors[i][j].copy().mult(resolution / 2);
        // drawVector(vector, x, y, resolution - 2);
      }
    }
  }
   
  function setup() {
    // Create a canvas
    createCanvas(windowWidth, windowHeight);
    colorMode(RGB);

    //   set background colour to a random value
    background(random(128,255), random(128,255), random(128,255), 63);
  
    // Initialize the flow field vectors
    for (let i = 0; i < cols; i++) {

      vectors[i] = [];
      for (let j = 0; j < rows; j++) {
        const angle = noise(i * 0.1, j * 0.1) * TWO_PI;
        vectors[i][j] = createVector(cos(angle), sin(angle));
      }
    }
  
    // Initialize the particles
    for (let i = 0; i < particleCount; i++) {
      particles[i] = new Particle();
    }
  }
  
  function draw() {
    // Draw the flow field
    drawFlowField();
  
    // Update and draw the particles
    for (let i = 0; i < particleCount; i++) {
      particles[i].update();
      particles[i].draw();
    }
  
   
  }  