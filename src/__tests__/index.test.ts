import '../index'
import { Collectors } from '../index'

describe('Map extensions', () => {
  let map: Map<string, number>

  beforeEach(() => {
    map = new Map([
      ['a', 1],
      ['b', 2],
    ])
  })

  describe('compute', () => {
    it('should compute new value for existing key', () => {
      const result = map.compute('a', (k, v) => (v ? v + 1 : 10))
      expect(result).toBe(2)
      expect(map.get('a')).toBe(2)
    })

    it('should compute new value for non-existing key', () => {
      const result = map.compute('c', (k, v) => (v ? v + 1 : 10))
      expect(result).toBe(10)
      expect(map.get('c')).toBe(10)
    })
  })

  describe('computeIfAbsent', () => {
    it('should not compute for existing key', () => {
      const result = map.computeIfAbsent('a', (k) => 10)
      expect(result).toBe(1)
      expect(map.get('a')).toBe(1)
    })

    it('should compute for non-existing key', () => {
      const result = map.computeIfAbsent('c', (k) => 3)
      expect(result).toBe(3)
      expect(map.get('c')).toBe(3)
    })
  })

  describe('computeIfPresent', () => {
    it('should compute for existing key', () => {
      const result = map.computeIfPresent('a', (k, v) => v + 1)
      expect(result).toBe(2)
      expect(map.get('a')).toBe(2)
    })

    it('should not compute for non-existing key', () => {
      const result = map.computeIfPresent('c', (k, v) => 10)
      expect(result).toBeUndefined()
      expect(map.has('c')).toBe(false)
    })
  })

  describe('setIfAbsent', () => {
    it('should not set for existing key', () => {
      const result = map.setIfAbsent('a', 10)
      expect(result).toBe(1)
      expect(map.get('a')).toBe(1)
    })

    it('should set for non-existing key', () => {
      const result = map.setIfAbsent('c', 3)
      expect(result).toBe(3)
      expect(map.get('c')).toBe(3)
    })
  })

  describe('setAll', () => {
    it('should merge all entries from another map', () => {
      const other = new Map([
        ['b', 20],
        ['c', 3],
      ])
      map.setAll(other)
      expect(map.size).toBe(3)
      expect(map.get('b')).toBe(20)
      expect(map.get('c')).toBe(3)
    })
  })

  describe('hasValue', () => {
    it('should find value with default comparator', () => {
      expect(map.hasValue(1)).toBe(true)
      expect(map.hasValue(3)).toBe(false)
    })

    it('should find value with custom comparator', () => {
      const objMap = new Map([['a', { id: 1 }]])
      expect(objMap.hasValue({ id: 1 }, (a, b) => a.id === b.id)).toBe(true)
    })
  })
})

describe('Set extensions', () => {
  let set: Set<number>

  beforeEach(() => {
    set = new Set([1, 2, 3])
  })

  describe('addAll', () => {
    it('should add all elements from iterable', () => {
      set.addAll([4, 5])
      expect(set.size).toBe(5)
      expect(set.has(4)).toBe(true)
      expect(set.has(5)).toBe(true)
    })
  })

  describe('deleteAll', () => {
    it('should delete all elements from iterable', () => {
      set.deleteAll([1, 3])
      expect(set.size).toBe(1)
      expect(set.has(2)).toBe(true)
    })
  })

  describe('hasAll', () => {
    it('should check if all elements exist', () => {
      expect(set.hasAll([1, 2])).toBe(true)
      expect(set.hasAll([1, 4])).toBe(false)
    })
  })
})

