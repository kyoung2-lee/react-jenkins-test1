"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queue = void 0;
/**
 * キューイング処理
 */
class Queue {
    constructor() {
        this.queueFunctions = [];
    }
    add(queueFunction) {
        this.queueFunctions.push(queueFunction);
    }
    runAll() {
        while (this.queueFunctions.length > 0) {
            const queueFunction = this.queueFunctions.shift();
            if (queueFunction) {
                queueFunction();
            }
        }
    }
}
exports.queue = new Queue();
//# sourceMappingURL=queuing.js.map