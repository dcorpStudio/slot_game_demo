import * as _G from '../system/all_modules';
const { _, $ } = _G;

export const appEvents = {
    isAppHidden: false,
    onAppShowCallbackArr: [],
    onAppHideCallbackArr: [],

    onAppShow() {
        this.isAppHidden = false;
        this.onAppShowCallbackArr.map(f => f());
    },

    addAppShowCallback(f: Function) {
        this.onAppShowCallbackArr.push(f);
    },

    onAppHide() {
        this.isAppHidden = true;
        this.onAppHideCallbackArr.map(f => f());
    },

    addAppHideCallback(f: Function) {
        this.onAppHideCallbackArr.push(f);
    },
}