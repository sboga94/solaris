declare module '@devexpress/dx-core' {
    type Mutable<T> = { -readonly [P in keyof T]: T[P] };
  }