
export interface Option<A> {
  /**
   * Returns the value contained in this Option.
   * This will always return undefined if this Option instance is None.
   * This method never throws.
   */
  get(): A | undefined

  /**
   * Returns whether this Option has a defined value (i.e, it's a Some(value))
   */
  isDefined(): this is Some<A>

  /**
   * Applies the given procedure to the option's value, if it is non empty.
   */
  forEach(fn: (a: A) => void): void

  /**
   * Maps the value contained in this Some, else returns None.
   * Depending on the map function return value, a Some could be tranformed into a None.
   */
  map<B>(fn: (a: A) => B | null | undefined | Wrapper<B>): Option<B>

  /**
   * Maps the value contained in this Some to a new Option, else returns None.
   */
  flatMap<B>(fn: (a: A) => Option<B>): Option<B>

  /**
   * If this Option is a Some and the predicate returns true, keep that Some.
   * In all other cases, return None.
   */
  filter(fn: (a: A) => boolean): Option<A>

  /**
   * Returns this Option unless it's a None, in which case the provided alternative is returned
   */
  orElse(alternative: () => Option<A>): Option<A>

  /**
   * Returns this Option's value if it's a Some, else return the provided alternative
   */
  getOrElse(alternative: A): A

  /**
   * Returns the result of calling Some(value) if this is a Some, else returns the result of calling None()
   */
  match<B, C>(matcher: { Some: (value: A) => B, None: () => C }): B | C

  toString(): string
}

export interface Some<T> extends Option<T> {
  _isSome: true // Nominal interface marker
  get(): T
}

export interface None extends Option<any> {
  _isNone: true // Nominal interface marker
  get(): undefined
}


export type NullableValue<T> = T | Option<T> | null | undefined

export interface OptionObject {
  /**
   * Creates an Option from a value.
   * If the value is null or undefined, it will create a None, else a Some.
   */
  <T>(value: T | null | undefined): Option<T>

  /**
   * Returns whether the passed value is an Option (either a Some or a None).
   */
  isOption(value: any): value is Option<{}>

  /**
   * Creates a new Option holding the tuple of all the passed values if they were all Some or non null/undefined values,
   * else returns None
   */
  all<T1, T2>(t1: NullableValue<T1>, t2: NullableValue<T2>): Option<[T1, T2]>
  all<T1, T2, T3>(t1: NullableValue<T1>, t2: NullableValue<T2>, t3: NullableValue<T3>): Option<[T1, T2, T3]>
  all<T1, T2, T3, T4>(t1: NullableValue<T1>, t2: NullableValue<T2>, t3: NullableValue<T3>, t4: NullableValue<T4>): Option<[T1, T2, T3, T4]>
  all<T1, T2, T3, T4, T5>(t1: NullableValue<T1>, t2: NullableValue<T2>, t3: NullableValue<T3>, t4: NullableValue<T4>, t5: NullableValue<T5>): Option<[T1, T2, T3, T4, T5]>
}

// The Option factory / static object
const OptionObject = function OptionObject<T>(value: T): Option<T> {
  return isDef(value) ? Some(value) : None
} as OptionObject

OptionObject.all = (...args: any[]): any => {
  const values: any[] = []

  for (let i = 0; i < args.length; i++) {
    let value = args[i]
    if (Option.isOption(value)) value = value.get()
    if (!isDef(value)) break
    values.push(value)
  }

  return (values.length === args.length) ? Some(values) : None
}

OptionObject.isOption = function(value: any): value is Option<{}> {
  return !!value && (value._isSome === true || value._isNone === true)
}

function makeNone() {
  const self: any = {}

  function returnNone() { return None }

  self._isNone = true
  self.get = () => undefined
  self.isDefined = () => false
  self.forEach = () => {}
  self.map = returnNone
  self.flatMap = returnNone
  self.filter = returnNone
  self.orElse = (alt: Function) => alt()
  self.getOrElse = (alt: any) => alt
  self.match = (matcher: any) => matcher.None()
  self.toString = () => 'None'
  self.toJSON = () => null

  return self as None
}

function _Some<T>(value: T) {
  this.value = value
}

_Some.prototype = {

  _isSome: true,

  get() {
    return this.value
  },

  isDefined() {
    return true
  },

  forEach(fn: any) {
    fn(this.value)
  },

  map(fn: any): any {
    let result = fn(this.value)
    if (result && result['_isLiftWrapper']) result = result.value()
    return Option(result)
  },

  flatMap(fn: any) {
    return fn(this.value)
  },

  filter(fn: any) {
    return fn(this.value) ? this : None
  },

  orElse() {
    return this
  },

  getOrElse() {
    return this.value
  },

  match(matcher: any) {
    return matcher.Some(this.value)
  },

  toString() {
    return `Some(${this.value})`
  },

  toJSON() {
    return this.value
  }
}

function isDef(value: any) {
  return value !== null && value !== undefined
}


/* Interop with space-lift */
export interface Wrapper<A> {
  value(): A
}


export const Option = OptionObject

/** Creates a new Some instance using a non nullable value */
export function Some<T extends {}>(value: T): Some<T> {
  return new (_Some as any)(value)
}

export const None = makeNone()