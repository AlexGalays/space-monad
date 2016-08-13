const assert = require('better-assert')
const Option = require('./lib/option').default
const None = require('./lib/option').None


suite('option.ts', () => {

  // Factory

  test('Creating a Some', () => {
    const some = Option(10)
    assert(some.isDefined())
    assert(some() === 10)
  })

  test('Creating a Some with an empty string', () => {
    const some = Option('')
    assert(some.isDefined())
    assert(some() === '')
  })

  test('Creating a None with null', () => {
    const none = Option(null)
    assert(!none.isDefined())
    assert(none() === undefined)
  })

  test('Creating a None with undefined', () => {
    const none = Option(undefined)
    assert(!none.isDefined())
    assert(none() === undefined)
  })


  // map

  test('Some.map -> Some', () => {
    const some = Option(10).map(x => x * 2)
    assert(some.isDefined() && some() === 20)
  })

  test('Some.map -> None', () => {
    const none = Option(10).map(x => undefined)
    assert(!none.isDefined() && none() === undefined)
  })

  test('None.map -> None', () => {
    const none = Option(undefined).map(x => x * 2)
    assert(!none.isDefined() && none() === undefined)
  })


  // flatMap

  test('Some.flatMap -> Some', () => {
    const some = Option(10).flatMap(x => Option(x * 2))
    assert(some.isDefined() && some() === 20)
  })

  test('Some.flatMap -> None', () => {
    const none = Option(10).flatMap(_ => None)
    assert(!none.isDefined() && none() === undefined)
  })

  test('None.flatMap -> Some', () => {
    const none = Option(undefined).flatMap(_ => Option(10))
    assert(!none.isDefined() && none() === undefined)
  })

  test('None.flatMap -> None', () => {
    const none = Option(undefined).flatMap(_ => None)
    assert(!none.isDefined() && none() === undefined)
  })


  // filter

  test('Some.filter -> Some', () => {
    const some = Option(10).filter(x => x > 5)
    assert(some.isDefined() && some() === 10)
  })

  test('Some.filter -> None', () => {
    const none = Option(10).filter(x => x > 10)
    assert(!none.isDefined() && none() === undefined)
  })

  test('None.filter -> true', () => {
    const none = Option(undefined).filter(_ => true)
    assert(!none.isDefined() && none() === undefined)
  })

  test('None.filter -> false', () => {
    const none = Option(undefined).filter(_ => false)
    assert(!none.isDefined() && none() === undefined)
  })


  // getOrElse equivalent

  test('Some getOrElse', () => {
    const result = Option(10)() || 20
    assert(result === 10)
  })

  test('None getOrElse', () => {
    const result = Option(undefined)() || 20
    assert(result === 20)
  })


  // orElse

  test('Some.orElse Some', () => {
    const some = Option(10).orElse(() => Option(20))
    assert(some.isDefined() && some() === 10)
  })

  test('Some.orElse None', () => {
    const some = Option(10).orElse(() => None)
    assert(some.isDefined() && some() === 10)
  })

  test('None.orElse Some', () => {
    const some = Option(undefined).orElse(() => Option(20))
    assert(some.isDefined() && some() === 20)
  })

  test('None.orElse None', () => {
    const none = Option(undefined).orElse(() => None)
    assert(!none.isDefined() && none() === undefined)
  })


  // Option.all

  test('Option.all - 2 Some args', () => {
    const some = Option.all(Option('a'), Option('b'), (a, b) => a + b)
    assert(some.isDefined() && some() === 'ab')
  })

  test('Option.all - 1 Some arg, 1 defined value', () => {
    const some = Option.all(Option('a'), 'b', (a, b) => a + b)
    assert(some.isDefined() && some() === 'ab')
  })

  test('Option.all - 3 Some args', () => {
    const some = Option.all(Option('a'), Option('b'), Option('c'), (a, b, c) => a + b + c)
    assert(some.isDefined() && some() === 'abc')
  })

  test('Option.all - 1 Some arg, 1 None arg', () => {
    const none = Option.all(Option('a'), Option(undefined), (a, b) => a + b)
    assert(!none.isDefined() && none() === undefined)
  })

  test('Option.all - 1 Some arg, 1 undefined arg', () => {
    const none = Option.all(Option('a'), undefined, (a, b) => a + b)
    assert(!none.isDefined() && none() === undefined)
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

})
