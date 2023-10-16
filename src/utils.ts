export type Awaitable<T> = T | PromiseLike<T>

type Grouped<T> = Record<string, T[]>;

export function groupBy<T, K extends keyof T>(collection: T[], iteratee: K | ((item: T) => string)): Grouped<T> {
  return collection.reduce((result, item) => {
    const key = typeof iteratee === 'function' ? (iteratee as (item: T) => string)(item) : item[iteratee] as string;
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(item);
    return result;
  }, {} as Grouped<T>);
}

export default {
  groupBy,
}
