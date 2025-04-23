/**
 * キューイング処理
 */
class Queue {
  private queueFunctions: (() => void)[] = [];

  add(queueFunction: () => void): void {
    this.queueFunctions.push(queueFunction);
  }

  runAll(): void {
    while (this.queueFunctions.length > 0) {
      const queueFunction = this.queueFunctions.shift();
      if (queueFunction) {
        queueFunction();
      }
    }
  }
}

export const queue = new Queue();
