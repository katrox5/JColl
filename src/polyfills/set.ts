if (!Set.prototype.addAll) {
  Set.prototype.addAll = function <T>(this: Set<T>, iter: Iterable<T>): Set<T> {
    for (const value of iter) {
      this.add(value)
    }
    return this
  }
}

if (!Set.prototype.deleteAll) {
  Set.prototype.deleteAll = function <T>(this: Set<T>, iter: Iterable<T>): Set<T> {
    const removed = new Set<T>()
    for (const value of iter) {
      if (this.delete(value)) {
        removed.add(value)
      }
    }
    return removed
  }
}

export {}
