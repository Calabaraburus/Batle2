import { Component, _decorator } from 'cc';
import { LevelModel } from '../../models/LevelModel';
import { LevelView } from './LevelView';
const { ccclass, property } = _decorator;

/** Controls level view. */
@ccclass('LevelController')
export class LevelController extends Component {

    /** Level view */
    @property({ type: LevelView })
    view: LevelView;

    /** Level model */
    @property({ type: LevelModel })
    model: LevelModel;

    start() {
        this.view.updateData(this.model);
    }
}

