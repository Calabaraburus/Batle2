//  Bot.ts - ClbBlast
//
//  Calabaraburus (c) 2022
//
//  Author:Natalchishin Taras

import { randomRange, randomRangeInt, tween, _decorator } from "cc";
import { FieldAnalizer } from "../entities/field/FieldAnalizer";
import type { ITileField } from "../entities/field/ITileField";
import {
  AnalizedData,
  TileTypeToConnectedTiles,
} from "../entities/field/AnalizedData";

import { IBot } from "./IBot";
import { FieldController } from "../entities/field/FieldController";
import { TileController } from "../entities/tiles/TileController";
import { StdTileController } from "../entities/tiles/UsualTile/StdTileController";
import { Service } from "../entities/services/Service";
import { TileService } from "../entities/services/TileService";
import { PlayerModel } from "../models/PlayerModel";
import { DataService } from "../entities/services/DataService";
import { MnemonicMapping } from "../models/MnemonicMapping";
import { GameManager } from "../entities/game/GameManager";
const { ccclass, property } = _decorator;

@ccclass("Bot")
export class Bot extends Service implements IBot {
  @property({ type: FieldController })
  field: ITileField;
  private _analizer: FieldAnalizer;
  private _botAnalizator: NextStepAttackTilesBotAnalizator;
  private _cardAnalizator: FirewallCardBotAnalizator;
  private _botModel: PlayerModel | null | undefined;
  private _dataService: DataService | null;
  private _tileService: TileService | null;
  private _gameManager: GameManager | null;

  public get dataService() {
    return this._dataService;
  }

  public get tileService() {
    return this._tileService;
  }

  public get botModel() {
    return this._botModel;
  }

  start() {
    this._botAnalizator = new NextStepAttackTilesBotAnalizator();
    this._cardAnalizator = new FirewallCardBotAnalizator();
    this._botAnalizator.bot = this;
    this._cardAnalizator.bot = this;
    this._dataService = this.getService(DataService);
    this._tileService = this.getService(TileService);
    this._gameManager = this.getService(GameManager);

    if (this._dataService?.field != null)
      this._analizer = new FieldAnalizer(this._dataService?.field);
    this._botModel = this._dataService?.botModel;
  }

  public move(): void {
    let analized_data = this._analizer.analize();
    const attackingTiles = this._analizer.getAttackingTiles("end", "player");

    const tilesMove = () => {
      console.log("[Bot] Search for cull strategy");

      const largestGroup = this.getMaxConnected(analized_data.connectedTiles);
      const largestSpecGroup = this.getMaxConnectedSpecCol(
        analized_data.connectedTiles,
        attackingTiles
      );

      const atkWeight = this.calcAttacked(true) - this.calcAttacked(false);
      console.log(`[Bot] Atack weight: ${atkWeight}`);

      if (atkWeight < 0) {
        if (largestSpecGroup != null) {
          console.log(`[Bot] click spec group. Protect`);
          this.pressTile(largestSpecGroup.connectedTiles);
        } else {
          console.log(`[Bot] click largest group.`);
          this.pressTile(largestGroup.connectedTiles);
        }
      } else {
        console.log(`[Bot] analize for attacking.`);
        this._botAnalizator.analize(analized_data);
        if (this._botAnalizator.weight < 1) {
          this.pressTile(largestGroup.connectedTiles);
        } else {
          console.log(`[Bot] Attack.`);
          this._botAnalizator.decide();
        }
      }

      return true;
    };

    console.log("[Bot] analize cards");
    if (this._cardAnalizator.analize(analized_data) >= 1) {
      this._cardAnalizator.decide();
      console.log("[Bot] deside too activate card");
      const timeObj = { time: 0 };
      const tw = tween(timeObj);

      const embedTween = tween(timeObj)
        .call(() => {
          console.log("[Bot] wait for behaviours");

          if (!this._gameManager?.isBehavioursInProccess) {
            console.log("[Bot] All behaviours stop to prossed");
            console.log("[Bot] Reanalize data");

            analized_data = this._analizer.analize();

            tilesMove();
            tw.stop();
            console.log("[Bot] Stop waiting for behaves");
          }
        })
        .delay(1);

      tw.delay(3).repeat(10, embedTween).start();
    } else {
      tilesMove();
    }
  }

  pressTile(tiles: Set<TileController>) {
    const tileId = randomRangeInt(0, tiles.size);
    const tileToPress = Array.from(tiles.values());
    tileToPress[tileId].clicked();
  }

  private getMaxConnected(
    connects: TileTypeToConnectedTiles[]
  ): TileTypeToConnectedTiles {
    return connects
      .filter((c) => c.tileModel.containsTag("player"))
      .reduce(
        (acc, connect) =>
          (acc =
            this.countShielded(acc.connectedTiles) >
            this.countShielded(connect.connectedTiles)
              ? acc
              : connect),
        connects[0]
      );
  }

  private countShielded(tiles: Set<TileController>, shielded = true): number {
    let result = 0;
    tiles.forEach((t) => {
      if (t instanceof StdTileController) {
        if (shielded ? !t.shieldIsActivated : t.shieldIsActivated) {
          result++;
        }
      }
    });

    return result;
  }

