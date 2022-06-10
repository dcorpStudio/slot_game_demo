import * as _G from '../../system/all_modules';
const _ = _G._;

export const bindButtonHandlers = {
   run() {

      const inputBg = cc.find('Canvas/play_area/CheatToolBackground/dialog/input_bg');
      const inputOptions = cc.find('Canvas/play_area/CheatToolBackground/dialog/input_options');
      const inputContainer = cc.find('Canvas/play_area/CheatToolBackground/dialog/inputs');

      let currentInputNode = null;
      inputContainer.children.map(inputNode => {
         _G.utilsUI.makeButton(inputNode, () => {
            currentInputNode = inputNode;
            inputOptions.active = true;
            inputBg.active = true;
            _.setGlobalPosToNode(inputOptions, inputNode);
         });
      });

      inputOptions.children.map(optionNode => {
         _G.utilsUI.makeButton(optionNode, () => {
            _G.utilsUI.fillLabel(currentInputNode.children[0], optionNode.name == '0' ? '-' : optionNode.name);
            _G.gameMechanic.setCheatInput(parseInt(currentInputNode.name), parseInt(optionNode.name));
            inputOptions.active = false;
            inputBg.active = false;
         });
      });

      _G.utilsUI.makeButton(inputBg, () => {
         inputOptions.active = false;
         inputBg.active = false;
      });


      // ======================

      _G.utilsUI.makeButton(
         cc.find('Canvas/play_area/CheatToolBackground/dialog/btn_toggle_cheat_tool'),
         () => _G.coreUI.toggleCheatTool()
      );

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