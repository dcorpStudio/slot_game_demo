import * as _G from '../system/all_modules';
const { _, $ } = _G;

export const gameMechanic = {
   elemContainer: null as cc.Node,

   init() {
      const collisionManager = cc.director.getCollisionManager();
      collisionManager.enabled = true;

      this.elemContainer = cc.find('Canvas/play_area/elem_container');
      this.renderAllReels();

      _.log(2 % 5);
      _.log(-2 % 5);
   },

   // ==================================================
   renderAllReels() {
      const bottomColliderContainer = cc.find('Canvas/play_area/bottom_colliders');
      this.elemContainer.children.map((reelNode, i) => {
         this.renderReel(reelNode, _G.configGame.reelArr[i]);
         reelNode.bottomColliderNode = cc.find(`cell_bottom_collider_${i}`, bottomColliderContainer);
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
   spinAllReels(speedArr: number[] = [1000, 1700, 2200]) {
      this.elemContainer.children.map((reelNode, i) => {
         this.spinSingleReel(reelNode, speedArr[i]);
      });
   },


   spinSingleReel(reelNode: cc.Node, speed = 500) {
      reelNode.bottomColliderNode.active = true;
      reelNode.spinningSpeed = speed;
      reelNode.children.map(cellNode => this.startCellFalling(cellNode));
   },


   startCellFalling(cellNode: cc.Node) {
      const speed = cellNode.parent.spinningSpeed;
      cc.tween(cellNode)
         .repeatForever(
            cc.tween().by(1e4 / speed, { y: -1e4 })
         ).start();
   },

   onCellHitBottom(cellNode: cc.Node) {
      const extraHeight = cellNode.parent.children.length * cellNode.height;
      cellNode.stopAllActions();
      cellNode.y += extraHeight;
      this.startCellFalling(cellNode);
   },



   stopAllReels() {
      this.elemContainer.children.map((reelNode, i) => {
         this.stopReel(reelNode);
      });
   },

   stopReel(reelNode: cc.Node) {
      reelNode.bottomColliderNode.active = false;
      const firstCellNode = reelNode.children[0];
      let firstCellNodeY = firstCellNode.y, safeCount = 100;
      while (firstCellNodeY < 0 && safeCount--) firstCellNodeY += firstCellNode.height;
      const gapDistance = (firstCellNodeY % firstCellNode.height);
      _.log(`gapDistance = ${gapDistance}`);
      reelNode.children.map(cellNode => {
         cellNode.stopAllActions();
         cc.tween(cellNode).by(gapDistance / reelNode.spinningSpeed, { y: -gapDistance }).start();
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