import * as _G from '../../system/all_modules';
const { $ } = _G;
import { _ } from './utils_common'; // special case for sub-modules

let timerUuidIndex = 1e5; // uuid to set as names of objects => help identifying objects
export default {


   // get current time UTC - milliseconds from 1970 to now
   getMsPassedUTC() {
      return (new Date()).getTime();
   },

   // get current Pacific Time (PT)  - milliseconds from 1970 to now
   // * Warning: Dont use result (finalPassedMs) to convert back to Date() object - new Date(getMsPassedPT), will results in wrong time
   getMsPassedPT() {
      const pacificTimeOffset = this.getPacificTimeOffset();
      const msPassedInPTNow = this.getMsPassedUTC() + pacificTimeOffset * 60 * 60 * 1000;
      return msPassedInPTNow;
   },


   getTimePT(dateObj = new Date()) {
      const pacificTimeOffset = this.getPacificTimeOffset(dateObj);
      const utcHour = dateObj.getHours() + dateObj.getTimezoneOffset() / 60;
      dateObj.setHours(utcHour + pacificTimeOffset);
      // _.log(`dateObj = ${dateObj} // pacificTimeOffset=${pacificTimeOffset} // dateObj.getTimezoneOffset()=${dateObj.getTimezoneOffset()} // utcHour=${utcHour} // utcHour + pacificTimeOffset=${utcHour + pacificTimeOffset}  `)
      return dateObj;
   },


   isSameDate(dateObj1: Date, dateObj2: Date) {
      return dateObj1.getFullYear() == dateObj2.getFullYear()
         && dateObj1.getMonth() == dateObj2.getMonth()
         && dateObj1.getDate() == dateObj2.getDate();
   },


   // get total ms to midnight of current day in PT
   getTotalMsToMidnightPT() {
      const msOf1Day = 24 * 60 * 60 * 1000;
      const nowPT = this.getMsPassedPT();
      const msToMidNight = msOf1Day - (nowPT % msOf1Day);
      return msToMidNight;
   },


   // get Daylight Saving Time start & end of current year
   // * Since 2007 DST begins on the second sunday of March,
   // * and ends on the first sunday of November.
   getDSTStartEndDate(dateObj?: Date) {
      const currentDate = dateObj || new Date();
      const currentYear = currentDate.getFullYear();

      // DST Start
      const firstOfMarch = new Date(currentYear, 2, 1);
      const daysUntilFirstSundayInMarch = (7 - firstOfMarch.getDay()) % 7;
      const secondSundayInMarch = firstOfMarch.getDate() + daysUntilFirstSundayInMarch + 7;
      const dstStartDate = new Date(currentYear, 2, secondSundayInMarch);

      // DST End
      const firstOfNovember = new Date(currentYear, 10, 1);
      const daysUntilFirstSundayInNov = (7 - firstOfNovember.getDay()) % 7;
      const firstSundayInNovember = firstOfNovember.getDate() + daysUntilFirstSundayInNov;
      const dstEndDate = new Date(currentYear, 10, firstSundayInNovember);
      return [dstStartDate, dstEndDate];
   },


   getPacificTimeOffset(paramDate?: Date) {
      const dateObj = paramDate || new Date();
      const [startDST, endDST] = this.getDSTStartEndDate();
      const isDSTActive = dateObj > startDST && dateObj < endDST;
      const pacificTimeOffset = isDSTActive ? -7 : -8;
      return pacificTimeOffset;
   },



   //==================================

   // overwrite default setTimeout to use schedule - which is paused when user switch to another tab. This will make all animation synced since ccAction is scheduling-base
   setTimeout(callback: Function, timeInMillisecond: number = 0) {
      const target = { _id: timerUuidIndex++, __instanceId: timerUuidIndex, callback: null };
      target.callback = () => { callback(target); }
      cc.director.getScheduler().schedule(target.callback, target, timeInMillisecond / 1000, 0, 0, false);
      return target;
   },

   clearTimeout(target: any) {
      if (!target || !target._id || !target.callback) return;
      cc.director.getScheduler().unschedule(target.callback, target);
   },


   // overwrite default setInterval to use schedule - which is paused when user switch to another tab. This will make all animation synced since ccAction is scheduling-base
   setInterval(callback: Function, timeInMillisecond = 0) {
      const target = { _id: timerUuidIndex++, __instanceId: timerUuidIndex, callback: null };
      target.callback = () => { callback(target); }
      cc.director.getScheduler().schedule(target.callback, target, timeInMillisecond / 1000, cc.macro.REPEAT_FOREVER, 0, false);
      return target;
   },

   clearInterval(target: any) {
      if (!target || !target._id || !target.callback) return;
      cc.director.getScheduler().unschedule(target.callback, target);
   },

   addPseudoUpdateFunc(f) {
      let lastime = this.getMsPassedUTC();
      const intervalVar = this.setInterval(() => {
         const timeNow = this.getMsPassedUTC();
         const dt = timeNow - lastime;
         lastime = timeNow;
         f(dt);
      }, 0.01);
      return intervalVar;
   },

   // 1d 
   // 01:11:01
   secondsToTimeCountdown(secondsCount = 0) {
      if (secondsCount <= 0) return '0:00';

      let days = Math.floor(secondsCount / 86400);
      let hours = Math.floor((secondsCount % 86400) / 3600);
      let minutes = Math.floor((secondsCount % 3600) / 60);
      let seconds = secondsCount % 60;

      // Output like "1 day" or "1:01" or "4:03:59"
      if (days > 2) return days + ' days';
      if (days == 1) return '1 day';

      let ret = "";
      //   if (hours >= 10) ret = hours + ':';
      //   else if (hours > 0) ret = '0' + hours + ':';
      if (hours > 0) ret = hours + ':';

      // if (minutes >= 10) ret += minutes + ':';
      // else ret += '0' + minutes + ':';
      ret += minutes + ':';

      if (seconds >= 10) ret += seconds;
      else ret += '0' + seconds;

      return ret;
   },


   //--- wait for certain property of certain object to be true & call a callback
   waitToRun(
      callback: Function,
      propertyName: string,
      mainObject: any = window,
      interval: number = 0.1,
      maxTimeWait?: number,
      timeoutCallback?: Function
   ) {
      let isRunSuccess = false;
      const isReversed = propertyName.startsWith('!');
      const isFunction = propertyName.endsWith('()');
      propertyName = propertyName.replace('!', '').replace('()', '');
      const func = isFunction ? (() => mainObject[propertyName]()) : null;
      let waitInterval;

      const timeTickFunc = () => {
         if (!isReversed) {
            if (isFunction) { if (!func()) return; }
            else if (!mainObject[propertyName]) return;
         }
         else {
            if (isFunction) { if (func()) return; }
            else if (mainObject[propertyName]) return;
         }

         clearInterval(waitInterval);
         isRunSuccess = true;
         callback(mainObject[propertyName]);
         return true;
      };

      if (timeTickFunc()) return waitInterval;
      waitInterval = setInterval(timeTickFunc, interval * 1000);

      if (maxTimeWait) {
         this.setTimeout(() => {
            clearInterval(waitInterval);
            if (timeoutCallback && !isRunSuccess) timeoutCallback();
         }, maxTimeWait * 1000);
      }

      return waitInterval;
   },

}