  private getMaxConnectedSpecCol(
    connects: TileTypeToConnectedTiles[],
    specTiles: TileController[]
  ): TileTypeToConnectedTiles | null {
    const connects2: TileTypeToConnectedTiles[] = [];
    specTiles.forEach((specTile) => {
      this.field.fieldMatrix.forEachCol(specTile.col, (tile) => {
        if (tile.tileModel.containsTag("player")) {
          const fc = connects.find((c) => c.connectedTiles.has(tile));
          if (fc != undefined) {
            connects2.push(fc);
          }
        }
      });
    });

    if (connects2.length == 0) {
      return null;
    }

    return connects2
      .filter((c) => c.tileModel.containsTag("player"))
      .reduce(
        (acc, connect) =>
          (acc =
            this.countShielded(acc.connectedTiles) >
            this.countShielded(connect.connectedTiles)
              ? acc
              : connect),
        connects2[0]
      );
  }

  private analize(): boolean {
    throw new Error();
    //field.logicField;
  }

  private calcAttacked(byMe = true): number {
    let result = 0;
    for (let index = 0; index < this.field.fieldModel.cols; index++) {
      const startTile = this.field.getStartTile(index);
      const endTile = this.field.getEndTile(index);

      if (startTile != null && endTile != null) {
        const frwd = endTile?.row - startTile?.row > 0 ? true : false;
        const rowId =
          (byMe ? startTile.row : endTile.row) + (frwd && byMe ? 1 : -1);

        const tile = this.field.fieldMatrix.get(rowId, index);
        if (tile.tileModel.containsTag(byMe ? "enemy" : "player")) {
          result++;
        }
      }
    }

    return result;
  }
}

export class BotAnalizator {
  bot: Bot;

  private _weight = 0;
  public get weight() {
    return this._weight;
  }

  protected set weight(value: number) {
    this._weight = value;
  }

  getBonus(tileMnem: string) {
    if (this.bot.botModel == null) return null;
    return this.bot.botModel.bonuses.find((b) => (b.mnemonic = tileMnem));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  analize(data: AnalizedData): number {
    throw Error("Not implemented method");
  }

  decide() {
    throw Error("Not implemented method");
  }
}

export class NextStepAttackTilesBotAnalizator extends BotAnalizator {
  resultTiles: TileTypeToConnectedTiles;
  decide() {
    this.bot.pressTile(this.resultTiles.connectedTiles);
  }

  analize(data: AnalizedData): number {
    const field = this.bot.field;
    let tci = -1;
    let wmax = -1;

    data.connectedTiles.forEach((ct, ci) => {
      const tcolMap: number[] = [];
      let lmax = 0;

      if (ct.tileModel.containsTag("enemy")) {
        return;
      }

      ct.connectedTiles.forEach((t, i) => {
        if (t instanceof StdTileController) {
          if (!t.shieldIsActivated) {
            if (isNaN(tcolMap[t.col])) {
              tcolMap[t.col] = 0;

              field.fieldMatrix.forEachCol(t.col, (tile) => {
                if (tile.tileModel.containsTag("player")) tcolMap[t.col]--;
              });
            }
            tcolMap[t.col]++;
          }
        }
      });

      tcolMap.forEach((n) => {
        if (n == 0) {
          lmax += 2;
        } else {
          lmax += -n / field.fieldModel.rows;
        }
      });

      if (wmax < lmax) {
        tci = ci;
        wmax = lmax;
        this.resultTiles = ct;
      }
    });

    this.weight = wmax;
    return wmax;
  }
}

export class LightningCardBotAnalizator extends BotAnalizator {
  decide() {
    //this.bot.pressTile(this.resultTiles.connectedTiles);
  }
}
export class ShieldCardBotAnalizator extends BotAnalizator {}
export class FirewallCardBotAnalizator extends BotAnalizator {
  tileToInvoke: TileController | null;
  procentToInvoke = 0.8;

  decide() {
    const card = this.getBonus("firewall");
    if (card == null) return 0;

    card.active = true;
    this.bot.botModel?.setBonus(card);
    console.log("[Bot] Activate bonus firewall");

    this.tileToInvoke?.clicked();
    console.log(
      `[Bot] Click tile r:${this.tileToInvoke?.row} c:${this.tileToInvoke?.col}`
    );
  }

  analize(data: AnalizedData): number {
    this.tileToInvoke = null;
    if (this.bot.tileService == null) return 0;
    if (this.bot.botModel == null) return 0;
    this.weight = 0;
    const card = this.getBonus("firewall");
    if (card == null) return 0;

    if (card.price > this.bot.botModel.manaCurrent) return 0;

    for (let index = 0; index < this.bot.field.fieldMatrix.cols; index++) {
      const tiles = this.bot.tileService
        .getTilesByTagInColumn(index, "player")
        .filter((t) => {
          if (t instanceof StdTileController) {
            return !t.shieldIsActivated;
          } else {
            return true;
          }
        });

      const coef = Math.exp(-1 * (tiles.length - 5) ** 2);
      const desision = coef * randomRange(0.5, 1);
      if (desision > this.procentToInvoke) {
        if (tiles.length > 0) {
          this.tileToInvoke = tiles[Math.ceil((tiles.length - 1) / 2)];
          this.weight = 1;
          return 1;
        }
      }
    }

    return 0;
  }
}

enum BotAnalizatorTypes {
  Attacking = 0,
  Protecting = 1,
}
