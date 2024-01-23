import { GameCardCfgModel } from "../game/GameCardCfgModel";

export class PlayerCurrentGameState {
    hero: string;
    life: number;
    cards: GameCardCfgModel[] = [];
    finishedLevels: string[] = [];
    currentLvl: string;

    public levelExists(lvlName: string) {
        return this.finishedLevels.findIndex(l => l == lvlName) > 0;
    }

    public addLevel(lvlName: string) {
        if (!this.levelExists(lvlName)) {
            this.finishedLevels.push(lvlName);
        }
    }



    //public AddOrUpdateBonus(bonusName: string) {

    //}
}

export class CardUpdater {
    public static CardsEquality(c1Mnem: string, c2Mnem: string) {

    }
}
