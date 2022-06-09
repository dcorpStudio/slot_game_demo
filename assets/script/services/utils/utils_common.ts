import * as _G from '../../system/all_modules';

import timeFunctions from './utils_time'  // time supportive functions
import coordinateFunctions from './utils_coordinate'  // time supportive functions

let uuidIndex = 1e5; // uuid to set as names of objects => help identifying objects


// function to get nodeProps object
export const $ = (node: cc.Node, simulationID = 0) => {
   _.$callCount = (_.$callCount || 0) + 1;

   if (node.name != _G.types.elem.card) simulationID = 0;
   const props: _G.types.elemProps = node[`props_${simulationID}`] || {};
   return node[`props_${simulationID}`] = props;
}

$.clean = (node: cc.Node, simulationID = 0) => {
   if (simulationID == 0) return;
   delete node[`props_${simulationID}`];
}


export const _ = {
   NO_CONSOLE_LOG: false,
   // NO_CONSOLE_LOG: true,

   //=== device info
   isANDROID: (cc.sys.os == cc.sys.OS_ANDROID),
   isIOS: (cc.sys.os == cc.sys.OS_IOS),

   //--- Math
   max: Math.max,
   min: Math.min,
   round: Math.round,
   floor: Math.floor,
   ceil: Math.ceil,
   sign: Math.sign,
   abs: Math.abs,
   pow: Math.pow,
   random: Math.random,
   sqrt: Math.sqrt,
   sin: Math.sin,
   cos: Math.cos,
   tan: Math.tan,
   atan: Math.atan,
   atan2: Math.atan2,
   log10: Math.log10,
   PI: Math.PI,

   randomArrItem(arr: any[], isRemoveItem = false) {
      const iRandom = Math.floor(Math.random() * arr.length);
      return (isRemoveItem ? arr.splice(iRandom, 1)[0] : arr[iRandom]);
   },

   isString(x: any) {
      return typeof x === 'string';
   },

   isFunction(functionToCheck: any) {
      return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
   },

   log(...args: any[]) {
      if (!this.NO_CONSOLE_LOG) try { console.log(...args) } catch (e) { }
   },


   // ========= Misc
   getNewUuid() {
      return uuidIndex++;
   },

   // ========== array
   removeArrayItem(arr: any[], item: any) {
      const index = arr.indexOf(item);
      if (index != -1) arr.splice(index, 1);
   },

   addUniqueElemToArr(arr: any[], item: any) {
      if (arr.includes(item)) return;
      arr.push(item);
   },


   // ========== numering
   randomNumber(maxValue: number) {
      return _.floor(_.random() * maxValue);
   },

   shuffleArray(arr, isCreateNewArray = false) {
      const newArr = isCreateNewArray ? [...arr] : arr;
      newArr.sort(() => this.random() > 0.5 ? 1 : -1);
      return newArr;
   },


   // ========== positioning
   directionVec2() {
      return {
         top: cc.v2(0, 1),
         bottom: cc.v2(0, -1),
         left: cc.v2(-1, 0),
         right: cc.v2(1, 0),
      }
   },

   reservedDir(dir) {
      return { top: 'bottom', bottom: 'top', left: 'right', right: 'left' }[dir];
   },

   getGlobalPos(node: cc.Node) {
      return node.convertToWorldSpaceAR(cc.Vec2.ZERO);
   },

   getGlobalPosDiff(node1: cc.Node, node2: cc.Node) {
      return this.getGlobalPos(node2).sub(this.getGlobalPos(node1));
   },

   setGlobalPosToNode(nodeToSet: cc.Node, targetNode: cc.Node) {
      const targetGPos = this.getGlobalPos(targetNode);
      const localPos = nodeToSet.parent.convertToNodeSpaceAR(targetGPos);
      nodeToSet.setPosition(localPos);
   },

   setGlobalPos(nodeToSet: cc.Node, targetGPos: cc.Vec2) {
      const localPos = nodeToSet.parent.convertToNodeSpaceAR(targetGPos);
      nodeToSet.setPosition(localPos);
   },

   moveToNewParentKeepPosition(node: cc.Node, newParentNode: cc.Node) {
      const curNodePos = newParentNode.convertToNodeSpaceAR(this.getGlobalPos(node));
      node.parent = newParentNode;
      node.setPosition(curNodePos);
   },


   isGlobalOverlapping(node1: cc.Node, node2: cc.Node) {
      return cc.Intersection.rectRect(node1.getBoundingBoxToWorld(), node2.getBoundingBoxToWorld());
   },


   // ========= Grpahics Logic

   // example usage:
   //    var b = bezier([[0, 0, 0], [1, 1, 1], [2, -3, 6]]);
   //    for (var t = 0; t <= 10; t++) console.log(b(t/10));
   getBezierPointFunc(pts) {
      return function (t) {
         for (var a = pts; a.length > 1; a = b)  // do..while loop in disguise
            for (var i = 0, b = [], j; i < a.length - 1; i++)  // cycle over control points
               for (b[i] = [], j = 0; j < a[i].length; j++)  // cycle over dimensions
                  b[i][j] = a[i][j] * (1 - t) + a[i + 1][j] * t;  // interpolation
         return a[0];
      }
   },


   // ========= Nodes

   // copy a node to a parent
   copyNode(sourceNode: cc.Node | cc.Prefab, targetParent?: cc.Node) {
      const newNode: cc.Node = cc.instantiate(sourceNode);
      if (targetParent) newNode.parent = targetParent;
      return newNode;
   },

   setOrgProp(node: cc.Node, propName?: string) {
      const defaultPropArr = ['x', 'y', 'width', 'height', 'opacity'];
      if (propName) this.addUniqueElemToArr(defaultPropArr, propName);
      defaultPropArr.map(iPropName => {
         const orgPropName = `org${this.capitalize(iPropName)}`;
         node[orgPropName] = node.hasOwnProperty(orgPropName) ? node[orgPropName] : node[iPropName];
      });
      if (propName) return node[`org${this.capitalize(propName)}`];
   },

   // get full path of a node to its highest parent
   getNodePath(node) {
      let pathArr = [node.name]
      let parent = node.parent;
      let safeCount = 0;
      while (parent && safeCount++ < 50) {
         if (!parent.parent) { break; }
         pathArr.push(parent.name);
         parent = parent.parent;
      }
      return pathArr.reverse().join('/');
   },

   // make a node strech to connect 2 points. Used to set position & length of a line/wall as configured positions
   nodeConnect2Points(node, p1: cc.Vec2, p2: cc.Vec2) {
      const diffVec = p2.sub(p1);
      node.height = diffVec.mag();
      node.setPosition(p1.add(diffVec.mul(0.5)));
      node.angle = 90 + _.radianToDegrees(_.atan2(diffVec.y, diffVec.x));
   },

   getNodeDistance(node1: cc.Node, node2: cc.Node) {
      return this.getGlobalPosDiff(node1, node2).mag();
   },

   // ========================================
   radianToDegrees(radian) {
      return radian * 180 / Math.PI;
   },

   degreesToRadian(degrees) {
      return degrees * Math.PI / 180;
   },

   vec2ToAngle(vec2: cc.Vec2) {  //degree
      return _.radianToDegrees(_.atan2(vec2.y, vec2.x));
   },

   formatTime(timeInSec) {
      //let date = new Date(null);
      //date.setSeconds(timeInSec); // specify value for SECONDS here
      //return date.toISOString().substr(11, 8);
      // e.g. 18245sec = 5 hours (5x3600s) 4 mins (4x60s) 5s

      // this.log('timeInSec: ' + timeInSec);
      let hours: any = _.floor(timeInSec / (60 * 60));
      let mins: any = _.floor((timeInSec % (60 * 60)) / 60);
      let secs: any = timeInSec % (60 * 60) % 60;

      if (hours < 10) hours = '0' + hours;
      if (mins < 10) mins = '0' + mins;
      if (secs < 10) secs = '0' + secs;

      return hours + ':' + mins + ':' + secs;
   },

   formatMoney(gold) {
      // (no suffix), K, M, B, T, aa, ab, ac, ad, ae ...
      let digits = _.floor(Math.log10(gold)) + 1;
      if (digits <= 6) {
         return gold.toLocaleString();
      }

      // 1M will write as 1000K
      // 50B will write as 50,000M 
      // baically, get up to >6 digits, then start shifting by 1 suffix

      // divide digits by 3
      let suffixes = ['K', 'M', 'B', 'T'];
      let chunks = _.floor((digits - 1) / 3);
      let startingChar = 'a';
      let suffix;
      if (chunks - 2 <= 3) {
         suffix = suffixes[chunks - 2];
      } else {
         suffix = String.fromCharCode(((chunks - 6) / 26) + startingChar.charCodeAt(0)) + String.fromCharCode(((chunks - 6) % 26) + startingChar.charCodeAt(0));
      }

      let truncatedGold = _.round(gold / _.pow(10, (chunks - 1) * 3));

      return truncatedGold.toLocaleString() + suffix;
   },

   capitalize(str) {
      const arr = [...str];
      arr[0] = arr[0].toUpperCase();
      return arr.join('');
   },

   getInRange(num, min, max) {
      return _.min(_.max(num, min), max);
   },



   // ========= Date time & scheduling process
   ...timeFunctions,

   // ========= cector, position & coordinates
   ...coordinateFunctions,



};