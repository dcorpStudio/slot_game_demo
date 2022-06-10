import * as _G from '../system/all_modules';
const { _, $ } = _G;

const CELL_HEIGHT = 450;

export const gameMechanic = {
   elemContainer: null as cc.Node,

   init() {
      const collisionManager = cc.director.getCollisionManager();
      collisionManager.enabled = true;

      this.elemContainer = cc.find('Canvas/play_area/elem_container');
      this.renderAllReels();

      _.addPseudoUpdateFunc((dt) => this.updateFunc(dt))
   },


   updateFunc(dt) {
      this.elemContainer.children.map((reelNode) => {
         if (reelNode.isStopped) return;
         this.spinningUpdateFunc(reelNode, dt);
      });
   },

   spinningUpdateFunc(reelNode: cc.Node, dt: number) {
      const totalHeight = reelNode.totalHeight
      const passedLength = reelNode.passedLength = (reelNode.passedLength + (dt * reelNode.speed)) % totalHeight;
      reelNode.children.map((cellNode, i) => {
         const realY = i * CELL_HEIGHT + passedLength;
         cellNode.y = totalHeight - (realY % totalHeight) - CELL_HEIGHT;
      });
   },


   // ==================================================
   renderAllReels() {
      const bottomColliderContainer = cc.find('Canvas/play_area/bottom_colliders');
      this.elemContainer.children.map((reelNode, i) => {
         this.renderReel(reelNode, _G.configGame.reelArr[i]);
         reelNode.totalHeight = CELL_HEIGHT * reelNode.children.length;
         reelNode.passedLength = 0;
         reelNode.isStopped = true;
      });
   },


   renderReel(reelNode: cc.Node, reelSymboArr: number[]) {
      reelNode.removeAllChildren();
      reelSymboArr.map((symbolIndex, i) => {
         const cellNode = _.copyNode(cc.find(`Canvas/sample_nodes/cell_${symbolIndex}`), reelNode);
         cellNode.y = CELL_HEIGHT * (reelSymboArr.length - 1 - i);
      });
   },


   // ==================================================
   spinAllReels(speedArr: number[] = [1000, 1700, 2200]) {
      this.elemContainer.children.map((reelNode, i) => {
         reelNode.speed = speedArr[i];
         reelNode.isStopped = false;
      });
   },


   stopAllReels() {
      this.elemContainer.children.map((reelNode, i) => {
         this.stopReel(reelNode);
      });
   },


   stopReel(reelNode: cc.Node) {
      reelNode.isStopped = true;
      const distanceLeft = CELL_HEIGHT - reelNode.passedLength % CELL_HEIGHT;
      let xTime = distanceLeft / reelNode.speed;
      reelNode.children.map(cellNode => {
         cc.tween(cellNode).by(xTime, { y: -distanceLeft }).start();
      });
      reelNode.passedLength += distanceLeft;

      // const timeStep = 1 / 60;
      // const timerVar = _.setInterval(() => {
      //    this.spinningUpdateFunc(reelNode, (xTime < timeStep ? xTime : timeStep));
      //    xTime -= timeStep;
      //    if (xTime <= 0) _.clearInterval(timerVar);
      // }, timeStep * 1000);
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