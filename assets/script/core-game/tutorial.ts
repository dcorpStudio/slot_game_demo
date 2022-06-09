import * as _G from '../system/all_modules';
const { _, $ } = _G;

export const tutorial = {
   node: null as cc.Node,

   isShowingTut: false,
   currentStep: 0,

   init() {
      // this.node = cc.find('Canvas/layout_tutorial');
   },


   //============= on tut start
   start() {
      this.isShowingTut = true;
      this.currentStep = 1;
   },


   onBtnContinue() {

   },


}