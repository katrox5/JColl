import './polyfills/array'
import './polyfills/map'
import './polyfills/set'
import { Collectors } from './polyfills/collectors'

declare global {
  interface Map<K, V> {
    /**
     * Computes a new mapping for the given key using current value (or undefined if absent)
     * @param key - The key to compute
     * @param remappingFunction - Receives key and current value (undefined if absent)
     * @returns The newly computed value
     */
    compute(key: K, remappingFunction: (key: K, value: V | undefined) => V): V
    /**
     * Computes value if key is absent and inserts into map
     * @param key - The key to compute
     * @param mappingFunction - Receives key and returns value to insert
     * @returns Existing value if present, otherwise computed value
     */
    computeIfAbsent(key: K, mappingFunction: (key: K) => V): V
    /**
     * Computes new mapping only if key is present
     * @param key - The key to compute
     * @param remappingFunction - Receives key and current value
     * @returns New value if key existed, undefined otherwise
     */
    computeIfPresent(key: K, remappingFunction: (key: K, value: V) => V): V | undefined
    /**
     * Sets value only if key is not already present
     * @param key - The key to set
     * @param value - The value to associate
     * @returns Existing value if present, otherwise the new value
     */
    setIfAbsent(key: K, value: V): V
    /**
     * Copies all entries from another map into this one
     * @param m - Source map containing entries to add
     */
    setAll(m: Map<K, V>): void
    /**
     * Checks if value exists in the map
     * @param value - Value to search for
     * @param [comparator] - Optional comparison function (default: Object.is)
     * @returns True if value found, false otherwise
     */
    hasValue(value: V, comparator?: (a: V, b: V) => boolean): boolean
  }

  interface Set<T> {
    /**
     * Adds all elements from iterable to the set
     * @param iter - Iterable collection of elements to add
     */
    addAll(iter: Iterable<T>): void
    /**
     * Removes all elements from iterable from the set
     * @param iter - Iterable collection of elements to remove
     */
    deleteAll(iter: Iterable<T>): void
    /**
     * Tests whether all elements from iterable exist in the set
     * @param iter - Iterable collection to check
     * @returns True if all elements exist, false otherwise
     */
    hasAll(iter: Iterable<T>): boolean
  }

  interface Array<T> {
    /**
     * Performs mutable reduction using collector pattern
     * @param collector - Contains supplier, accumulator and optional finisher
     * @returns The accumulated result
     */
    collect<A, R = A>(collector: Collector<T, A, R>): R
    /**
     * Returns new array with distinct elements
     * @param [comparator] - Optional comparison function (default: JSON.stringify)
     * @returns New array with duplicates removed
     */
    distinct(comparator?: (a: T, b: T) => boolean): Array<T>
    /**
     * Drops elements until predicate returns false
     * @param predicate - Test function for elements
     * @returns New array starting from first failing element
     */
    dropWhile(predicate: (item: T) => boolean): Array<T>
    /**
     * Maps objects to their numeric property values
     * @param property - Name of numeric property to extract
     * @returns Array of number values
     */
    mapToNumber<K extends NumberKey<T>>(property: K): Array<number>
    /**
     * Takes elements until predicate returns false
     * @param predicate - Test function for elements
     * @returns New array of elements until first failure
     */
    takeWhile(predicate: (item: T) => boolean): Array<T>
    /**
     * Returns maximum value (number[] only)
     * @throws When array is empty
     * @returns Maximum value
     */
    max(this: Array<number>): number
    /**
     * Returns minimum value (number[] only)
     * @throws When array is empty
     * @returns Minimum value
     */
    min(this: Array<number>): number
    /**
     * Returns sum of elements (number[] only)
     * @returns Sum of all elements
     */
    sum(this: Array<number>): number
    /**
     * Returns average value (number[] only)
     * @throws When array is empty
     * @returns Average value
     */
    average(this: Array<number>): number
  }

  type NumberKey<T> = {
    [K in keyof T]: T[K] extends number ? K : never
  }[keyof T]

  /**
   * Collector specification for mutable reduction
   * @template T - Input element type
   * @template A - Accumulator type
   * @template R - Result type
   */
  type Collector<T, A, R> = {
    /** Creates new accumulator instance */
    supplier: () => A
    /** Incorporates element into accumulator */
    accumulator: (acc: A, item: T) => void
    /** Transforms accumulator to final result */
    finisher?: (acc: A) => R
  }

  /**
   * Statistical summary of numeric data
   */
  type SummaryStatistics = {
    /** Number of values */
    get count(): number
    /** Maximum value */
    get max(): number
    /** Minimum value */
    get min(): number
    /** Sum of values */
    get sum(): number
    /** Average value */
    get average(): number
  }

  /**
   * Factory methods for common collectors
   */
  type Collectors = {
    /** Creates collector that builds Set */
    toSet<T>(): Collector<T, Set<T>, Set<T>>
    /** Creates collector that builds Map */
    toMap<T, K, V>(
      keyMapper: (item: T) => K,
      valueMapper: (item: T) => V,
    ): Collector<T, Map<K, V>, Map<K, V>>
    /** Creates collector that builds plain Object */
    toObject<T, K extends string | number | symbol, V>(
      keyMapper: (item: T) => K,
      valueMapper: (item: T) => V,
    ): Collector<T, Record<K, V>, Record<K, V>>
    /** Creates collector that groups by property */
    groupingBy<T, K extends keyof T, A, D = Array<T>>(
      classifier: K,
      downstream?: Collector<T, A, D>,
    ): Collector<T, Map<T[K], Array<T>>, Map<T[K], D>>
    /** Creates collector that groups by classification function */
    groupingBy<T, R, A, D = Array<T>>(
      classifier: (item: T) => R,
      downstream?: Collector<T, A, D>,
    ): Collector<T, Map<R, Array<T>>, Map<R, D>>
    /** Creates collector that partitions by predicate */
    partitioningBy<T, A, D = Array<T>>(
      predicate: (item: T) => boolean,
      downstream?: Collector<T, A, D>
    ): Collector<T, Map<boolean, Array<T>>, Map<boolean, D>>
    /** Creates collector for numeric statistics (number[] only) */
    summarizing<T extends number>(): Collector<T, Array<number>, SummaryStatistics>
    /** Creates collector for numeric property statistics */
    summarizing<T, K extends NumberKey<T>>(
      property: K,
    ): Collector<T, Array<number>, SummaryStatistics>
    /** Wraps an existing collector with a final transformation */
    wrapping<T, A, R, D>(
      collector: Collector<T, A, R>,
      finisher: (acc: R) => D,
    ): Collector<T, A, D>
  }
}

export { Collectors }
