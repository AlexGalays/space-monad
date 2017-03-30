const assert = require('better-assert')
import { Option, None, Some } from '../lib/option'


suite('option.ts', () => {

  // isDefined

  test('isDefined can help refine the type', () => {
    const value = 33 as (number | undefined)
    const some = Option(value)
    some.isDefined() && some.get().toFixed(10)
  })

  // Factory

  test('Creating a Some', () => {
    const some = Option(10)
    assert(some.isDefined())
    assert(some.get() === 10)
  })

  test('Creating a Some with an empty string', () => {
    const some = Option('')
    assert(some.isDefined())
    assert(some.get() === '')
  })

  test('Creating a None with null', () => {
    const none = Option(null)
    assert(!none.isDefined())
    assert(none.get() === undefined)
  })

  test('Creating a None with undefined', () => {
    const none = Option(undefined)
    assert(!none.isDefined())
    assert(none.get() === undefined)
  })


  // forEach

  test('Some.forEach', () => {
    let state = 0
    Some(10).forEach(x => state = state + x)
    Option(10).forEach(x => state = state + x)
    assert(state === 20)
  })

  test('None.forEach', () => {
    let state = 0
    Option(null).forEach(x => state = 10)
    assert(state === 0)
  })


  // map

  test('Some.map -> Some', () => {
    const some = Option(10).map(x => x * 2)
    assert(some.isDefined() && some.get() === 20)
  })

  test('Some.map -> None', () => {
    const none = Option(10).map(x => undefined)
    assert(!none.isDefined() && none.get() === undefined)
  })

  test('None.map -> None', () => {
    const value = undefined as (number | undefined)
    const none = Option(value).map(x => x * 2)
    assert(!none.isDefined() && none.get() === undefined)
  })


  // flatMap

  test('Some.flatMap -> Some', () => {
    const some = Option(10).flatMap(x => Option(x * 2))
    assert(some.isDefined() && some.get() === 20)
  })

  test('Some.flatMap -> None', () => {
    const none = Option(10).flatMap(_ => None)
    assert(!none.isDefined() && none.get() === undefined)
  })

  test('None.flatMap -> Some', () => {
    const none = Option(undefined).flatMap(_ => Option(10))
    assert(!none.isDefined() && none.get() === undefined)
  })

  test('None.flatMap -> None', () => {
    const none = Option(undefined).flatMap(_ => None)
    assert(!none.isDefined() && none.get() === undefined)
  })


  // filter

  test('Some.filter -> Some', () => {
    const some = Option(10).filter(x => x > 5)
    assert(some.isDefined() && some.get() === 10)
  })

  test('Some.filter -> None', () => {
    const none = Option(10).filter(x => x > 10)
    assert(!none.isDefined() && none.get() === undefined)
  })

  test('None.filter -> true', () => {
    const none = Option(undefined).filter(_ => true)
    assert(!none.isDefined() && none.get() === undefined)
  })

  test('None.filter -> false', () => {
    const none = Option(undefined).filter(_ => false)
    assert(!none.isDefined() && none.get() === undefined)
  })


  // getOrElse

  test('Some getOrElse', () => {
    const result = Option('').getOrElse('alt')
    assert(result === '')
  })

  test('None getOrElse', () => {
    const value = undefined as (number | undefined)
    const result = Option(value).getOrElse(20)
    assert(result === 20)
  })


  // orElse

  test('Some.orElse Some', () => {
    const some = Option(10).orElse(() => Option(20))
    assert(some.isDefined() && some.get() === 10)
  })

  test('Some.orElse None', () => {
    const some = Option(10).orElse(() => None)
    assert(some.isDefined() && some.get() === 10)
  })

  test('None.orElse Some', () => {
    const value = undefined as (number | undefined)
    const some = Option(value).orElse(() => Option(20))
    assert(some.isDefined() && some.get() === 20)
  })

  test('None.orElse None', () => {
    const none = Option(undefined).orElse(() => None)
    assert(!none.isDefined() && none.get() === undefined)
  })


  // match

  test('Some.match', () => {
    const some = Option(10)

    const result = some.match({
      Some: x  => (x * 2).toString(),
      None: () => 999 
    })

    // test the compilation of the returned type: It should be a string | number
    if (typeof result === 'number') {
      result.toFixed()
    }
    else {
      result.charCodeAt(0)
    }

    assert(result === '20')
  })

  test('None.match', () => {
    const none = Option(null as number | null)
    const result = none.match({
      Some: x => (x * 2).toString(),
      None: () => '999'
    })
    assert(result === '999')
  })


  // Option.all

  test('Option.all - 2 Some args', () => {
    const some = Option.all(Option('a'), Option('b'))
    assert(some.isDefined() && some.get().join(',') === 'a,b')
  })

  test('Option.all - 1 Some arg, 1 defined value', () => {
    const some = Option.all(Option('a'), 'b')
    assert(some.isDefined() && some.get().join(',') === 'a,b')
  })

  test('Option.all - 3 Some args', () => {
    const some = Option.all(Option('a'), Option('b'), Option('c'))
    assert(some.isDefined() && some.get().join(',') === 'a,b,c')
  })

  test('Option.all - 1 Some arg, 1 None arg', () => {
    const none = Option.all(Option('a'), Option(undefined))
    assert(!none.isDefined() && none.get() === undefined)
  })

  test('Option.all - 1 Some arg, 1 undefined arg', () => {
    const none = Option.all(Option('a'), undefined)
    assert(!none.isDefined() && none.get() === undefined)
  })

  test('Option.all - values in the result tuple are refined to be non nullable', () => {
    const nullableString = 'a' as string | null | undefined

    Option.all(Option(nullableString), undefined, nullableString).map(([a, b, c]) => {
      // Just testing the compilation here
      a.charCodeAt(10)
      c.charCodeAt(10)

      return 0
    })
  })


  // Option.isOption

  test('Option.isOption', () => {
    assert(Option.isOption(true) === false)
    assert(Option.isOption(false) === false)
    assert(Option.isOption('') === false)
    assert(Option.isOption([]) === false)
    assert(Option.isOption(None) === true)
    assert(Option.isOption(Option(33)) === true)
    assert(Option.isOption(Option(undefined)) === true)
  })

  // toString

  test('Some toString', () => {
    const str = Option(10).toString()
    assert(str === 'Some(10)')
  })

  test('None toString', () => {
    const str = Option(undefined).toString()
    assert(str === 'None')
  })


  // implicit toJSON

  test('Some toJSON', () => {
    const obj = JSON.parse(JSON.stringify({ x: Option(10) }))
    assert(obj.x === 10)
  })

  test('None toJSON', () => {
    const obj = JSON.parse(JSON.stringify({ x: Option(undefined) }))
    assert(obj.x === null)
  })


  // Perfs

  test('Measure the time needed to create a Some', () => {
    for (let i = 0; i < 10; i++) {
      console.time(`Creating a Some (${i})`)
      Option(i)
      console.timeEnd(`Creating a Some (${i})`)
    }
  })

})