describe('Array extensions', () => {
  describe('collect', () => {
    it('should collect to Set', () => {
      const result = [1, 2, 2, 3].collect(Collectors.toSet())
      expect(result).toBeInstanceOf(Set)
      expect(result.size).toBe(3)
    })

    it('should collect to Map', () => {
      const result = ['a', 'bb', 'ccc'].collect(
        Collectors.toMap(
          (s) => s.length,
          (s) => s.toUpperCase(),
        ),
      )
      expect(result).toBeInstanceOf(Map)
      expect(result.get(2)).toBe('BB')
    })

    it('should collect to Object', () => {
      const result = ['a', 'bb', 'ccc'].collect(
        Collectors.toObject(
          (s) => s.length,
          (s) => s.toUpperCase(),
        ),
      )
      expect(result).toEqual({ 1: 'A', 2: 'BB', 3: 'CCC' })
    })

    it('should group by property', () => {
      const data = [
        { type: 'a', value: 1 },
        { type: 'b', value: 2 },
        { type: 'a', value: 3 },
      ]
      const result = data.collect(Collectors.groupingBy('type'))
      expect(result.get('a')).toHaveLength(2)
      expect(result.get('b')).toHaveLength(1)
    })

    it('should partition by predicate', () => {
      const result = [1, 2, 3, 4, 5].collect(Collectors.partitioningBy((n) => n % 2 === 0))
      expect(result.get(true)).toEqual([2, 4])
      expect(result.get(false)).toEqual([1, 3, 5])
    })
  })

  describe('distinct', () => {
    it('should remove duplicates with default comparator', () => {
      const result = [1, 2, 2, 3].distinct()
      expect(result).toEqual([1, 2, 3])
    })

    it('should use custom comparator', () => {
      const data = [{ id: 1 }, { id: 2 }, { id: 1 }]
      const result = data.distinct((a, b) => a.id === b.id)
      expect(result).toHaveLength(2)
    })
  })

  describe('dropWhile', () => {
    it('should drop elements while condition is true', () => {
      const result = [1, 2, 3, 4, 5].dropWhile((n) => n < 3)
      expect(result).toEqual([4, 5])
    })
  })

  describe('mapToNumber', () => {
    it('should map objects to number property', () => {
      const data = [
        { id: 1, name: 'a' },
        { id: 2, name: 'b' },
      ]
      const result = data.mapToNumber('id')
      expect(result).toEqual([1, 2])
    })
  })

  describe('takeWhile', () => {
    it('should take elements while condition is true', () => {
      const result = [1, 2, 3, 4, 5].takeWhile((n) => n < 3)
      expect(result).toEqual([1, 2])
    })
  })

  describe('number array methods', () => {
    const numbers = [1, 2, 3, 4, 5]

    it('should calculate max', () => {
      expect(numbers.max()).toBe(5)
      expect(() => [].max()).toThrow()
    })

    it('should calculate min', () => {
      expect(numbers.min()).toBe(1)
      expect(() => [].min()).toThrow()
    })

    it('should calculate sum', () => {
      expect(numbers.sum()).toBe(15)
      expect([].sum()).toBe(0)
    })

    it('should calculate average', () => {
      expect(numbers.average()).toBe(3)
      expect(() => [].average()).toThrow()
    })
  })

  describe('summarizing', () => {
    describe('with number array', () => {
      it('should calculate statistics for number array', () => {
        const numbers = [1, 2, 3, 4, 5]
        const stats = numbers.collect(Collectors.summarizing())

        expect(stats.count).toBe(5)
        expect(stats.max).toBe(5)
        expect(stats.min).toBe(1)
        expect(stats.sum).toBe(15)
        expect(stats.average).toBe(3)
      })

      it('should handle empty array', () => {
        const stats = [].collect(Collectors.summarizing())

        expect(stats.count).toBe(0)
        expect(() => stats.max).toThrow()
        expect(() => stats.min).toThrow()
        expect(stats.sum).toBe(0)
        expect(() => stats.average).toThrow()
      })

      it('should handle single element array', () => {
        const stats = [10].collect(Collectors.summarizing())

        expect(stats.count).toBe(1)
        expect(stats.max).toBe(10)
        expect(stats.min).toBe(10)
        expect(stats.sum).toBe(10)
        expect(stats.average).toBe(10)
      })
    })

    describe('with object array', () => {
      interface TestItem {
        id: number
        value: number
        name: string
      }

      const testData: TestItem[] = [
        { id: 1, value: 10, name: 'A' },
        { id: 2, value: 20, name: 'B' },
        { id: 3, value: 30, name: 'C' },
        { id: 4, value: 40, name: 'D' },
      ]

      it('should calculate statistics for specified number property', () => {
        const stats = testData.collect(Collectors.summarizing('value'))

        expect(stats.count).toBe(4)
        expect(stats.max).toBe(40)
        expect(stats.min).toBe(10)
        expect(stats.sum).toBe(100)
        expect(stats.average).toBe(25)
      })

      it('should throw error for non-number property', () => {
        expect(() => {
          testData.collect(Collectors.summarizing('name' as any))
        }).toThrow()
      })
    })
  })
})

