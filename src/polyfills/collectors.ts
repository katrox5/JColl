export const Collectors: Collectors = {
  toSet<T>(): Collector<T, Set<T>, Set<T>> {
    return {
      supplier: () => new Set<T>(),
      accumulator: (acc, item) => acc.add(item),
    }
  },

  toMap<T, K, V>(
    keyMapper: (item: T) => K,
    valueMapper: (item: T) => V,
  ): Collector<T, Map<K, V>, Map<K, V>> {
    return {
      supplier: () => new Map<K, V>(),
      accumulator: (acc, item) => acc.set(keyMapper(item), valueMapper(item)),
    }
  },

  toObject<T, K extends string | number | symbol, V>(
    keyMapper: (item: T) => K,
    valueMapper: (item: T) => V,
  ): Collector<T, Record<K, V>, Record<K, V>> {
    return {
      supplier: () => ({} as Record<K, V>),
      accumulator: (acc, item) => (acc[keyMapper(item)] = valueMapper(item)),
    }
  },

  groupingBy<T, K extends keyof T, R, A, D = Array<T>>(
    classifier: ((item: T) => R) | K,
    downstream?: Collector<T, A, D>,
  ): Collector<T, Map<R | T[K], Array<T>>, Map<R | T[K], D>> {
    return {
      supplier: () => new Map<R | T[K], Array<T>>(),
      accumulator: (acc, item) =>
        acc
          .computeIfAbsent(
            classifier instanceof Function ? classifier(item) : item[classifier],
            () => [],
          )
          .push(item),
      finisher: (acc) => {
        if (downstream) {
          const result = new Map<R | T[K], D>()
          acc.forEach((value, key) => {
            const acc1 = downstream.supplier()
            value.forEach((item) => downstream.accumulator(acc1, item))
            result.set(
              key,
              downstream.finisher ? downstream.finisher(acc1) : (acc1 as unknown as D),
            )
          })
          return result
        }
        return acc as unknown as Map<R | T[K], D>
      },
    }
  },

  partitioningBy<T, A, D = Array<T>>(
    predicate: (item: T) => boolean,
    downstream?: Collector<T, A, D>,
  ): Collector<T, Map<boolean, Array<T>>, Map<boolean, D>> {
    return {
      supplier: () =>
        new Map<boolean, Array<T>>([
          [false, []],
          [true, []],
        ]),
      accumulator: (acc, item) => acc.get(predicate(item))!.push(item),
      finisher: (acc) => {
        if (downstream) {
          const result = new Map<boolean, D>()
          acc.forEach((value, key) => {
            const acc1 = downstream.supplier()
            value.forEach((item) => downstream.accumulator(acc1, item))
            result.set(
              key,
              downstream.finisher ? downstream.finisher(acc1) : (acc1 as unknown as D),
            )
          })
          return result
        }
        return acc as unknown as Map<boolean, D>
      },
    }
  },

  summarizing<T extends number, K extends NumberKey<T>>(
    property?: K,
  ): Collector<T, Array<number>, SummaryStatistics> {
    return {
      supplier: () => [],
      accumulator: (acc, item) => {
        if (property) {
          if (typeof item[property] !== 'number')
            throw new TypeError(`${item[property]} is not a number`)
          acc.push(item[property])
        } else {
          acc.push(item)
        }
      },
      finisher: (acc) => ({
        get count(): number {
          return acc.length
        },
        get max(): number {
          return acc.max()
        },
        get min(): number {
          return acc.min()
        },
        get sum(): number {
          return acc.sum()
        },
        get average(): number {
          return acc.average()
        },
      }),
    }
  },

  wrapping<T, A, R, D>(
    collector: Collector<T, A, R>,
    finisher: (result: R) => D,
  ): Collector<T, A, D> {
    return {
      supplier: collector.supplier,
      accumulator: collector.accumulator,
      finisher: (acc: A) => {
        return finisher(collector.finisher ? collector.finisher(acc) : (acc as unknown as R))
      },
    }
  },
}
