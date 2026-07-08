// src/utils/uiEventEmitter.js

class UIEventEmitter {
  constructor() {
    this.listeners = {};
  }

  on(eventName, callback) {
    if (!this.listeners[eventName]) this.listeners[eventName] = [];
    this.listeners[eventName].push(callback);
    return () => this.off(eventName, callback);
  }

  off(eventName, callback) {
    if (!this.listeners[eventName]) return;
    this.listeners[eventName] = this.listeners[eventName].filter(
      (cb) => cb !== callback
    );
  }

  emit(eventName, payload) {
    if (!this.listeners[eventName]) return;
    this.listeners[eventName].forEach((cb) => cb(payload));
  }
}

export const uiEventEmitter = new UIEventEmitter();

export const UI_EVENTS = {
  FLOAT_ARPG_TO_TOPBAR: "FLOAT_ARPG_TO_TOPBAR"
};
