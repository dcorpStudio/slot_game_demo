import * as _G from '../../system/all_modules';
const _ = _G._;

export const bindButtonHandlers = {
   run() {
      _G.utilsUI.makeButton(
         cc.find('Canvas/play_area/btn_spin'),
         () => {
            _G.gameMechanic.spinAllReels();
         }
      )
   },



}