import { log, native } from 'cc';
import { AppMetricaCaller } from './AppMetricaCaller';

export class Analitics {

    private _appMetrikaCaller: AppMetricaCaller;

    constructor() {
        this._appMetrikaCaller = new AppMetricaCaller();
    }

    public startLevel(level: string) {
        this._appMetrikaCaller.startLevel(level);
    }

    finishLevelWin(level: string) {
        this._appMetrikaCaller.finishLevel(level, true);
    }

    finishLevelLose(level: string) {
        this._appMetrikaCaller.finishLevel(level, false);
    }
}