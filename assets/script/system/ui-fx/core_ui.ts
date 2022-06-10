import * as _G from '../../system/all_modules';
const _ = _G._;


import { bindButtonHandlers } from './bind_button_handlers';
export const coreUI = {
   alertOKCallback: null as Function,

   init() {
      bindButtonHandlers.run();
      this.toggleCheatTool();
   },

   toggleCheatTool() {
      const dialogNode = cc.find('Canvas/play_area/CheatToolBackground/dialog');
      const isShowing = dialogNode.y == 0;
      dialogNode.y = isShowing ? dialogNode.height : 0;
      cc.find('Canvas/play_area/CheatToolBackground/dialog/Arrow').angle = isShowing ? 0 : 180;
      _G.gameMechanic.isCheating = !isShowing;
   },


}