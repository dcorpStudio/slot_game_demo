import * as _G from '../system/all_modules';
const { _, $ } = _G;

export const gameMechanic = {
   currentDraggableElemNode: null as cc.Node,
   currentElemSprite: null as cc.SpriteFrame,

   init() {
      this.currentDraggableElemNode = cc.find('Canvas/play_area/draggable_toast');

      // TESTTTTTTTTTT
      this.setRandomDraggableElemSprite();

      const physicsManager = cc.director.getPhysicsManager()
      physicsManager.enabled = true;
      physicsManager.gravity = cc.v2(0, -640);
   },

   // ============================================
   // main game loop

   startGame() {

   },


   replay() {

   },


   onLose() {

   },



   // ============================================
   // mechanic

   onDropElem() {

   },



   // ============================================
   // object creation
   setRandomDraggableElemSprite() {
      // const spriteNodeArr = cc.find('Canvas/sprite_bank').children;
      // this.currentElemSprite = _.randomArrItem(spriteNodeArr).getComponent(cc.Sprite).spriteFrame;
      // _G.utilsUI.setNodeSprite(this.currentDraggableElemNode, this.currentElemSprite);
   },


   newPhysicalElem() {
      // const newNode = _.copyNode(cc.find('Canvas/sample_nodes/physical_toast'), cc.find('Canvas/play_area/elem_container'));
      // _.setGlobalPosToNode(newNode, this.currentDraggableElemNode);
      // this.currentDraggableElemNode.removeFromParent(true);
      // this.currentDraggableElemNode = null;
      // _G.utilsUI.setNodeSprite(newNode, this.currentElemSprite);
   },


}