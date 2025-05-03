if (!Array.prototype.collect) {
  Array.prototype.collect = function <T, A, R = A>(collector: Collector<T, A, R>): R {
    const acc = collector.supplier()
    this.forEach((item) => collector.accumulator(acc, item))
    return collector.finisher ? collector.finisher(acc) : (acc as unknown as R)
  }
}

if (!Array.prototype.distinct) {
  Array.prototype.distinct = function <T>(
    comparator = (a: T, b: T) => JSON.stringify(a) === JSON.stringify(b),
  ): Array<T> {
    return this.reduce((acc, item) => {
      if (!acc.some((i: T) => comparator(i, item))) {
        acc.push(item)
      }
      return acc
    }, [])
  }
}

if (!Array.prototype.dropWhile) {
  Array.prototype.dropWhile = function <T>(predicate: (item: T) => boolean): Array<T> {
    const index = this.findIndex((item) => !predicate(item))
    return this.slice(index + 1)
  }
}

if (!Array.prototype.mapToNumber) {
  Array.prototype.mapToNumber = function <T, K extends NumberKey<T>>(property: K): Array<number> {
    return this.map((item) => item[property])
  }
}

if (!Array.prototype.takeWhile) {
  Array.prototype.takeWhile = function <T>(predicate: (item: T) => boolean): Array<T> {
    const index = this.findIndex((item) => !predicate(item))
    return this.slice(0, index)
  }
}

if (!Array.prototype.max) {
  Array.prototype.max = function (): number {
    if (this.length === 0) throw new Error('Cannot compute the empty array')
    return Math.max(...this)
  }
}

if (!Array.prototype.min) {
  Array.prototype.min = function (): number {
    if (this.length === 0) throw new Error('Cannot compute the empty array')
    return Math.min(...this)
  }
}

if (!Array.prototype.sum) {
  Array.prototype.sum = function (): number {
    return this.reduce((acc, item) => acc + item, 0)
  }
}

if (!Array.prototype.average) {
  Array.prototype.average = function (): number {
    if (this.length === 0) throw new Error('Cannot compute the empty array')
    return this.sum() / this.length
  }
}

export {}
