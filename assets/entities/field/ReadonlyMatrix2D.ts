export class ReadonlyMatrix2D<T> {
  protected matrix: T[];

  private _rows: number;
  get rows(): number {
    return this._rows;
  }

  private _cols: number;
  get cols(): number {
    return this._cols;
  }

  constructor(rows: number, cols: number, matrix: T[] | null) {
    this._rows = rows;
    this._cols = cols;
    this.matrix = matrix == null ? new Array<T>() : matrix;
  }

  get(row: number, col: number): T {
    return this.matrix[row * this.rows + col];
  }

  forEach(callback: (item: T, i: number, j: number) => void) {
    for (let rowIndex = 0; rowIndex < this._rows; rowIndex++) {
      for (let colIndex = 0; colIndex < this._cols; colIndex++) {
        callback(this.get(rowIndex, colIndex), rowIndex, colIndex);
      }
    }
  }

  forEachInRow(rowId: number, callback: (item: T, colId: number) => void) {
    for (let colIndex = 0; colIndex < this._cols; colIndex++) {
      callback(this.get(rowId, colIndex), colIndex);
    }
  }

  forEachCol(colId: number, callback: (item: T, rowId: number) => void) {
    for (let rowIndex = 0; rowIndex < this._rows; rowIndex++) {
      callback(this.get(rowIndex, colId), rowIndex);
    }
  }

  filter(filtFunc: (val: T) => boolean): T[] {
    return this.matrix.filter(filtFunc);
  }
}
