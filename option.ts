
export interface OptionOps<A> {
  /**
   * Returns the value contained in this Option.
   * This will always return undefined if this Option instance is None.
   */
  (): A | void

  /**
   * Returns whether this Option has a defined value (i.e, it's a Some(value))
   */
  isDefined(): boolean

  /**
   * Maps the value contained in this Some, else returns None.
   * Depending on the map function return value, a Some could be tranformed into a None.
   */
  map<B>(fn: (a: A) => B): Option<B>

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
  getOrElse(alternative: A): Option<A>

  toString(): string
}

export interface Some<T> extends OptionOps<T> {
  _isSome: Some<T> // Nominal interface marker
  (): T
}

export interface None extends OptionOps<never> {
  _isNone: None // Nominal interface marker
  (): void
}


export type Option<T> = Some<T> | None
export const None = makeNone()

export interface OptionObject {
  /**
   * Creates an Option from a value.
   * If the value is null or undefined, it will create a None, else a Some.
   */
  <T>(value: T): Option<T>

  /**
   * Creates a new Option holding the computation of the passed Options if they were all Some or plain defined instances,
   * else returns None
   */
  all<T1, T2, TR>(t1: T1 | Option<T1>, t2: T2 | Option<T2>,
    computation: (t1: T1, t2: T2) => TR): Option<TR>
  all<T1, T2, T3, TR>(t1: T1 | Option<T1>, t2: T2 | Option<T2>, t3: T3 | Option<T3>,
    computation: (t1: T1, t2: T2, t3: T3) => TR): Option<TR>
  all<T1, T2, T3, T4, TR>(t1: T1 | Option<T1>, t2: T2 | Option<T2>, t3: T3 | Option<T3>, t4: T4 | Option<T4>,
    computation: (t1: T1, t2: T2, t3: T3, t4: T4) => TR): Option<TR>
  all<T1, T2, T3, T4, T5, TR>(t1: T1 | Option<T1>, t2: T2 | Option<T2>, t3: T3 | Option<T3>, t4: T4 | Option<T4>, t5: T5 | Option<T5>,
    computation: (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5) => TR): Option<TR>
}

// The Option constructor / static object
const OptionObject = function OptionObject<T>(value: T): Option<T> {
  return isDef(value) ? Some(value) : None
} as OptionObject

OptionObject.all = (...args: any[]) => {
  const values: any[] = []

  for (let i = 0; i < args.length - 1; i++) {
    let value = args[i]
    if (value && (value._isSome || value._isNone)) value = value()
    if (!isDef(value)) break
    values.push(value)
  }

  if (values.length !== args.length - 1) return None

  const computation: Function = args[args.length - 1]

  return OptionObject(computation.apply(null, values))
}

export default OptionObject


function makeNone() {
  const self: any = () => undefined

  self.isDefined = returnFalse
  self._isNone = self
  self.map = returnNone
  self.flatMap = returnNone
  self.filter = returnNone
  self.orElse = (alt: Function) => alt()
  self.getOrElse = (alt: any) => alt
  self.toString = () => 'None'
  self.toJSON = () => null

  return self as None
}

function Some<T>(value: T) {
  const self: any = () => value

  self.isDefined = returnTrue
  self._isSome = self
  self.map = (fn: any): any => {
    const result = fn(value)
    if (isDef(result)) return Some(result)
    else return None
  }

  self.flatMap = (fn: any) => fn(value)
  self.filter = (fn: any) => fn(value) ? self : None
  self.orElse = () => self
  self.getOrElse = self
  self.toString = () => `Some(${value})`
  self.toJSON = self

  return self as Some<T>
}


function isDef(value: any) {
  return value !== null && value !== undefined
}

function returnNone() { return None }
function returnTrue() { return true }
function returnFalse() { return false }