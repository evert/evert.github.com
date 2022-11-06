"use strict";

const imageNames = [
  'awake',
  'down1',
  'down2',
  'dtogi1',
  'dtogi2',
  'dwleft1',
  'dwleft2',
  'jare2',
  'kaki1',
  'kaki2',
  'left1',
  'left2',
  'ltogi1',
  'ltog2',
  'mati2',
  'mati3',
  'right1',
  'right2',
  'rtogi1',
  'rtogi2',
  'sleep1',
  'sleep2',
  'up1',
  'up2',
  'upleft1',
  'upleft2',
  'upright1',
  'upright2',
  'utogi1',
  'utogi2',
];
const nekoSize = 64; 
const images = Object.fromEntries(imageNames.map(name => {
  const image = new Image(nekoSize, nekoSize);
  image.src = '/assets/posts/neko/bitmaps/' + name + '.png';
  return [name, image]
}));


const stateMachine = {
  sleep: {
    image: ['sleep1', 'sleep2'],
    imageInterval: 1,
    click: 'awake'
  },
  awake: {
    image: 'awake',
    nextState: 'normal',
    nextStateDelay: 2.5,
  },
  normal: {
    image: 'mati2',
    nextState: ['normal', 'normal', 'normal', 'tilt', 'scratch', 'yawn'],
    nextStateDelay: 1.5,
  },
  tilt: {
    image: 'jare2',
    nextState: 'normal',
    nextStateDelay: 1,
  },
  yawn: {
    image: 'mati3',
    nextState: ['normal', 'normal', 'sleep'],
    nextStateDelay: 1,
  },
  scratch: {
    image: ['kaki1', 'kaki2'],
    imageInterval: 0.1,
    nextState: 'normal',
    nextStateDelay: 3,
  }


};

class Neko {



  constructor(elem) {

    this.elem = elem;
    this.stateMachine = stateMachine; 
    this.imgElem =  new Image(nekoSize, nekoSize);

    elem.appendChild(this.imgElem);
    this.imgElem.addEventListener('click', () => this.onClick());

    this.setState('sleep');

  }

  /**
   * This property is used to keep track of states with multiple frames
   */
  #animationIndex = 0;

  renderImage() {

    let name = this.stateMachine[this.#state].image;

    this.#animationIndex++;
    if (Array.isArray(name)) {
      name = name[this.#animationIndex % name.length];
    }
    this.imgElem.src = images[name].src;
  }

  #state = null;
  #nextStateTimeout = null;
  #imageCycleInterval = null;

  setState(stateName) {

    clearTimeout(this.nextStateTimeout);
    clearInterval(this.imageCycleInterval);

    if (Array.isArray(stateName)) {
      // If stateName was supplied as an array of strings, we'll randomly
      // pick a new state.
      stateName = stateName[Math.floor(Math.random()*(stateName.length))];
    }
    if (!this.stateMachine[stateName]) {
      throw new Error('Uknown state: ' + stateName);
    }
    this.#state = stateName;
    const stateData = this.stateMachine[this.#state];

    if (stateData.nextState) {
      this.nextStateTimeout = setTimeout(
        () => this.setState(stateData.nextState),
        stateData.nextStateDelay * 1000
      );
    }
    this.renderImage();
    if (stateData.imageInterval) {

      this.imageCycleInterval = setInterval(
        () => this.renderImage(),
        stateData.imageInterval*1000
      );

    }
  }
  onClick() {
    const stateData = this.stateMachine[this.#state];
    if (stateData.click) {
      this.setState(stateData.click);
    }

  }

}


