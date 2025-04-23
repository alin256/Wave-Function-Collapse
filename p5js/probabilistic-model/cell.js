// Saving the log of 2 for shannon entropy calculation
const log2 = Math.log(2);

// A Cell is a single element of the grid
class Cell {
  constructor(colorTiles, x, y, w) {
    // xy and size of cell
    this.x = x;
    this.y = y;
    this.w = w;

    // The indices of tiles that can be placed in this cell
    this.colorArray = [];
    this.colorIndex = {};
    let ind = 0;
    let keys = Object.keys(colorTiles);
    // make color index
    for (let color of keys) {
      this.colorIndex[color] = ind;
      this.colorArray[ind] = color;
      ind++;
    }
    // make random probability for each color
    this.probabilities = [];
    for (let i = 0; i < ind; i++) {
      this.probabilities[i] = random(1, 1000);
    }

    this.likelihoods = [];

    // Has it been collapsed to a single tile?
    this.collapsed = false;
    // Has it already been checked during recursion?
    this.checked = false;
  
    // Variable to track if cell needs to be redrawn
    this.needsRedraw = true;
  }

  resetLikelihoods() {
    this.likelihoods = [];
    for (let i = 0; i < this.colorArray.length; i++) {
      this.likelihoods.push(0);
    }
  }

  scaleProbabilities(){
    let total = 0;
    for (let i = 0; i < this.probabilities.length; i++) {
      total += this.probabilities[i];
    }
    for (let i = 0; i < this.probabilities.length; i++) {
      this.probabilities[i] /= total;
    }
  }

  scaleLikelihoods(){
    // normalize the likelihoods
    let totalLikelihood = 0;
    for (let i = 0; i < this.likelihoods.length; i++) {
      totalLikelihood += this.likelihoods[i];
    }
    for (let i = 0; i < this.likelihoods.length; i++) {
      this.likelihoods[i] /= totalLikelihood;
    }
  }

  updateProbabilities(){
    for (let i = 0; i < this.probabilities.length; i++) {
      this.probabilities[i] *= this.likelihoods[i];
    }
    this.scaleProbabilities();
  }


  calculateEntropy() {
    // Don't need to recalculate entropy if nothing changed
    // Possible issue if same # of options but different options?
    if (this.previousTotalOptions == this.options.length) {
      return;
    }
    // Now save the new current total
    this.previousTotalOptions = this.options.length;

    // Compute total frequency of all of the options
    let totalFrequency = 0;
    for (let option of this.options) {
      totalFrequency += tiles[option].frequency;
    }

    // Calculate "Shannon" Entropy
    this.entropy = 0;
    for (let option of this.options) {
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
      if (this.collapsed) {
        let tileIndex = this.options[0];
        let img = tiles[tileIndex].img;
        renderCell(img, this.x, this.y, this.w);
      } else {
        this.scaleProbabilities();
        
        let sumR = 0;
        let sumG = 0;
        let sumB = 0;
        for (let i = 0; i < this.colorArray.length; i++) {
          let rgb = indexToRGB(this.colorArray[i])
          sumR += rgb[0] * this.probabilities[i];
          sumG += rgb[1] * this.probabilities[i];
          sumB += rgb[2] * this.probabilities[i];
        }

        //draw black square
        fill(sumR, sumG, sumB);
        square(this.x, this.y, this.w); 

        // fill(0);
        // noStroke();
        // textSize(this.w / 2);
        // textAlign(CENTER, CENTER);
        // text(this.options.length, this.x + this.w / 2, this.y + this.w / 2);

        
        fill(255);
        noStroke();
        let barWidth = this.w / this.probabilities.length;
        for (let i = 0; i < this.probabilities.length; i++) {
          let probability = this.probabilities[i];
          let barHeight = probability * this.w;
          let x = this.x + barWidth*i;
          let y = this.y + this.w - barHeight;
          rect(x, y, barWidth*0.9, barHeight);
        }

        fill(0);
        noStroke();
        // draw the likelihoods
        for (let i = 0; i < this.likelihoods.length; i++) {
          let likelihood = this.likelihoods[i];
          let barHeight = likelihood * this.w;
          let x = this.x + barWidth*i;
          let y = this.y;
          rect(x, y, barWidth*0.9, barHeight);
        }
      }
      // No need to redraw until something has changed
      this.needsRedraw = true;
    }
  }
}
