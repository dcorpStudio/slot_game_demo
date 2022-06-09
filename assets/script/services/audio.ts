import * as _G from '../system/all_modules';
const { _, $ } = _G;

export const audio = {
   audioList: {},
   playingIdList: {},
   currentStreakSoundIndex: 0,
   lastStreakTime: 0,

   init() {
      // _.setTimeout(() => this.loadAudioFiles(), 1000);
   },

   loadAudioFiles() {
      cc.resources.loadDir('audios', cc.AudioClip, (err, res) => {
         if (err) return _.log(err);
         for (let clip of res) this.audioList[clip.name] = clip;
         // _.log(`audio.js >> all audio loaded !`);

         _.waitToRun(() => this.playBgMusic(), 'isInitialized', _G.settings);
      });
   },

   playSound(name: string, volume = 1) {
      if (!_G.settings.sound || !this.audioList[name]) return;
      try {
         this.playingIdList[name] = cc.audioEngine.play(this.audioList[name], false, volume);
      } catch (e) { }
   },

   stopSound(name: string) {
      if (this.playingIdList[name]) cc.audioEngine.stopEffect(this.playingIdList[name]);
   },

   playBgMusic(volume = 1) {
      if (!_G.settings.music) return;
      if (cc.audioEngine.isMusicPlaying()) return;
      try {
         this.playingIdList["bg_music"] = cc.audioEngine.playMusic(this.audioList["bg_music"], true);
         cc.audioEngine.setMusicVolume(volume);
      } catch (e) { _.log(`playMusic err `, e); }
   },

   stopBgMusic() {
      if (cc.audioEngine.isMusicPlaying()) cc.audioEngine.stopMusic();
   },

   playSoundClickButton() {
      if (!_G.settings.sound) return;
      this.playSound("button_click", 1);
   },

}