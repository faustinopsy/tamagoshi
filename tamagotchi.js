new Vue({
    el: '#app',
    data: {
      tamagotchi: {
        nome: 'Meu Tamagotchi',
        evolucao: 'Bebê',
        fome: 50,
        sono: 50,
        idade: 0
      },
      humor: 'Normal'
    },
    methods: {
      alimentar() {
        this.tamagotchi.fome = Math.max(0, this.tamagotchi.fome - 10);
      },
      dormir() {
        this.tamagotchi.sono = Math.max(0, this.tamagotchi.sono - 10);
      },
      atualizarHumor() {
        if (this.tamagotchi.fome > 80 || this.tamagotchi.sono > 80) {
          this.humor = 'Triste';
        } else if (this.tamagotchi.fome < 20 && this.tamagotchi.sono < 20) {
          this.humor = 'Feliz';
        } else {
          this.humor = 'Normal';
        }
      this.atualizarEvolucao();
    },
    atualizarEvolucao() {
      if (this.tamagotchi.idade > 100 && this.humor === 'Feliz') {
        this.tamagotchi.evolucao = 'Adulto';
      } else if (this.tamagotchi.idade > 50) {
        this.tamagotchi.evolucao = 'Adolescente';
      } else {
        this.tamagotchi.evolucao = 'Bebê';
      }
    }
    },
    mounted() {
      setInterval(() => {
        this.tamagotchi.fome = Math.min(100, this.tamagotchi.fome + 1);
        this.tamagotchi.sono = Math.min(100, this.tamagotchi.sono + 1);
        this.atualizarHumor();
        this.tamagotchi.idade++;
      }, 1000);
    }
  });
  