import * as _G from '../system/all_modules';
const { _, $ } = _G;

const CELL_HEIGHT = 450;

export const gameMechanic = {
   elemContainer: null as cc.Node,
   cheatResultArr: [0, 0, 0],
   isCheating: false,

   init() {
      const collisionManager = cc.director.getCollisionManager();
      collisionManager.enabled = true;

      this.elemContainer = cc.find('Canvas/play_area/elem_container');
      this.renderAllReels();

      _.addPseudoUpdateFunc((dt) => this.updateFunc(dt))
   },


   // ==================================================
   startRandomSpinning() {
      const speedArr = [1500, 1700, 2200];

      const [spinningTime1, spinningTime2, spinningTime3] = this.calculateSpinningTime(speedArr);
      _.setTimeout(() => this.stopReel(this.elemContainer.children[0]), spinningTime1 * 1000);
      _.setTimeout(() => this.stopReel(this.elemContainer.children[1]), spinningTime2 * 1000);
      _.setTimeout(() => this.stopReel(this.elemContainer.children[2]), spinningTime3 * 1000);

      const resultTime = _.max(spinningTime1, spinningTime2, spinningTime3);
      _.setTimeout(() => {
         const btnSpin = cc.find('Canvas/play_area/btn_spin')
         this.checkResult(() => {
            cc.find('disabled', btnSpin).active = false;
         });
      }, resultTime * 1000 + 300);

      this.spinAllReels(speedArr);
   },


   calculateSpinningTime(speedArr) {
      // ----------- cheat result
      if (this.isCheating && this.cheatResultArr.join(',') !== '0,0,0') {
         const resultArr = this.cheatResultArr;
         const resultIndexArr = resultArr.map((result, reelIndex) => {
            result = result || (_.randomNumber(3) + 1);
            const configReelArr = _G.configGame.reelArr[reelIndex];
            const resultIndex = configReelArr.indexOf(result - 1);
            // _.log(`reelIndex: ${reelIndex}, symbol: ${result - 1}, resultIndex: ${resultIndex}`);
            return resultIndex;
         });
         _.log(` resultIndexArr =${resultIndexArr} `);

         const timeArr = resultIndexArr.map((resultIndex, reelIndex) => {
            const configReelArr = _G.configGame.reelArr[reelIndex];
            if (resultIndex < configReelArr.length) resultIndex += configReelArr.length;
            const netPassedLength = resultIndex * CELL_HEIGHT;
            const reelNode = this.elemContainer.children[reelIndex];
            let passLengthRemaining = netPassedLength - reelNode.passedLength;
            if (passLengthRemaining < 0) passLengthRemaining += reelNode.totalHeight;
            let time = passLengthRemaining / speedArr[reelIndex] - (CELL_HEIGHT / 2) / speedArr[reelIndex];
            if (time < 1) time += reelNode.totalHeight / speedArr[reelIndex];
            return time;
         });

         _.log(`timeArr = ${timeArr.map(t => t.toFixed(3))}`);
         return timeArr;
      }

      // ----------- random result
      else {
         const spinningTime1 = 1 + 2 * _.random();
         const spinningTime2 = spinningTime1 + _.random() * (3 - spinningTime1);
         const spinningTime3 = spinningTime2 + _.random() * (3 - spinningTime2);
         return [spinningTime1, spinningTime2, spinningTime3];
      }
   },



   checkResult(callback?: Function) {
      const resultArr = this.elemContainer.children.map((reelNode, reelIndex) => {
         const resultIndex = _.round((reelNode.passedLength % reelNode.totalHeight) / CELL_HEIGHT);
         const configReelArr = _G.configGame.reelArr[reelIndex];
         return configReelArr[resultIndex];
      });

      _.log(` resultArr = ${resultArr}`);
      if (resultArr[0] == resultArr[1] && resultArr[1] == resultArr[2]) {
         _G.coreFX.playWinFx(callback);
      } else if (callback) callback();
   },


   setCheatInput(reelIndex, cheatValue) {
      _.log(`setCheatInput: ${reelIndex}, ${cheatValue}`);
      this.cheatResultArr[reelIndex] = cheatValue;
   },


   // ==================================================
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
      this.elemContainer.children.map((reelNode, i) => {
         this.renderReel(reelNode, _G.configGame.reelArr[i]);
         reelNode.totalHeight = CELL_HEIGHT * reelNode.children.length;
         reelNode.passedLength = 0;
         reelNode.isStopped = true;
      });
   },


   renderReel(reelNode: cc.Node, reelSymboArr: number[]) {
      reelNode.removeAllChildren();
      reelSymboArr.slice().reverse().map((symbolIndex, i) => {
         const cellNode = _.copyNode(cc.find(`Canvas/sample_nodes/cell_${symbolIndex}`), reelNode);
         cellNode.y = CELL_HEIGHT * (reelSymboArr.length - 1 - i);
      });
   },


   // ==================================================
   spinAllReels(speedArr?) {
      speedArr = speedArr || [1700, 1700, 1700];
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