// Project: Batle2
//
// Author: Natalchishin Taras
//
// Calabaraburus (c) 2023

import { ReadonlyMatrix2D } from "./ReadonlyMatrix2D";

export class Matrix2D<T> extends ReadonlyMatrix2D<T> {
  constructor(rows: number, cols: number) {
    super(rows, cols, null);
  }

  set(row: number, col: number, value: T) {
    this.matrix[col * this.rows + row] = value;
  }

  toReadonly(): ReadonlyMatrix2D<T> {
    return new ReadonlyMatrix2D<T>(this.rows, this.cols, this.matrix);
  }
}
