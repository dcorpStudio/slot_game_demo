import * as _G from '../../system/all_modules';
const _ = _G._;


export const utilsAnimFx = {
   fxNodePool: {},

   init() {

   },


   replayParticle(node: cc.Node) {
      if (!node || !node.getComponent(cc.ParticleSystem)) return;
      node.active = true;
      node.getComponent(cc.ParticleSystem).resetSystem();
   },

   // play a clip attached to animation component of a node
   playNodeAnim(node: cc.Node, clipName?: string, repeatTime?: number, isKeepPreviousClip = false, callback?: Function) {
      const animComp = node.getComponent(cc.Animation);
      if (!node.activeInHierarchy || !animComp) return;
      clipName = clipName || (animComp.defaultClip ? animComp.defaultClip.name : '');
      if (!clipName) return;

      const animState = animComp[isKeepPreviousClip ? 'playAdditive' : 'play'](clipName);
      if (!animState) return;
      animState.repeatCount = (repeatTime == -1 ? Infinity : repeatTime) || 1;

      if (callback) animComp.on('finished', () => {
         animComp.off('finished');
         callback();
      });

      return animState;
   },

   playNodeAnimAsSoonAsNodeActive(node: cc.Node, clipName?: string, repeatTime = 1, isKeepPreviousClip = true) {
      const varName = 'waitInterval2PlayAnimWhenActive';
      node[varName] = _.waitToRun(() => {
         if (node[varName]) clearInterval(node[varName]);
         this.playNodeAnim(node, clipName, repeatTime, isKeepPreviousClip);
      }, 'activeInHierarchy', node);
   },


   // play a clip attached to animation component of a node
   playNodeAnimArr(node: cc.Node, orgClipNameArr?: string[], isKeepPreviousClip = false, callback?: Function) {
      if (!node.activeInHierarchy) return;
      const animComp = node.getComponent(cc.Animation);
      if (!node.activeInHierarchy || !animComp) return;
      const clipNameArr = [...orgClipNameArr];
      animComp.on('finished', () => {
         if (clipNameArr.length) this.playNodeAnim(node, clipNameArr.shift(), 1, isKeepPreviousClip);
         else {
            animComp.off('finished');
            if (callback) callback();
         }
      });
      this.playNodeAnim(node, clipNameArr.shift(), 1, isKeepPreviousClip);
   },

   stopAllNodeAnims(node: cc.Node) {
      const animComp = node.getComponent(cc.Animation);
      if (!animComp) return;
      animComp.stop();
      animComp.off('finished');
   },

   // reset a node at state of frame 0 of an animation clip
   stopAnimAtFrame0(node: cc.Node, clipName: string) {
      const animComp = node.getComponent(cc.Animation);
      animComp.play('ufo_ring_fx');
      _.setTimeout(() => {
         animComp.setCurrentTime(0);
         this.stopAllNodeAnims(node)
      });
   },


   // subtrack current number from 
   playIncreasingNumberLabel(labelNode: cc.Node, oldNumber: number, addedAmount: number, updateCount = 5, duration = 0.5, delayStartTime = 0, template = 'xxx') {
      // get current number on label
      const labelComp = labelNode.getComponent(cc.Label);
      const incrementAmount = addedAmount / updateCount;
      const updateDelay = duration / updateCount;

      cc.tween(labelNode).delay(delayStartTime).repeat(
         updateCount,
         cc.tween().call(() => {
            oldNumber += incrementAmount;
            const currentNumberStr = _.formatMoney(_.round(oldNumber));
            labelComp.string = template.replace(/xxx/g, currentNumberStr);
            // _.log(` playIncreasingNumberLabel >> currentNumberStr = ${currentNumberStr} // labelComp.string=${labelComp.string} `);
         }).delay(updateDelay)
      ).start();
   },


   // handle node pool
   getNewFxNode(sampleNode: cc.Node, fxContainer: cc.Node) {
      if (!sampleNode.nodePoolId) sampleNode.nodePoolId = _.getNewUuid();
      if (!this.fxNodePool[sampleNode.nodePoolId]) this.fxNodePool[sampleNode.nodePoolId] = [];
      const newNode = this.fxNodePool[sampleNode.nodePoolId].pop() || _.copyNode(sampleNode);
      newNode.nodePoolId = sampleNode.nodePoolId;
      newNode.parent = fxContainer || _G.coreFX.fxContainer;
      return newNode;
   },


   saveFxNodeToPool(node: cc.Node) {
      node.stopAllActions();
      node.active = false;
      this.fxNodePool[node.nodePoolId].unshift(node);
   },


   // particles fly from node A to node B
   particlesFlyFromA2B(sampleNode: cc.Node, nodeA: cc.Node, nodeB: cc.Node, animConfig?: any, fxContainer?: cc.Node) {
      const defaultParticleFlyA2BConfigs = {
         numberOfNode: 20,
         delayStartTime: 0.05,
         flyDuration: 1,
         randomBezierPointRange: { x: 200, y: 200 },  // x > 0 & y > 0
      }
      const { numberOfNode, flyDuration, delayStartTime, randomBezierPointRange } = animConfig || defaultParticleFlyA2BConfigs;
      const posDiffVec2 = _.getGlobalPosDiff(nodeA, nodeB);
      // _.log(` particlesFlyFromA2B >> posDiffVec2 = ${posDiffVec2} // numberOfNode=${numberOfNode}, flyDuration=${flyDuration}, delayTimeEachNode=${delayTimeEachNode} `);
      for (let i = 0; i < numberOfNode; i++) {
         const newNode = this.getNewFxNode(sampleNode, fxContainer);
         newNode.active = true;
         newNode.opacity = 255;
         _.setGlobalPosToNode(newNode, nodeA);
         const bezierP1 = this.getRandomPointInRage(randomBezierPointRange);
         const bezierP2 = this.getRandomPointInRage(randomBezierPointRange);
         cc.tween(newNode)
            .delay(i * delayStartTime)
            .bezierBy(flyDuration, bezierP1, bezierP2, posDiffVec2)
            .call(() => { this.saveFxNodeToPool(newNode); })
            .start();
      }
   },

   getRandomPointInRage(pointRange) {
      return cc.v2(
         _.randomNumber(pointRange.x * 2) - pointRange.x,
         _.randomNumber(pointRange.y * 2) - pointRange.y
      );
   },


   // fly a node to position of another
   nodeFlyFromAtoB(node: cc.Node, targetNode: cc.Node, duration: number = 0.3, callback?: Function) {
      const diffVec = _.getGlobalPosDiff(node, targetNode);
      cc.tween(node).by(duration, { position: diffVec }).call(() => callback && callback()).start();
   },



   // ===========================================
   // screenshot a node to get spriteFrame (jpg)
   // *** NOTE: CODE NOT WORKING !!! JUST COPIED FROM ANOTHER PLACE

   captureNodeToTexture(targetNode: cc.Node) {
      if (!targetNode.activeInHierarchy) targetNode.active = true;

      const cameraNode = new cc.Node();
      targetNode.addChild(cameraNode);
      let cameraComp = cameraNode.addComponent(cc.Camera);
      let texture = new cc.RenderTexture();

      let gl = cc.game._renderContext;
      texture.initWithSize(targetNode.width, targetNode.height, gl.STENCIL_INDEX8);
      cameraComp.targetTexture = texture;
      cameraComp.zoomRatio = 1.3;

      cameraComp.backgroundColor = cc.Color.WHITE;
      cameraComp.clearFlags = cc.Camera.ClearFlags.DEPTH | cc.Camera.ClearFlags.STENCIL | cc.Camera.ClearFlags.COLOR;
      // cameraComp.cullingMask = 0xffffffff;

      let width = texture.width;
      let height = texture.height;
      let _canvas = document.createElement('canvas');
      _canvas.width = width;
      _canvas.height = height;

      let ctx = _canvas.getContext('2d');
      cameraComp.render(targetNode);
      let data = texture.readPixels();
      // write the render data

      let rowBytes = width * 4;
      for (let row = 0; row < height; row++) {
         let srow = height - 1 - row;
         let data2 = new Uint8ClampedArray(data.buffer, srow * width * 4, rowBytes);
         let imageData = new ImageData(data2, width, 1);
         ctx.putImageData(imageData, 0, row);
      }

      const dataURL = _canvas.toDataURL("image/jpeg");

      setTimeout(() => {
         targetNode.active = false;
         cameraNode.removeFromParent();
      }, 1000);

      return dataURL;
   }


}