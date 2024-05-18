import { GameCardCfgModel } from "../game/GameCardCfgModel";

export class PlayerCurrentGameState {
    hero: string;
    life: number;
    cards: GameCardCfgModel[] = [];
    finishedLevels: string[] = [];
    events: string[] = [];
    currentLvl: string;

    static getDefault() {
        const state = new PlayerCurrentGameState();

        state.events = ['intro', 'arena', 'ending'];

        return state;
    }

    public levelExists(lvlName: string) {
        return this.finishedLevels.findIndex(l => l == lvlName) >= 0;
    }

    public eventExists(eventName: string) {
        return this.events.findIndex(l => l == eventName) >= 0;
    }

    public removeEvent(eventName: string) {
        const index = this.events.indexOf(eventName, 0);
        if (index > -1) {
            this.events.splice(index, 1);
        }
    }

    public addLevel(lvlName: string) {
        if (!this.levelExists(lvlName)) {
            this.finishedLevels.push(lvlName);
        }
    }
}

export class CardUpdater {
    public static CardsEquality(c1Mnem: string, c2Mnem: string) {

    }
}
