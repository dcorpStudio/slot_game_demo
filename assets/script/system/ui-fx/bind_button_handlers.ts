import * as _G from '../../system/all_modules';
const _ = _G._;

export const bindButtonHandlers = {
   run() {
      const btnSpin = cc.find('Canvas/play_area/btn_spin')
      _G.utilsUI.makeButton(btnSpin, () => {
         cc.find('disabled', btnSpin).active = true;
         _G.gameMechanic.startRandomSpinning();
      });


      _G.utilsUI.makeButton(
         cc.find('Canvas/play_area/btn_stop'),
         () => {
            _G.gameMechanic.stopAllReels();
         }
      )
   },



}