import * as _G from '../../system/all_modules';
const { _, $ } = _G;


export const utilsData = {
   save(dataObject: any, callback?: Function) {
      for (let key in dataObject) localStorage.setItem(key, JSON.stringify(dataObject[key]));
      setTimeout(() => { if (callback) callback(); }, 300);
   },


   load(keyArr: string[], callback?: Function) {
      const dataObj = {};
      keyArr.map(key => {
         if (localStorage.getItem(key) === null) return;
         try {
            dataObj[key] = JSON.parse(localStorage.getItem(key));
         } catch (e) {
            console.warn(` utilsData.load() >> Error  data key = ${key} `, e)
         }
      });
      if (callback) setTimeout(() => callback(dataObj), 100);
   },

};
