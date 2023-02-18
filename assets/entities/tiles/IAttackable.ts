//  IAttackable.ts - ClbBlast
//
//  Calabaraburus (c) 2023
//
//  Author:Natalchishin Taras

/** Defines can be ataked ability. External units can atack this unit. */
export interface IAttackable {
  /** Attack this unit with power.
   * @power Power.
   */
  attack(power: number): void;
}
