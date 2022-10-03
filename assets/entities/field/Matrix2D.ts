import { ReadonlyMatrix2D } from "./ReadonlyMatrix2D";

export class Matrix2D<T> extends ReadonlyMatrix2D<T> {
  constructor(rows: number, cols: number) {
    super(rows, cols, null);
  }

  set(i: number, j: number, value: T) {
    this.matrix[i * this.rows + j] = value;
  }

  toReadonly(): ReadonlyMatrix2D<T> {
    return new ReadonlyMatrix2D<T>(this.rows, this.cols, this.matrix);
  }
}
