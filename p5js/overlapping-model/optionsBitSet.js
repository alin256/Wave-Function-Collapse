
class OptionsBitSet{
    constructor(maxOptions) {
        this.bitArray = new Uint32Array(Math.ceil(maxOptions / 32));
        this.maxOptions = maxOptions;
        this.internal_lenght = 0;
        this.indexArray = [];
        this.lenghtComputed = true;
    }

    fill(){
        for (let i = 0; i < this.bitArray.length; i++){
            this.bitArray[i] = 0xFFFFFFFF;
        }
        // removing unused bits for consistency
        let emptyInd = this.maxOptions - Math.floor(this.maxOptions / 32) * 32;
        for (let j = emptyInd; j< 32; j++){
            this.bitArray[this.bitArray.length - 1] &= ~(1 << j);
        }
        this.lenghtComputed = false;
    }

    add(index){
        this.bitArray[Math.floor(index / 32)] |= (1 << (index % 32));
        this.lenghtComputed = false;
    }

    remove(index){
        this.bitArray[Math.floor(index / 32)] &= ~(1 << (index % 32));
        this.lenghtComputed = false;
    }

    intersection(other, out){
        if (out == undefined){
            out = new OptionsBitSet(this.bitArray.length * 32);
        }
        out.lenghtComputed = false;
        for (let i = 0; i < this.bitArray.length; i++){
            out.bitArray[i] = this.bitArray[i] & other.bitArray[i];
        }
        return out;
    }

    intersectWith(other){
        for (let i = 0; i < this.bitArray.length; i++){
            this.bitArray[i] &= other.bitArray[i];
        }
        this.lenghtComputed = false;
    }

    union(other, out){
        if (out == undefined){
            out = new OptionsBitSet(this.bitArray.length * 32);
        }
        out.lenghtComputed = false;
        for (let i = 0; i < this.bitArray.length; i++){
            out.bitArray[i] = this.bitArray[i] | other.bitArray[i];
        }
        return out;
    }

    unionWith(other){
        for (let i = 0; i < this.bitArray.length; i++){
            this.bitArray[i] |= other.bitArray[i];
        }
        this.lenghtComputed = false;
    }

    recomputeIndexArray(){
        this.internal_lenght = 0;
        this.indexArray = [];
        for(let i = 0; i < this.bitArray.length; i++){
            for (let j = 0; j < 32; j++){
                if(this.bitArray[i] & (1 << j)){
                    this.indexArray.push(i * 32 + j);
                    this.internal_lenght++;
                }
            }
        }
        this.lenghtComputed = true;
    }

    toIndexArray(){
        if (!this.lenghtComputed){
            this.recomputeIndexArray();
        }
        return this.indexArray;
    }

    size(){
        if(!this.lenghtComputed){
            this.recomputeIndexArray();
        }
        return this.internal_lenght;
    }
}