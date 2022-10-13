export type AnyFunction = (...args: any[]) => any

type TypeGuard<A, B extends A> = (payload: A) => payload is B

export function getType(payload: any): string {
    return Object.prototype.toString.call(payload).slice(8, -1);
}

export function isUndefined(payload: any): payload is undefined {
    return getType(payload) === 'Undefined';
}

export function isNull(payload: any): payload is null {
    return getType(payload) === 'Null';
}

export const isNullOrUndefined = isOneOf(isNull, isUndefined);

export function isOneOf<A, B extends A, C extends A>(
    a: TypeGuard<A, B>,
    b: TypeGuard<A, C>
): TypeGuard<A, B | C>
export function isOneOf(
    a: AnyFunction,
    b: AnyFunction,
    c?: AnyFunction,
    d?: AnyFunction,
    e?: AnyFunction
): (value: unknown) => boolean {
    return (value) =>
        a(value) || b(value) || (!!c && c(value)) || (!!d && d(value)) || (!!e && e(value))
}
