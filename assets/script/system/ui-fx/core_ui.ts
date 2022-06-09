import * as _G from '../../system/all_modules';
const _ = _G._;


import { bindButtonHandlers } from './bind_button_handlers';
export const coreUI = {
   alertOKCallback: null as Function,

   init() {
      // this.adjustUI();
      bindButtonHandlers.run();
   },

   // =================================================================
   // UI SIZE ADJUSTMENT
   // =================================================================

   // adjuts UI to fit
   adjustUI() {
      const maxRatio = 720 / 1280;
      const actualRatio = cc.winSize.width / cc.winSize.height;
      if (actualRatio > maxRatio) {
         cc.find('Canvas').getComponent(cc.Canvas).fitWidth = false;
         cc.find('Canvas').getComponent(cc.Canvas).fitHeight = true;
      }

      // make layout height = windows height
      const layoutArr = [
         'Canvas/play_area',
         'Canvas/bg',
         'Canvas/control_layer',
         'Canvas/layout_win',
         'Canvas/layout_settings',
         'Canvas/fx_container',
         'Canvas/nag_screen',
         'Canvas/layout_fixed_header',
         'Canvas/layout_tutorial',
      ].map(path => {
         const layerNode = cc.find(path);
         layerNode.height = cc.winSize.height;
      });
   },



   // =================================================================
   // LAYOUTS
   // =================================================================

   // =======
   showLayout(layout: cc.Node | string) {
      const layoutNode: cc.Node = (_.isString(layout) ? cc.find(`Canvas/${layout}`) : layout);
      layoutNode.active = true;
   },

   hideLayout(layout: cc.Node | string) {
      const layoutNode: cc.Node = (_.isString(layout) ? cc.find(`Canvas/${layout}`) : layout);
      layoutNode.active = false;
   },



   // ========
   showAlert(msg, okCallback?: Function) {
      this.showLayout("layer_alert");
      _G.utilsUI.fillLabel(cc.find('Canvas/layer_alert/bg_msg/label_msg'), msg);
      this.alertOKCallback = okCallback;
   },

   // =======
   hideLoadingTimer: null,
   showLoading() {
      this.showLayout("layer_loading");

      // auto turn off loading if shown more than 10 secs but not being turned off
      if (this.hideLoadingTimer) clearTimeout(this.hideLoadingTimer);
      this.hideLoadingTimer = setTimeout(() => this.hideLoading(), 10000);
   },
   hideLoading() {
      this.hideLayout("layer_loading");
      if (this.hideLoadingTimer) clearTimeout(this.hideLoadingTimer);
   },


   // =========
   // nag screen: prevent user from clicking buttons while showing animations
   showNagScreen(timeout?: number) {
      cc.find('Canvas/nag_screen').active = true;
      if (timeout) _.setTimeout(() => this.hideNagScreen(), timeout * 1000);
   },
   hideNagScreen() {
      cc.find('Canvas/nag_screen').active = false;
   },


   // ====== Some system labels ================
   // update gold to all places in game ui
   updateUserStats(isSkipUpdateUI = false) {

   },

}