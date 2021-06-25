# Space-monad

`Option` and `Result` monads for TypeScript.

<a name="api.option"></a>
## Option

* [Option()](#Option())
* [Option.all()](#Option.all)
* [Option.isOption](#Option.isOption)
* [None](#option.None)
* [map](#option.map)
* [flatMap](#option.flatMap)
* [filter](#option.filter)
* [fold](#option.fold)
* [orElse](#option.orElse)
* [isDefined](#option.isDefined)
* [get](#option.get)
* [getOrElse](#option.getOrElse)
* [forEach](#option.forEach)
* [contains](#option.contains)
* [exists](#option.exists)
* [toArray](#option.toArray)


### Creating an Option

<a name="Option()"></a>
#### Option(x)

Creates an Option from a value.
If the value is null or undefined, it will create a None, else a Some.

```ts
const some = Option(33) // some === Some(33)
const none = Option(null) // none === None
```

If you already know the value is defined for sure (not nullable) or not, you can create a `Some` or `None` directly:

```ts
const some = Some(33) // Some(null | undefined) wouldn't compile.
const none = None
```


<a name="Option.all"></a>
#### Option.all([...optionsOrValues])

Creates a new Option holding the tuple of all the values contained in the passed array if they were all Some or non null/undefined values,
else returns None

```ts
const some = Option.all([
  Option(10),
  20,
  Option(5)
])
// some === Some([10, 20, 5])

const none = Option.all([
  Option(10),
  None,
  Option(5),
  null
])
// none === None
```

<a name="Option.isOption"></a>
#### Option.isOption

Returns whether the passed instance in an Option, and refines its type

```ts
import { Option, Some } from 'space-monad'
Option.isOption(Some(33)) // true
```


<a name="option.None"></a>
#### None

The Option constant representing no value.

```ts
import { None } from 'space-monad'
```


### Transforming an Option

<a name="option.map"></a>
#### map

Maps the value contained in this Some, else returns None.
Depending on the map function return value, a Some could be tranformed into a None, as a Some is guaranteed to never contain a null or undefined value.

```ts
const some = Option(33).map(x => x * 2)
// some === Some(66)
```

<a name="option.flatMap"></a>
#### flatMap

Maps the value contained in this Some to a new Option, else returns None.

```ts
const some = Option(33).flatMap(_ => Option(44))
// some === Some(44)
```

<a name="option.filter"></a>
#### filter

If this Option is a Some and the predicate returns true, keep that Some.
In all other cases, return None.

```ts
const some = Option(33).filter(x => x > 32)
// some === Some(33)
```

<a name="option.fold"></a>
#### fold

Applies the first function if this is a None, else applies the second function.
Note: Since this method creates 2 functions everytime it runs, don't use in tight loops; use isDefined() instead.

```ts
const count = Option(10).fold(
  () => 100, // None
  count => count * 10 // Some
)
```

<a name="option.toArray"></a>
#### toArray

Transforms this option into an Array or either 1 or 0 element.


<a name="option.orElse"></a>
#### orElse

Returns this Option unless it's a None, in which case the provided alternative is returned.

```ts
const some = Option(null).orElse(() => Option(33))
// some === Some(33)
```

### Misc

<a name="option.get"></a>
#### get

`Some` instances return their value, whereas `None` always return `undefined`.
This method never throws.

```ts
const value = Some(33).get()
// value === 33
```

<a name="option.isDefined"></a>
#### isDefined

Returns whether this Option has a defined value (i.e, it's a Some(value))
Note: this refines the type of the Option to be a Some so it's guaranteed its value is not null/undefined.


<a name="option.getOrElse"></a>
#### getOrElse

Returns this Option's value if it's a Some, else return the provided alternative

```ts
const value = Option(undefined).getOrElse(33)

// value === 33
```


<a name="option.forEach"></a>
#### forEach

Applies the given procedure to the option's value, if it is non empty.

```ts
Option(33).forEach(x => console.log(x))
```

<a name="option.contains"></a>
#### contains

Returns whether this option is a Some that contain a specific value, using ===

```ts
Option(30).contains(30) // true
```

<a name="option.exists"></a>
#### exists

Returns whether this option is a Some with a value satisfying the predicate.

```ts
Option(30).exists(n => n > 10) // true
```



<a name="api.result"></a>
## Result

* [Result, Ok, Err](#Result)
* [Result.isResult](#Result.isResult)
* [Result.all](#Result.all)
* [isOk](#result.isOk)
* [map](#result.map)
* [mapError](#result.mapError)
* [flatMap](#result.flatMap)
* [fold](#result.fold)


A `Result` is the result of a computation that may fail. An `Ok` represents a successful computation, while an `Err` represent the error case.


<a name="Result"></a>
### Importing Result

Here's everything that can be imported to use Results:

```ts
import { Result, Ok, Err } from 'space-monad'

const ok = Ok(10)
const err = Err('oops')
```

<a name="Result.isResult"></a>
### Result.isResult

Returns whether this instance is a Result (either an Ok or a Err) and refines its type

```ts
import { Result, Ok } from 'space-monad'

Result.isResult(Ok(10)) // true
```

<a name="Result.all"></a>
### Result.all

Creates a new Ok Result holding the tuple of all the values contained in the passed array if they were all Ok,
else returns the first encountered Err.

```ts
import { Result, Ok, Err } from 'space-monad'

const result = Result.all([
  Ok(20),
  Err('nooo'),
  Ok(200),
  Err('oops')
]) // Err('nooo')
```


<a name="result.isOk"></a>
### isOk

Returns whether this is an instance of Ok

```ts
import { Result, Ok, Err } from 'space-monad'

Ok(10).isOk() // true
```


<a name="result.map"></a>
### map

Maps the value contained in this Result if it's an Ok, else propagates the Error.

```ts
import { Result, Ok, Err } from 'space-monad'

Ok(10).map(x => x * 2) // Ok(20)
Err(10).map(x => x * 2) // Err(10)
```


<a name="result.mapError"></a>
### mapError

Maps the Error contained in this Result if it's an Err, else propagates the Ok.

```ts
import { Result, Ok, Err } from 'space-monad'

Ok(10).mapError(x => x * 2) // Ok(10)
Err(10).mapError(x => x * 2) // Err(20)
```


<a name="result.flatMap"></a>
### flatMap

Maps the value contained in this Result with another Result if it's an Ok, else propagates the Error.
Note: It is allowed to return a Result with a different Error type.

```ts
import { Result, Ok, Err } from 'space-monad'

Ok(10).flatMap(x => Ok(x * 2)) // Ok(20)
Ok(10).flatMap(x => Err(x * 2)) // Err(20)
```


<a name="result.fold"></a>
### fold

Applies the first function if this is an Err, else applies the second function.
Note: Don't use in tight loops; use isOk() instead.


```ts
import { Result, Ok, Err } from 'space-monad'

Ok(10).fold(
  err => console.error(err),
  num => num * 2
) // 20
```



<a name="api.result"></a>
## OneMany

* [OneMany, One, Many](#OneMany)
* [OneMany.isOneMany](#OneMany.isOneMany)
* [OneMany.all](#OneMany.all)
* [isOne](#result.isOne)
* [map](#result.map)
* [mapMany](#result.mapMany)
* [flatMap](#result.flatMap)
* [fold](#result.fold)


A `OneMany` is the result of a computation that may yield a single or multiple instances of an entity.


<a name="OneMany"></a>
### Importing OneMany

Here's everything that can be imported to use OneManys:

```ts
import { OneMany, One, Many } from 'space-monad'

const one = One(10)
const many = Many([10, 20, 30])
```

<a name="OneMany.isOneMany"></a>
### OneMany.isOneMany

Returns whether this instance is a OneMany (either an One or a Many) and refines its type

```ts
import { OneMany, One } from 'space-monad'

OneMany.isOneMany(One(10)) // true
```

<a name="OneMany.all"></a>
### OneMany.all

Creates a new One OneMany holding the tuple of all the values contained in the passed array if they were all One,
else returns the first encountered Many.

```ts
import { OneMany, One, Many } from 'space-monad'

const result = OneMany.all([
  One(20),
  Many([10, 20, 30]),
  One(200),
  Many([40, 50, 60])
]) // Many([10, 20, 30]),
```


<a name="result.isOne"></a>
### isOne

Returns whether this is an instance of One

```ts
import { OneMany, One, Many } from 'space-monad'

One(10).isOne() // true
```


<a name="result.map"></a>
### map

If OneMany is a One, maps it content, else propagates the Many.

```ts
import { OneMany, One, Many } from 'space-monad'

One(10).map(x => x * 2) // One(20)
Many([10, 20, 30]).map(x => x * 2) // Many([10, 20, 30])
```


<a name="result.mapMany"></a>
### mapMany

If OneMany is a Many, maps it content, else propagates the One.

```ts
import { OneMany, One, Many } from 'space-monad'

One(10).mapMany(x => x * 2) // One(10)
Many([10, 20, 30]).mapMany(x => x * 2) // Many([20, 40, 60])
```


<a name="result.flatMap"></a>
### flatMap

Maps the value contained in this OneMany with another OneMany; if it's a One it propagates a One, otherwise a Many;

```ts
import { OneMany, One, Many } from 'space-monad'

One(10).flatMap(x => One(x * 2)) // One(20)
Many([10, 20, 30]).flatMap(x => Many(x * 2)) // Many([20, 40, 60])
```


<a name="result.fold"></a>
### fold

Applies the first function if this is an Many, else applies the second function.
Note: Don't use in tight loops; use isOne() instead.


```ts
import { OneMany, One, Many } from 'space-monad'

One(10).fold(
  many => console.error(JSON.stringfy(many)),
  num => num * 2
) // 20


Many([10, 20, 30]).fold(
  many => console.error(JSON.stringfy(many)),
  num => num * 2
) // 10, 20, 30
```