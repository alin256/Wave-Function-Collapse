
class OptionsBitSet{
    constructor(maxOptions) {
        this.bitArray = new Uint32Array(Math.ceil(maxOptions / 32));
        this.internal_lenght = 0;
        this.lenghtComputed = true;
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

    toIndexArray(){
        let out = [];
        // lets also compute the size
        this.internal_lenght = 0;
        for(let i = 0; i < this.bitArray.length; i++){
            for (let j = 0; j < 32; j++){
                if(this.bitArray[i] & (1 << j)){
                    out.push(i * 32 + j);
                    this.internal_lenght++;
                }
            }
        }
        this.lenghtComputed = true;
        return out;
    }

    size(){
        if(this.lenghtComputed){
            return this.internal_lenght;
        }
        this.internal_lenght = 0;
        for(let i = 0; i < this.bitArray.length; i++){
            for (let j = 0; j < 32; j++){
                if(this.bitArray[i] & (1 << j)){
                    this.internal_lenght++;
                }
            }
        }
        this.lenghtComputed = true;
        return this.internal_lenght;
    }
}