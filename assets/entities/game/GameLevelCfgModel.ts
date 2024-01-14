import { GameCardCfgModel } from "./GameCardCfgModel";


export class GameLevelCfgModel {
    arcName: string;
    lvlName: string;
    playerHeroName: string;
    botHeroName: string;

    playerLife: number;
    botLife: number;

    playerCards: GameCardCfgModel[] = [];
    botCards: GameCardCfgModel[] = [];

}
