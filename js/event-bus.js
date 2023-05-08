class EventBus {
    constructor() {
      this.events = {};
    }
  
    on(eventName, callback) {
      if (!this.events[eventName]) {
        this.events[eventName] = [];
      }
      this.events[eventName].push(callback);
    }
  
    emit(eventName, data) {
      if (this.events[eventName]) {
        this.events[eventName].forEach(callback => callback(data));
      }
    }
  }
  
  const eventBus = new EventBus();
  export default eventBus;
  