describe('Collectors advanced methods', () => {
  const testData = [
    { id: 1, name: 'Alice', age: 25, department: 'HR' },
    { id: 2, name: 'Bob', age: 30, department: 'IT' },
    { id: 3, name: 'Charlie', age: 25, department: 'IT' },
    { id: 4, name: 'David', age: 35, department: 'HR' },
  ]

  describe('groupingBy with downstream collector', () => {
    it('should group by property with default downstream', () => {
      const result = testData.collect(Collectors.groupingBy('department'))
      expect(result).toBeInstanceOf(Map)
      expect(result.get('HR')).toHaveLength(2)
      expect(result.get('IT')).toHaveLength(2)
    })

    it('should group by function with default downstream', () => {
      const result = testData.collect(
        Collectors.groupingBy((item) => (item.age > 30 ? 'senior' : 'junior')),
      )
      expect(result.get('junior')).toHaveLength(3)
      expect(result.get('senior')).toHaveLength(1)
    })

    it('should group by property with toSet downstream', () => {
      const result = testData.collect(Collectors.groupingBy('department', Collectors.toSet()))
      expect(result.get('HR')).toBeInstanceOf(Set)
      expect(result.get('HR')?.size).toBe(2)
    })

    it('should group by property with summarizing downstream', () => {
      const result = testData.collect(
        Collectors.groupingBy('department', Collectors.summarizing('age')),
      )
      expect(result.get('HR')?.sum).toBe(60) // 25 + 35
      expect(result.get('IT')?.average).toBe(27.5) // (30 + 25) / 2
    })

    it('should group by property with custom downstream collector', () => {
      const result = testData.collect(
        Collectors.groupingBy(
          'department',
          Collectors.wrapping(
            Collectors.toMap(
              (item) => item.id,
              (item) => item.name,
            ),
            (map) =>
              Array.from(map.values()).collect({
                supplier: () => [] as string[],
                accumulator: (acc, item) => acc.push(item.length.toString()),
                finisher: (acc) => acc.join(','),
              }),
          ),
        ),
      )

      expect(result.get('HR')).toBe('5,5') // 'Alice'.length=5, 'David'.length=5
      expect(result.get('IT')).toBe('3,7') // 'Bob'.length=3, 'Charlie'.length=7
    })
  })

  describe('partitioningBy with downstream collector', () => {
    it('should partition with default downstream', () => {
      const result = testData.collect(Collectors.partitioningBy((item) => item.age >= 30))
      expect(result.get(true)).toHaveLength(2)
      expect(result.get(false)).toHaveLength(2)
    })

    it('should partition with toSet downstream', () => {
      const result = testData.collect(
        Collectors.partitioningBy((item) => item.department === 'IT', Collectors.toSet()),
      )
      expect(result.get(true)).toBeInstanceOf(Set)
      expect(result.get(true)?.size).toBe(2)
    })

    it('should partition with summarizing downstream', () => {
      const result = testData.collect(
        Collectors.partitioningBy((item) => item.age < 30, Collectors.summarizing('age')),
      )
      expect(result.get(true)?.sum).toBe(50) // 25 + 25
      expect(result.get(false)?.average).toBe(32.5) // (30 + 35) / 2
    })
  })

  describe('wrapping collector', () => {
    it('should wrap a collector with final transformation', () => {
      const result = testData.collect(
        Collectors.wrapping(Collectors.groupingBy('department'), (map) =>
          Array.from(map.values()).map((group) => group.length),
        ),
      )
      expect(result).toEqual([2, 2]) // HR:2, IT:2
    })

    it('should wrap and chain multiple collectors', () => {
      const result = testData.collect(
        Collectors.wrapping(
          Collectors.partitioningBy((item) => item.age >= 30, Collectors.groupingBy('department')),
          (map) => ({
            senior: Array.from(map.get(true)?.entries() || []),
            junior: Array.from(map.get(false)?.entries() || []),
          }),
        ),
      )
      expect(result.senior).toEqual([
        ['IT', expect.arrayContaining([expect.objectContaining({ name: 'Bob' })])],
        ['HR', expect.arrayContaining([expect.objectContaining({ name: 'David' })])],
      ])
      expect(result.junior).toHaveLength(2)
    })

    it('should work with primitive collectors', () => {
      const result = ['a', 'bb', 'ccc', 'bb'].collect(
        Collectors.wrapping(Collectors.toSet(), (set) => Array.from(set).map((s) => s.length)),
      )
      expect(result).toEqual([1, 2, 3])
    })
  })
})
