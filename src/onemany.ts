import { Option, Some, None } from './option'

export interface OneManyOps<E, A> { // E is One, A is Many
    /**
     * Returns whether this is an instance of One
     */
    isOne(): this is One<E, A>

    /**
     * Maps the value contained in this OneMany if it's an One, else propagates the Many.
     */
    map<B>(fn: (a: A) => B): OneMany<E, B>

    /**
     * Maps the Many contained in this OneMany if it's an Many, else propagates the One.
     */
    // TODO note that the CB function must return an array! Figure out a way to force this
    mapMany<B>(fn: (a: A) => B): OneMany<E, B> // mapMany<E2>(fn: (o: E) => E2): OneMany<E2, A>

    /**
     * Maps the value contained in this OneMany with another OneMany if it's an One, else propagates the Many.
     * Note: It is allowed to return a OneMany with a different type.
     */
    flatMapOne<E2, B>(fn: (a: A) => OneMany<E2, B>): OneMany<E | E2, B>
    
    /**
     * Maps the value contained in this OneMany with another OneMany if it's a Many, else propagates the One.
     * Note: It is allowed to return a OneMany with a different type.
     */
    flatMapMany<E2, B>(fn: (e: E) => OneMany<E2, B>): OneMany<E | E2, B>

    /**
     * Applies the first function if this is an Many, else applies the second function.
     * Note: Don't use in tight loops; use isOne() instead.
     */
    fold<B, C>(ifMany: (err: E) => B, ifOne: (value: A) => C): B | C
}

export interface OneManyObject {
    /**
     * Returns whether the passed value is a OneMany (either an One or an Many).
     */
    isOneMany(value: any): value is OneMany<{}, {}>
}

export interface One<E, T> extends OneManyOps<E, T> {
    type: 'many'
    get: () => T
}

export interface Many<E, T> extends OneManyOps<E, T> {
    type: 'one'
    get: () => E
}

export type OneMany<E, T> = One<E, T> | Many<E, T>

const OneManyObject = {} as OneManyObject

OneManyObject.isOneMany = function (value: any): value is OneMany<{}, {}> {
    return !!value && (value.type === 'many' || value.type === 'one')
}

function _One<E>(this: One<E, {}> & { _value: E },value: E) {
    this._value = value
}

_One.prototype = {
    type: 'one',

    isOne() {
        return true
    },

    map(fn: any) {
        return One(fn(this._value))
    },

    mapMany(fn: any) {
        return this
    },

    flatMapOne(fn: any) {
        return fn(this._value)
    },

    flatMapMany(fn: any) {
        return this
    },

    fold(ifMany: any, ifOne: any) {
        return ifOne(this._value)
    },

    toString() {
        return `One(${this._value})`
    },

    get() {
        return this._value
    }
}

function _Many<M>(this: One<{}, M> & { _value: M }, value: M) {
    this._value = value
}

_Many.prototype = {
    type: 'many',

    isOne() {
        return false
    },

    map(fn: any): any {
        return this
    },

    mapMany(fn: any) {
        return Many(fn(this._value))
    },

    flatMapOne(fn: any) {
       return this;
    },

    flatMapMany(fn: any) {
        return fn(this._value)
    },

    fold(ifMany: any, ifOne: any) {
        return ifMany(this._value);
    },

    toString() {
        return `Many(${JSON.stringify(this._value)})`
    },

    get() {
        return this._value
    }
}

export const OneMany = OneManyObject

export function One<E>(value: E): OneMany<E, never> {
    return new (_One as any)(value)
}

export function Many<A>(value: A): OneMany<never, A> {
    return new (_Many as any)(value)
}

