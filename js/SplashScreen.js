const splashscreen = `
<div>
    <div v-if="showSplash" class="splash-screen">
      <div class="message-box">
        <h1>{{ splashMessage }}</h1>
        <p>Informações sobre o jogo...</p>
        <p>O objetivo do jogo é deixar o Dev feliz para ele evoluir com tempo, para isso é importante comer, dormir e minerar.</p>
        <!--<input type="hidden" v-model="emailInput" placeholder="Digite seu e-mail" >-->
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
      emailInput: '',
      
  },
  methods: {
    showSadScreen() {
        this.showSplash = true;
        this.splashMessage = "Você ficou triste por 20 anos, e perdeu !!";
      },
    startGame() {
      localStorage.setItem("splashShown", "true");
      localStorage.setItem("email", this.emailInput);
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
