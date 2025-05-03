# JColl [![npm version](https://img.shields.io/npm/v/jcoll)](https://www.npmjs.com/package/jcoll) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

> Java-inspired utilities for JS collections.  
> Augment native `Map`, `Set`, and `Array` prototypes with chainable operations inspired by Java Stream API.

## Why JColl?

- 📦 **Native Prototype Augmentation** - Seamlessly extends standard collection prototypes with zero wrapper overhead
- 🧠 **Type-Driven Design** - Full TypeScript support with strict generics and type inference
- 🔄 **Fluent Interface** - Enables Java Stream-style method chaining for data pipelines
- ⚡ **Runtime Safe** - All methods feature existence checks to preserve native behavior

## Installation

```bash
npm install jcoll
```

```typescript
// Primary entry - activates prototype augmentations
import 'jcoll'

// Optional explicit utilities
import { Collectors } from 'jcoll'
```

## Usage Examples

### Map Operation

```typescript
const inventory = new Map<string, number>()

// Atomic compute-if-absent
const appleCount = inventory.computeIfAbsent('apples', k => k.length) // 6

// Conditional value transformation
const updatedCount = inventory.computeIfPresent('apples', (k, v) => v * 2) // 12
```

### Set Operations

```typescript
const primeSet = new Set([2, 3, 5])
primeSet.addAll([7, 11])       // Set {2,3,5,7,11}
primeSet.deleteAll([3, 5])     // Set {2,7,11}
```

### Data Pipeline Processing

```typescript
interface User {
  id: number
  name: string
  country: string
  age: number
}

const users: User[] = [
  { id: 1, name: 'Alice', country: 'US', age: 30 },
  { id: 2, name: 'Bob', country: 'UK', age: 25 },
  { id: 3, name: 'Charlie', country: 'US', age: 35 },
  { id: 1, name: 'Alice', country: 'US', age: 30 } // Duplicate
]

// Complex data transformation pipeline
const countryAgeMap = users
  .distinct((a, b) => a.id === b.id)    // Deduplicate by ID
  .filter(u => u.age >= 21)             // Legal age filter
  .collect(Collectors.groupingBy(
    u => u.country,
    Collectors.wrapping(
      Collectors.summarizing('age'),
      (stats) => stats.average,
    )
  )) // Map { US => 32.5, UK => 25 }
```

## Core API

### Map Prototype Augmentations

| Method | Signature | Description |
| --- | --- | --- |
| **`compute`** | **`(key: K, remapping: (K, V) => V)`** | Atomically updates mapping for key using bi-function |
| **`computeIfAbsent`** | **`(key: K, mapping: K => V)`** | Insert computed value if absent, returns current |
| **`setIfAbsent`** | **`(key: K, value: V)`** |  Atomically set value if key is absent |

### Array Prototype Augmentations

| Method | Signature | Description |
| --- | --- | --- |
| **`collect`** | **`<A, R>(Collector<T, A, R>) => R`** | Execute complex data aggregation using collector objects |
| **`distinct`** | **`(Comparator<T>?) => T[]`** | Returns new array with duplicates removed |
| **`summarizing`** | **`(NumberKey<T>?) => { sum: number, average: number, ... }`** | Numeric descriptive statistics |

## Compatibility & Safety

### Prototype Integrity

All extensions include existence checks to prevent conflicts:

```typescript
if (!Map.prototype.compute) {
  // Safe implementation
}
```

### Environment Requirements

* ES2015+ environments (requires native Map/Set)
* TypeScript 4.1+ recommended

## License
MIT Licensed. See [LICENSE](./LISENCE) for full text.
