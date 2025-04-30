
class PriorityQueue {
    constructor() {
        // let's assume each element has an id and a priority
        this.heap = [];
        this.idMap = new Map();
    }

    push(item) {
        if (this.idMap.has(item.id)) {
            this.update(item);
            return;
        }
        this.heap.push(item);
        this.idMap.set(item.id, this.heap.length - 1);
        this._bubbleUp(this.heap.length - 1);
    }

    update(item) {
        const heapIndex = this.idMap.get(item.id);
        this.heap[heapIndex] = item;
        this._bubbleUp(heapIndex);
        this._sinkDown(heapIndex);
    }

    pop() {
        const top = this.peek();
        const end = this.heap.pop();
        this.idMap.delete(top.id);
        if (this.heap.length > 0) {
            this.heap[0] = end;
            this.idMap.set(end.id, 0);
            this._sinkDown(0);
        }
        return top;
    }

    peek() {
        return this.heap[0];
    }

    _bubbleUp(index) {
        const current = this.heap[index];
        while (index > 0) {
            const parentIdx = Math.floor((index - 1) / 2);
            const parent = this.heap[parentIdx];
            if (current.priority >= parent.priority) {
                break;
            }
            this._swap(index, parentIdx);
            index = parentIdx;
        }
    }

    _sinkDown(index) {
        const length = this.heap.length;
        const current = this.heap[index];
        while (true) {
            let leftIdx = 2 * index + 1;
            let rightIdx = 2 * index + 2;
            let swapIdx = null;
            let currentPriority = current.priority;

            if (leftIdx < length
                && this.heap[leftIdx].priority < current.priority) {
                swapIdx = leftIdx;
                currentPriority = this.heap[leftIdx].priority;
            }
            if (rightIdx < length &&
                this.heap[rightIdx].priority < currentPriority) {
                swapIdx = rightIdx;
            }
            if (swapIdx === null){
                break;
            }
            this._swap(index, swapIdx);
            index = swapIdx;
        }
    }

    _swap(i, j) {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
        this.idMap.set(this.heap[i].id, i);
        this.idMap.set(this.heap[j].id, j);
    }
}