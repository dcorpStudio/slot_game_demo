import * as _G from '../system/all_modules';
const { _, $ } = _G;

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
   onCollisionEnter(otherComp, selfComp) {
      _G.gameMechanic.onCellHitBottom(otherComp.node);
   }
}
