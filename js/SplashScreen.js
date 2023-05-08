const splashscreen = `
  <div>
  <div v-if="showSplash" class="splash-screen">
    <div class="message-box">
    <h1>{{ splashMessage }}</h1>
      <p>Informações sobre o jogo...</p>
      <button @click="startGame">OK</button>
    </div>
  </div>
  </div>
`;

import eventBus from './event-bus.js';
const splash = new Vue({
    el: '#abertura',
    template: splashscreen,
  data: {
      showSplash: true,
      splashMessage: "Bem-vindo ao Jogo",
  },
  methods: {
    showSadScreen() {
        this.showSplash = true;
        this.splashMessage = "Você ficou triste por 20 anos, e perdeu !!";
      },
    startGame() {
      localStorage.setItem("splashShown", "true");
      this.showSplash = false;
    }
  },
  mounted() {
    if (localStorage.getItem("splashShown") === "true") {
      this.showSplash = false;
    }
    eventBus.on("showSadSplash", this.showSadScreen);
  }
});
