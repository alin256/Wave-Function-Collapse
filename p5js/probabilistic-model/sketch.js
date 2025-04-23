// Source image
let sourceImage;
// Tiles extracted from the source image
let tiles;
// Let's keep separate colors fot the tile center
let colorToTiles = {
  'length': 0,
  'colorTile': {}
}
// Grid of cells for the Wave Function Collapse algorithm
let grid2d;

const dx = [-1, 0, 1, -1, 0, 1, -1, 0, 1];
const dy = [-1, -1, -1, 0, 0, 0, 1, 1, 1];

// Refactored variables names
// Number of cells along one dimension of the grid
let GRID_SIZE = 20;
// Maximum depth for recursive checking of cells
let MAX_RECURSION_DEPTH = 16;
// Size of each tile (3x3 by default)
let TILE_SIZE = 3;
let w;

// Turn on or off rotations and reflections
const ROTATIONS = false;
const REFLECTIONS = false;
const MC_STEPS = 1000;

function preload() {
  sourceImage = loadImage('images/flowers.png');
}

function setup() {
  createCanvas(800, 800);
  // Cell width based on canvas size and grid size
  w = width / GRID_SIZE;

  // Extract tiles and calculate their adjacencies
  tiles = extractTiles(sourceImage);
  // for (let tile of tiles) {
  //   tile.calculateNeighbors(tiles);
  // }
  colorToTiles = extractTileColors(tiles);

  // Create the grid
  initializeGrid();

  // Perform initial wave function collapse step
  wfc();

  // add pause checkbox
  let pauseCheckbox = createCheckbox('Pause', false);
  pauseCheckbox.changed(() => {
    if (pauseCheckbox.checked()) {
      noLoop();
    } else {
      loop();
    }
  });
}

function initializeGrid() {
  // Clear the background
  background(0);

  // Clear the grid
  grid2d = [];
  // Initialize the grid with cells
  let count = 0;
  for (let j = 0; j < GRID_SIZE; j++) {
    grid2d.push([]);
    for (let i = 0; i < GRID_SIZE; i++) {
      grid2d[j].push(new Cell(colorToTiles, i * w, j * w, w, count));
      count++;
    }
  }

}

function draw() {
  // Run Wave Function Collapse
  // wfc();
  updateNeighbours();

  // Show the grid 
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      let cell = grid2d[i][j];
      if (cell.needsRedraw) {
        cell.show();
      }
    }
  }
}

function smoothColapse() {
  // suggest probabilities based on observations
  for (let cell of grid2d) {
    cell.scaleProbablities();
  }

  let grid2d = [];
  let observations2d = [];
  for (let i = 0; i < GRID_SIZE; i++) {
    grid2d.push([]);
    observations2d.push([]);
    for (let j = 0; j < GRID_SIZE; j++) {
      grid2d[i].push(grid2d[i + j * GRID_SIZE]);
      observations2d[i].push([]);
      let colors = Array.from(grid2d[i + j * GRID_SIZE].uniqueColors);
      for (let k = 0; k < colors.length; k++) {
        observations2d[i][j].push(0);
      }
    }
  }
  // now observations2d is a 2D is an empty arrey of likelihoods
  // for each cell in the grid2d
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      let cell = grid2d[i][j];
      // get a tile sample proportional to probability
      //let tileSample = 
      let colors = Array.from(cell.uniqueColors);
      for (let k = 0; k < colors.length; k++) {
        observations2d[i][j][k] += cell.probabilities[k];
      }
    }
  }




}

// The Wave Function Collapse algorithm
function wfc() {


  // We're done if all cells are collapsed!
  if (false) {
    noLoop();
    return;
  }

  // Randomly select one of the lowest entropy cells to collapse

  // Need to redraw this cell
  // cell.needsRedraw = true;

  // Choose one option randomly from the cell's options

}

function updateNeighbours() {
  //reset likelihooods
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      let cell = grid2d[i][j];
      cell.resetLikelihoods();
      cell.scaleProbabilities();
    }
  }

  // Loop through each cell in the grid
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      let cell = grid2d[i][j];
      for (let step = 0; step < MC_STEPS; step++) {
        // Randomly select a color from the cell's options
        let randNum = random(0, 1);
        let colorInd = 0;
        while (randNum > cell.probabilities[colorInd]) {
          randNum -= cell.probabilities[colorInd];
          colorInd++;
        }
        colorInd--;

        // Randomly select a tile for that color
        let colorIndex = cell.colorArray[colorInd];
        let curTiles = colorToTiles
        let possibleTiles = colorToTiles[colorIndex]['tiles'];
        randNum = random(0, 1) * colorToTiles[colorIndex]['length'];

        let tileIndex = 0;
        while (randNum > possibleTiles[tileIndex].frequency) {
          randNum -= possibleTiles[tileIndex].frequency;
          tileIndex++;
        }
        tileIndex--;

        const selectedTile = possibleTiles[tileIndex];
        const tileImage = selectedTile.img;
        

        // Check each direction (up, down, left, right)
        for (let k = 0; k < dx.length; k++) {
          let ni = i + dx[k];
          let nj = j + dy[k];


          // Check if the neighbor is within bounds
          if (ni >= 0 && ni < GRID_SIZE && nj >= 0 && nj < GRID_SIZE) {
            let c = tileImage.get(dx[k], dy[k]);
            let colorInd = rgbToIndex([c[0], c[1], c[2]]);
            const neighbor = grid2d[ni][nj];
            neighbor.likelihoods[colorInd] += 1;
          }
        }
      }
    }
  }

  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      let cell = grid2d[i][j];
      cell.scaleLikelihoods();
    }
  }
}

function checkOptions(cell, neighbor, direction) {
  // Check if the neighbor is valid and not already collapsed
  if (neighbor && !neighbor.collapsed) {
    // Collect valid options based on the current cell's adjacency rules
    let validOptions = [];
    for (let option of cell.options) {
      validOptions = validOptions.concat(tiles[option].neighbors[direction]);
    }

    // Filter the neighbor's options to retain only those that are valid
    neighbor.options = neighbor.options.filter((elt) => validOptions.includes(elt));
    return true;
  } else {
    return false;
  }
}
