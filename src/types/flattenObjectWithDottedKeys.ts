export type FlattenObjectWithDottedKeys<T> = T extends Record<
  string | number,
  unknown
>
  ? {
      [K in keyof T]: `${K extends string | number
        ? K
        : never}${T[K] extends Record<string, unknown>
        ? `.${FlattenObjectWithDottedKeys<T[K]>}`
        : ''}`;
    }[keyof T]
  : '';
