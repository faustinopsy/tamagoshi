new Vue({
    el: '#app',
    data: {
      tamagotchi: {
        nome: 'Meu Tamagotchi',
        evolucao: 'Bebê',
        fome: 50,
        sono: 50,
        idade: 0.9,
      },
      humor: 'Normal',
      dormindo: false,
      conquistas: [],
        metas: [
            {
            nome: 'Sobreviver por 10 dias',
            condicao: function(tamagotchi) {
                return tamagotchi.idade >= 10;
            },
            alcancada: false,
            },
            {
            nome: 'Sobreviver por 20 dias',
            condicao: function(tamagotchi) {
                return tamagotchi.idade >= 20;
            },
            alcancada: false,
            },
            {
                nome: 'Manter Feliz por 5 dias',
                diasFelizes: 0,
                condicao: function(tamagotchi, meta) {
                  return meta.diasFelizes >= 5;
                },
                alcancada: false,
              },
        ],
        recompensas: [],
    },
    methods: {
      alimentar() {
        this.tamagotchi.fome -= 20;
        if (this.tamagotchi.fome < 0) {
          this.tamagotchi.fome = 0;
        }
      },
      tick() {
        if (!this.dormindo) {
          this.tamagotchi.fome = parseFloat(Math.min(100, this.tamagotchi.fome + 1).toFixed(3));
          this.tamagotchi.sono = parseFloat(Math.min(100, this.tamagotchi.sono + 1).toFixed(3));
          this.tamagotchi.idade = parseFloat((this.tamagotchi.idade + 1).toFixed(3));
        } else {
          this.tamagotchi.sono = parseFloat(Math.max(0, this.tamagotchi.sono - 1).toFixed(3));
          this.tamagotchi.fome = parseFloat(Math.min(100, this.tamagotchi.fome + 0.01).toFixed(3));
          this.tamagotchi.idade = parseFloat((this.tamagotchi.idade + 0.1).toFixed(3));
        }
        if (this.humor === 'Feliz') {
            this.metas.forEach(meta => {
              if (meta.nome === 'Manter Feliz por 5 dias' && !meta.alcancada) {
                meta.diasFelizes += 1;
              }
            });
          }
          this.verificarMetas();
        this.atualizarHumor();
        
      },
      
      atualizarHumor() {
        if (this.tamagotchi.fome > 90 && this.tamagotchi.sono < 20) {
            this.humor = 'Raiva';
          } else if (this.tamagotchi.fome < 20 && this.tamagotchi.sono > 90) {
            this.humor = 'Medo';
          } else if (this.tamagotchi.fome > 80 || this.tamagotchi.sono > 80) {
            this.humor = 'Triste';
          } else if (this.tamagotchi.fome < 20 && this.tamagotchi.sono < 20) {
            this.humor = 'Feliz';
          } else {
            this.humor = 'Normal';
          }
          
        this.atualizarEvolucao();
      },
      atualizarEvolucao() {
        if (this.tamagotchi.idade > 300 && this.humor === 'Feliz') {
          this.tamagotchi.evolucao = 'Adulto';
        } else if (this.tamagotchi.idade > 100) {
          this.tamagotchi.evolucao = 'Adolescente';
        } else {
          this.tamagotchi.evolucao = 'Bebê';
        }
      },
      verificarMetas: function() {
        this.metas.forEach(meta => {
          if (!meta.alcancada && meta.condicao(this.tamagotchi, meta)) {
            meta.alcancada = true;
            this.conquistas.push(meta);
            this.recompensar(meta);
          }
        });
      },
      
      recompensar: function(meta) {
        if (meta.nome === 'Sobreviver por 10 dias') {
            // Adicione a recompensa específica para essa meta
            // Por exemplo: adicionar um item de personalização exclusivo
            this.recompensas.push({ nome: 'Item especial', descricao: 'Um item exclusivo .' });
          }
      },
    },
    mounted() {
        setInterval(() => {
          this.tick();
        }, 1000);
      },
      
  });
  