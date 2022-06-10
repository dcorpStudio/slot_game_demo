import * as _G from '../system/all_modules';
const { _, $ } = _G;

export const gameMechanic = {
   init() {
      this.renderAllReels();
   },

   spinAllReels() {

   },

   spinSingleReel(reelNode: cc.Node) {

   },

   renderAllReels() {
      cc.find('Canvas/play_area/elem_container').children.map((childNode, i) => {
         this.renderReel(childNode, _G.configGame.reelArr[i]);
      });
   },

   renderReel(reelNode: cc.Node, reelSymboArr: number[]) {
      _.log(` reelSymboArr  =${reelSymboArr} `);
      reelNode.removeAllChildren();
      reelSymboArr.map((symbolIndex, i) => {
         const cellNode = _.copyNode(cc.find(`Canvas/sample_nodes/cell_${symbolIndex}`), reelNode);
         cellNode.y = cellNode.height * i;
         _.log(` symbolIndex ${i} cellNode.y=${cellNode.y} `);
      });
   },

   // ============================================
   // main game loop

   startGame() {

   },


   replay() {

   },


   onLose() {

   },



}