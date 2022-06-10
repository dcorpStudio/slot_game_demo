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
      reelNode.removeAllChildren();
      reelSymboArr.map((symbolIndex, i) => {
         const cellNode = _.copyNode(cc.find(`Canvas/sample_nodes/cell_${symbolIndex}`), reelNode);
         cellNode.y = cellNode.height * i;
      });
   },


   // ==================================================
   spinAllReels() {
      this.elemContainer.children.map((childNode, i) => {
         this.spinSingleReel(childNode);
      });
   },

   spinSingleReel(reelNode: cc.Node) {
      reelNode.children.map(cellNode => this.startCellFalling(cellNode));
   },

   startCellFalling(cellNode: cc.Node) {
      cc.tween(cellNode).repeatForever(
         cc.tween().by(5, { y: -9999 })
      ).start();
   },

   onCellHitBottom(cellNode: cc.Node) {
      const extraHeight = cellNode.parent.children.length * cellNode.height;
      cellNode.stopAllActions();
      cellNode.y += extraHeight;
      this.startCellFalling(cellNode);
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