if (!Map.prototype.compute) {
  Map.prototype.compute = function <K, V>(
    this: Map<K, V>,
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
  Map.prototype.computeIfAbsent = function <K, V>(
    this: Map<K, V>,
    key: K,
    mappingFunction: (key: K) => V,
  ): V {
    let value = this.get(key)
    if (!this.has(key)) {
      value = mappingFunction(key)
      this.set(key, value)
    }
    return value!
  }
}

if (!Map.prototype.computeIfPresent) {
  Map.prototype.computeIfPresent = function <K, V>(
    this: Map<K, V>,
    key: K,
    remappingFunction: (key: K, value: V) => V,
  ): V | undefined {
    if (!this.has(key)) return undefined
    const value = this.get(key)!
    const newValue = remappingFunction(key, value)
    this.set(key, newValue)
    return newValue
  }
}

if (!Map.prototype.setIfAbsent) {
  Map.prototype.setIfAbsent = function <K, V>(this: Map<K, V>, key: K, value: V): V {
    if (!this.has(key)) {
      this.set(key, value)
      return value
    }
    return this.get(key)!
  }
}

if (!Map.prototype.setAll) {
  Map.prototype.setAll = function <K, V>(this: Map<K, V>, m: Map<K, V>): Map<K, V> {
    for (const [key, value] of m) {
      this.set(key, value)
    }
    return this
  }
}

if (!Map.prototype.hasValue) {
  Map.prototype.hasValue = function <K, V>(
    this: Map<K, V>,
    value: V,
    comparator?: (a: V, b: V) => boolean,
  ): boolean {
    const compare = comparator || Object.is
    for (const v of this.values()) {
      if (compare(v, value)) return true
    }
    return false
  }
}

export {}
