import * as _G from '../../system/all_modules';
const { _, $ } = _G;

const { ccclass, property } = cc._decorator;
@ccclass
export default class freeButtonComp extends cc.Component {
    freeHandler(e) {
        if (e.target.freeButtonHandlerFunc) e.target.freeButtonHandlerFunc(e.target);
    }
}
