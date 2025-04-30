// Saving the log of 2 for shannon entropy calculation
const log2 = Math.log(2);
const SHOW_OPTION_COUNT_IN_CELL = false;

// A Cell is a single element of the grid
class Cell {
  constructor(tiles, x, y, w, index) {
    // xy and size of cell
    this.x = x;
    this.y = y;
    this.w = w;
    // Index in the grid array
    this.index = index;

    // The indices of tiles that can be placed in this cell
    this.options = new OptionsBitSet(tiles.length); 

    // Has it been collapsed to a single tile?
    this.collapsed = false;

    // Initialize the options with all possible tile indices
    this.options.fill();

    // This keeps track of what the previous options were
    // Saves time recalculating entropy if nothing has changed
    // TODO (Sergey): I think this should not be needed, but let's keep until someone varifies that
    this.previousTotalOptions = -1;

    // Variable to track if cell needs to be redrawn
    this.needsRedraw = true;
  }

  calculateEntropy() {
    // Don't need to recalculate entropy if nothing changed
    // Possible issue if same # of options but different options?
    if (this.previousTotalOptions == this.options.size()) {
      return;
    }
    // Now save the new current total
    this.previousTotalOptions = this.options.size();

    // Compute total frequency of all of the options
    let totalFrequency = 0;
    for (let option of this.options.toIndexArray()) {
      totalFrequency += tiles[option].frequency;
    }

    // Calculate "Shannon" Entropy
    this.entropy = 0;
    for (let option of this.options.toIndexArray()) {
      // Calculate probability for each tile
      let frequency = tiles[option].frequency;
      let probability = frequency / totalFrequency;
      // Shannon entropy is the negative sum: P * log2(P)
      this.entropy -= probability * (log(probability) / log2);
    }
  }

  // Render the cell based on its state
  show() {
    // Only if the cell needs to be redrawn
    if (this.needsRedraw) {
      console.log(this.options)
      if (this.options.size() == 0) {
        // Ignore conflicts
      } else if (this.collapsed) {
        let tileIndex = this.options.toIndexArray()[0];
        let img = tiles[tileIndex].img;
        renderCell(img, this.x, this.y, this.w);
      } else {
        let sumR = 0;
        let sumG = 0;
        let sumB = 0;
        for (let i = 0; i < this.options.size(); i++) {
          let tileIndex = this.options.toIndexArray()[i];
          let img = tiles[tileIndex].img;
          let centerIndex = floor(TILE_SIZE / 2);
          let index = (centerIndex + centerIndex * TILE_SIZE) * 4;
          sumR += img.pixels[index + 0];
          sumG += img.pixels[index + 1];
          sumB += img.pixels[index + 2];
        }
        sumR /= this.options.size();
        sumG /= this.options.size();
        sumB /= this.options.size();
        fill(sumR, sumG, sumB);
        noStroke();
        square(this.x, this.y, this.w);
        
        if (SHOW_OPTION_COUNT_IN_CELL) {
          fill(0);
          noStroke();
          textSize(this.w / 2);
          textAlign(CENTER, CENTER);
          text(this.options.size(), this.x + this.w / 2, this.y + this.w / 2);
        }

      }
      // No need to redraw until something has changed
      this.needsRedraw = false;
    }
  }
}
