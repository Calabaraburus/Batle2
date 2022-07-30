import { Component, _decorator } from 'cc';
import { FieldModel } from './FieldModel';
const { ccclass, property } = _decorator;

@ccclass('FieldModelComponent')
export class FieldModelComponent extends Component {
  @property({ type: [FieldModel], visible: true, tooltip: 'Field model' })
  fieldModel: FieldModel;
}
