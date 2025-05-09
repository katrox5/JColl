if (!Array.prototype.collect) {
  Array.prototype.collect = function <T, A, R = A>(
    this: Array<T>,
    collector: Collector<T, A, R>,
  ): R {
    const acc = collector.supplier()
    for (const item of this) {
      collector.accumulator(acc, item)
    }
    return collector.finisher ? collector.finisher(acc) : (acc as unknown as R)
  }
}

if (!Array.prototype.distinct) {
  Array.prototype.distinct = function <T>(
    this: Array<T>,
    comparator = (a: T, b: T) => JSON.stringify(a) === JSON.stringify(b),
  ): Array<T> {
    return this.reduce((acc, item) => {
      if (!acc.some((i: T) => comparator(i, item))) {
        acc.push(item)
      }
      return acc
    }, [] as T[])
  }
}

if (!Array.prototype.dropWhile) {
  Array.prototype.dropWhile = function <T>(
    this: Array<T>,
    predicate: (item: T) => boolean,
  ): Array<T> {
    const index = this.findIndex((item) => !predicate(item))
    return this.slice(index + 1)
  }
}

if (!Array.prototype.mapToNumber) {
  Array.prototype.mapToNumber = function <T, K extends NumberKey<T>>(
    this: Array<T>,
    property: K,
  ): Array<number> {
    return this.map((item) => item[property] as number)
  }
}

if (!Array.prototype.takeWhile) {
  Array.prototype.takeWhile = function <T>(
    this: Array<T>,
    predicate: (item: T) => boolean,
  ): Array<T> {
    const index = this.findIndex((item) => !predicate(item))
    return index === -1 ? [...this] : this.slice(0, index)
  }
}

if (!Array.prototype.max) {
  Array.prototype.max = function (this: Array<number>): number {
    if (this.length === 0) throw new Error('Cannot compute maximum of an empty array')
    return this.reduce((a, b) => Math.max(a, b), -Infinity)
  }
}

if (!Array.prototype.min) {
  Array.prototype.min = function (this: Array<number>): number {
    if (this.length === 0) throw new Error('Cannot compute minimum of an empty array')
    return this.reduce((a, b) => Math.min(a, b), Infinity)
  }
}

if (!Array.prototype.sum) {
  Array.prototype.sum = function (this: Array<number>): number {
    return this.reduce((acc, item) => acc + item, 0)
  }
}

if (!Array.prototype.average) {
  Array.prototype.average = function (this: Array<number>): number {
    if (this.length === 0) throw new Error('Cannot compute average of an empty array')
    return this.sum() / this.length
  }
}

if (!Array.prototype.toFrozen) {
  Array.prototype.toFrozen = function <T>(this: Array<T>): ReadonlyArray<T> {
    return Object.freeze([...this])
  }
}

export {}
