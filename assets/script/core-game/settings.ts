import * as _G from '../system/all_modules';
const { _, $ } = _G;

const entryNameArr = ['sound', 'music'];
const defaultEntryValue = { music: true, sound: true, language: 'en_US' };

export const settings = {
   node: null as cc.Node,
   sound: true,
   music: true,

   isInitialized: false,

   init() {
      // this.node = cc.find('Canvas/layout_settings');
   },

   bindSwitcherButtonHandlers() {
      [
         cc.find('switcher_sound', this.entryContainerNode),
         cc.find('switcher_music', this.entryContainerNode),
      ].map(switcherNode => {
         _G.utilsUI.makeButton(switcherNode, () => {
            const entryName = switcherNode.name.replace('switcher_', '');
            this.setEntryValue(entryName, !this[entryName]);
         });
      });
   },


   setEntryValue(entryName, value) {
      // update value & save value to DB
      this[entryName] = value;
      this.setSwitcherOnOff(entryName, value); // update switcher in layout settings

      if (entryName == 'music') {
         if (value) _G.audio.playBgMusic();
         else _G.audio.stopBgMusic();
      }
   },


   setSwitcherOnOff(entryName, value) {
      const switcherNode = cc.find(`switcher_${entryName}`, this.entryContainerNode);
      if (!switcherNode) return;
      _G.utilsUI.showOnlyChildNodeWithNameAs(switcherNode, (value ? 'on' : 'off'));
   },


}