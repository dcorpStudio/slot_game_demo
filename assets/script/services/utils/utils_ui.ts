import * as _G from '../../system/all_modules';
const { _, $ } = _G;

const canvasTouchEventHandlers = {
   touchstart: [],
   touchmove: [],
   touchend: [],
};

export const utilsUI = {
   init() {
      // this.bindCanvasTouchHandler();
   },

   // ========== Nodes & Labels
   fillLabel(labelNode: cc.Node, text: string) {
      const labelComp = labelNode.getComponent(cc.Label) || labelNode.getComponent(cc.RichText);
      labelComp.string = text;
   },

   fillChildLabelByPath(node: cc.Node, path: string, text: string) {
      const labelNode = cc.find(path, node);
      if (labelNode) this.fillLabel(labelNode, text);
   },

   showOnlyChildNodeWithNameAs(parentNode: cc.Node, childNodeName: string, isUseOpacity = false) {
      let retChildNode: cc.Node;
      parentNode.children.map(childNode => {
         const isSelected = (childNode.name == childNodeName);
         if (isSelected) retChildNode = childNode;
         childNode.active = isSelected;
         if (isUseOpacity) childNode.opacity = (isSelected ? 255 : 0);
      });
      return retChildNode;
   },


   setLabelCountDownTimer(labelNode: cc.Node, targetUTC: number, timeoutCallback?: Function) {
      if (typeof labelNode === 'string') labelNode = cc.find(labelNode);
      if (labelNode.countDownTimerVar) clearInterval(labelNode.countDownTimerVar);

      const timerFunc = () => {
         if (!labelNode.parent) return clearInterval(labelNode.countDownTimerVar);
         const timeDiff = targetUTC - _.getMsPassedUTC();
         const timeDiffStr = _.secondsToTimeCountdown(_.floor(timeDiff / 1000));
         _G.utilsUI.fillLabel(labelNode, timeDiffStr);

         if (timeDiff <= 0) {
            clearInterval(labelNode.countDownTimerVar);
            if (timeoutCallback) timeoutCallback();
         };
      }
      labelNode.countDownTimerVar = setInterval(timerFunc, 500);
      timerFunc();
   },

   // fill node spriteFrame
   setNodeSprite(node: cc.Node, spriteFrame: cc.SpriteFrame) {
      if (!node || !node.getComponent(cc.Sprite)) return
      node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
   },

   // fill node spriteFrame
   setNodeSpriteFromUrl(node: cc.Node, url: string, callback?: Function) {
      if (!node || !node.getComponent(cc.Sprite)) return;
      cc.assetManager.loadRemote(url, (error, texture) => {
         if (!error) this.setNodeSprite(node, new cc.SpriteFrame(texture));
         return callback && callback(texture);
      });
   },

   // fill node spriteFrame
   setNodeSpriteFillRange(node: cc.Node, fillRange: number) {
      if (!node || !node.getComponent(cc.Sprite)) return
      node.getComponent(cc.Sprite).fillRange = fillRange;
   },



   // ===================================================
   // Touch handlers
   // ===================================================

   // add native button component to node with handler like dragging & dropping component manually
   // to exploit button trasition effect and behavior in scrollView
   makeButton(node: cc.Node | string, handlerFunc: Function, isBubble?, isMuteSound?) {
      // setTimeout to make this process run later to prevent node not initalized yet
      const myNode: cc.Node = _.isString(node) ? cc.find(node) : node;
      _.setTimeout(() => {
         if (!myNode) _.log(`undefined node path = ${node}`);
         if (!myNode.getComponent('free_button_comp')) myNode.addComponent('free_button_comp');

         const butComp = myNode.addComponent(cc.Button);
         butComp.transition = isBubble ? cc.Button.Transition.SCALE : null;
         butComp.zoomScale = node.buttonCompZoomScale || 1.2;
         const eventHandler = new cc.Component.EventHandler();
         eventHandler.target = myNode;
         eventHandler.component = 'free_button_comp';
         eventHandler.handler = 'freeHandler';
         butComp.clickEvents.push(eventHandler);

         myNode.freeButtonHandlerFunc = () => {
            handlerFunc();
            if (!isMuteSound) _G.audio.playSound('button_click');
            canvasTouchEventHandlers['touchstart'].map(f => f());
         };
      });
   },

   makeBubbleButton(node, handlerFunc) {
      return this.makeButton(node, handlerFunc, true);
   },


   singleTouchSet(node: cc.Node, touchStartFunc: Function, touchMoveFunc: Function, touchEndFunc: Function) {
      const callFuncWithEvent = (func: Function, event, touchId?) => {
         const pos = event.touch.getLocation();
         func(pos, event, touchId);
      }

      node.on('touchstart', (event) => {
         if (node._customTouchId) { return; }
         node._customTouchId = event.touch._id + 1;
         touchStartFunc && callFuncWithEvent(touchStartFunc, event, node._customTouchId);
      });

      touchMoveFunc && node.on('touchmove', (event) => {
         var tID = event.touch._id + 1;
         if (tID != node._customTouchId) return;
         if (touchMoveFunc) callFuncWithEvent(touchMoveFunc, event, tID);
      });

      var touchDestroy = (event) => {
         var tID = event.touch._id + 1;
         if (tID != node._customTouchId) return;
         node._customTouchId = null;
         if (touchEndFunc) callFuncWithEvent(touchEndFunc, event, tID);
      }

      node.on('touchend', touchDestroy);
      node.on('touchcancel', touchDestroy);
   },


   bindCanvasTouchHandler() {
      const canvasNode = cc.find('Canvas');
      this.singleTouchSet(
         canvasNode,
         (pos) => {
            canvasTouchEventHandlers['touchstart'].map(f => f(pos));
         },
         (pos) => {
            canvasTouchEventHandlers['touchmove'].map(f => f(pos));
         },
         (pos) => {
            canvasTouchEventHandlers['touchend'].map(f => f(pos));
         },
      )
   },

   addCanvasTouchHandler(eventName, func) {
      const handlerArr = canvasTouchEventHandlers[eventName];
      if (!handlerArr) return;
      handlerArr.push(func);
   },


};