import * as _G from '../../system/all_modules';
const { _, $ } = _G;


export const coreFX = {
   fxContainer: null as cc.Node,

   init() {

   },

   playWinFx(callback?: Function) {
      const node = cc.find('Canvas/play_area/Win');
      node.scale = 0;
      node.active = true;
      cc.tween(node)
         .to(0.2, { scale: 1.4 })
         .to(0.4, { scale: 0.9 })
         .to(0.2, { scale: 1.2 })
         .to(0.4, { scale: 1 })
         .delay(0.4)
         .to(0.3, { scale: 0 })
         .call(() => callback && callback())
         .start();
   },
}