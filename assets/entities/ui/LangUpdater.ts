import { _decorator, Component, log, Node, resources, SpriteFrame } from 'cc';
import { ComboRow } from './combobox/ComboRow';
import { Combobox } from './combobox/Combobox';
import { t, init as init_i18t, languageList, _language, updateSceneRenderers } from '../../../extensions/i18n/assets/LanguageData';
const { ccclass, property } = _decorator;

@ccclass('LangUpdater')
export class LangUpdater extends Component {

    @property(Combobox)
    combobox: Combobox;

    start() {
        this.combobox.rowlistNode.children.length = 0;
        this.combobox.rows = [];
        this.combobox.selectedEvent.on("Combobox", () => {
            if (_language != this.combobox.selectedRow.id) {
                init_i18t(this.combobox.selectedRow.id);
                updateSceneRenderers();
            }
        }, this);

        for (const key in languageList()) {
            resources.load(`images/flags/${key}/spriteFrame`, SpriteFrame, (err, spriteFrame) => {
                this.combobox.add(spriteFrame, t(`languages.${key}`), key);
                if (key == _language) {
                    this.combobox.select(_language);
                }
            });
        }
    }
}


