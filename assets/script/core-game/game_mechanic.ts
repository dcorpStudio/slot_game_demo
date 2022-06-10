import * as _G from '../system/all_modules';
const { _, $ } = _G;

export const gameMechanic = {
   elemContainer: null as cc.Node,

   init() {
      const collisionManager = cc.director.getCollisionManager();
      collisionManager.enabled = true;

      this.elemContainer = cc.find('Canvas/play_area/elem_container');
      this.renderAllReels();
   },

   // ==================================================
   renderAllReels() {
      this.elemContainer.children.map((childNode, i) => {
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


   // ==================================================
   spinAllReels() {
      this.elemContainer.children.map((childNode, i) => {
         this.spinSingleReel(childNode);
      });
   },

   spinSingleReel(reelNode: cc.Node) {
      reelNode.children.map(cellNode => {
         cc.tween(cellNode).repeatForever(
            cc.tween().by(5, { y: -9999 })
         ).start();
      });
   },


   onCellHitBottom(cellNode: cc.Node) {
      _.log(` onCellHitBottom cellNode.y=${cellNode.y} `);
      cellNode.y += cellNode.parent.children.length * cellNode.height;
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