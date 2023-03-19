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

// Global variable for smart contract instance
let contractInstance;

// Function to load smart contract data
async function loadSmartContractData() {
  const web3 = new Web3("https://ropsten.infura.io/v3/your-infura-project-id");
  const contractAddress = "0x1234567890abcdef1234567890abcdef12345678";
  const contractABI = [
    {
      "constant": false,
      "inputs": [
        {
          "name": "_frequency",
          "type": "uint256"
        }
      ],
      "name": "setFrequency",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_amplitude",
          "type": "uint256"
        }
      ],
      "name": "setAmplitude",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getFrequency",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getAmplitude",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ];

  contractInstance = new web3.eth.Contract(contractABI, contractAddress);

  // Get the initial frequency and amplitude values from the smart contract
  noiseFreq = await contractInstance.methods.getFrequency().call();
  noiseAmp = await contractInstance.methods.getAmplitude().call();
}

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

  // Apply a blur effect to the entire canvas
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
  
        // Wrap the particle's position if it goes offscreen
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
    //   set background colour to a light blue

    background(random(255), random(255), random(255), 63);
  
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