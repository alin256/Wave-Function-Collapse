// Constants arrays for all directions (refactored names)
const DIRECTIONS = 4;
const D_I = [1, -1, 0, 0];
const D_J = [0, 0, -1, 1];
const OPPOSITE_DIRECTION = [1, 0, 3, 2];

// A Tile is a segment of the source image
class Tile {
  constructor(img, i) {
    this.img = img;
    this.img.loadPixels();
    this.index = i;

    // Keep track of the tile's frequency (each tile is unique now!)
    this.frequency = 1;

    // An array to keep track of adjacency rules
    this.neighbors = [];
    for (let k = 0; k < DIRECTIONS; k++) {
      this.neighbors[k] = [];
    }
  }

  // Calculate which tiles can be neighbors in each direction
  calculateNeighbors(tiles) {
    for (let i = 0; i < tiles.length; i++) {
      for (let k = 0; k < DIRECTIONS; k++) {
        if (this.overlappingNoIfs(tiles[i], OPPOSITE_DIRECTION[k])) {
          this.neighbors[k].push(i);
        }
      }
    }
  }

  // Check if two tiles overlap in the specified direction
  overlappingNoIfs(other, direction) {
    for (let i = 0; i < TILE_SIZE; i++) {
      let i1 = i + D_I[direction];
      if (i1 < 0 || i1 >= TILE_SIZE) continue;
      for (let j = 0; j < TILE_SIZE; j++) {
        let j1 = j + D_J[direction];
        if (j1 < 0 || j1 >= TILE_SIZE) continue;

        let indexA = (i +  j * TILE_SIZE) * 4;
        let indexB = (i1 + j1 * TILE_SIZE) * 4;
        if (differentColor(this.img, indexA, other.img, indexB)) {
          return false;
        }
      }
    }
    return true;
  }

}

// Check if two pixels have different colors
function differentColor(imgA, indexA, imgB, indexB) {
  let rA = imgA.pixels[indexA + 0];
  let gA = imgA.pixels[indexA + 1];
  let bA = imgA.pixels[indexA + 2];
  let rB = imgB.pixels[indexB + 0];
  let gB = imgB.pixels[indexB + 1];
  let bB = imgB.pixels[indexB + 2];
  return rA !== rB || gA !== gB || bA !== bB;
}
