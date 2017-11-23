import accuracy    from '../assets/sounds/voiceOvers/Accuracy.ogg';
import deathInsult from '../assets/sounds/voiceOvers/Death_Insult.ogg';
import decimation  from '../assets/sounds/voiceOvers/Dominating.ogg';
import dominating  from '../assets/sounds/voiceOvers/Dominating.ogg';
import easyMode  from '../assets/sounds/voiceOvers/Easy_Mode.ogg';
import excellent  from '../assets/sounds/voiceOvers/Excellent.ogg';
import fatality  from '../assets/sounds/voiceOvers/Fatality.ogg';
import juggernaught  from '../assets/sounds/voiceOvers/Juggernaught.ogg';
import kamikaze  from '../assets/sounds/voiceOvers/Kamikaze.ogg';
import megaKill  from '../assets/sounds/voiceOvers/Mega_Kill.ogg';
import outstanding  from '../assets/sounds/voiceOvers/Outstanding.ogg';
import pizzaDelivery  from '../assets/sounds/voiceOvers/Pizza_Delivery.ogg';
import ultraKill  from '../assets/sounds/voiceOvers/Ultra_Kill.ogg';
import vipTeamKill  from '../assets/sounds/voiceOvers/Vip_Team_Kill.ogg';
import watchStep  from '../assets/sounds/voiceOvers/Watch_Your_Step.ogg';
import welcomeKill  from '../assets/sounds/voiceOvers/Welcome_Kill.ogg';
import wickedSick  from '../assets/sounds/voiceOvers/Wicked_Sick.ogg';


const ALL_SOUNDS = [
  accuracy, 
  deathInsult, 
  decimation, 
  dominating, 
  easyMode, 
  excellent,
  fatality,
  juggernaught,
  kamikaze,
  megaKill,
  outstanding,  
  pizzaDelivery,
  ultraKill,
  vipTeamKill,
  watchStep,
  welcomeKill,
  wickedSick
];


class voiceEffects {
  constructor() {
    this.audioPlayer = new Audio();
  }

  getRandomIndex() {
    return Math.floor(Math.random() * (ALL_SOUNDS.length - 0) + 0);
  }

  playSound() {
    const randomIndex = this.getRandomIndex();
    this.audioPlayer.pause();
    this.audioPlayer.src = ALL_SOUNDS[randomIndex];
    this.audioPlayer.play();
  }
}

export default voiceEffects;