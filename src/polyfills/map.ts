if (!Map.prototype.compute) {
  Map.prototype.compute = function <K, V>(
    key: K,
    remappingFunction: (key: K, value: V | undefined) => V,
  ): V {
    const value = this.get(key)
    const newValue = remappingFunction(key, value)
    this.set(key, newValue)
    return newValue
  }
}

if (!Map.prototype.computeIfAbsent) {
  Map.prototype.computeIfAbsent = function <K, V>(key: K, mappingFunction: (key: K) => V): V {
    let value = this.get(key)
    if (!this.has(key)) {
      value = mappingFunction(key)
      this.set(key, value)
    }
    return value
  }
}

if (!Map.prototype.computeIfPresent) {
  Map.prototype.computeIfPresent = function <K, V>(
    key: K,
    remappingFunction: (key: K, value: V) => V,
  ): V | undefined {
    if (!this.has(key)) return void 0
    const value = remappingFunction(key, this.get(key))
    this.set(key, value)
    return value
  }
}

if (!Map.prototype.setIfAbsent) {
  Map.prototype.setIfAbsent = function <K, V>(key: K, value: V): V {
    if (!this.has(key)) {
      this.set(key, value)
      return value
    }
    return this.get(key)
  }
}

if (!Map.prototype.setAll) {
  Map.prototype.setAll = function <K, V>(m: Map<K, V>): void {
    m.forEach((value, key) => this.set(key, value))
  }
}

if (!Map.prototype.hasValue) {
  Map.prototype.hasValue = function <V>(value: V, comparator?: (a: V, b: V) => boolean): boolean {
    return Array.from(this.values()).some((v => comparator ? comparator(v, value) : Object.is(v, value)))
  }
}

export {}
