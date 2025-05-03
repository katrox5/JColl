if (!Set.prototype.addAll) {
  Set.prototype.addAll = function <T>(iter: Iterable<T>): void {
    for (const value of iter) this.add(value)
  }
}

if (!Set.prototype.deleteAll) {
  Set.prototype.deleteAll = function <T>(iter: Iterable<T>): void {
    for (const value of iter) this.delete(value)
  }
}

if (!Set.prototype.hasAll) {
  Set.prototype.hasAll = function <T>(iter: Iterable<T>): boolean {
    return Array.from(iter).every((value) => this.has(value))
  }
}

export {}
