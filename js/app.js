new Vue({
    el: '#app',
    data: {
      pessoa: {
        nome: 'Eu',
        evolucao: 'Junior',
        fome: 20,
        sono: 20,
        idade: 0,
      },
      miner: {
        nome: 'Minerador',
        capacidadeMineracao: 100,
        energia: 100,
        equipamentos: [],
        saldo: 0,
      },
      tempoRestauracao: 5 * 60 * 1000, // 24 horas em milissegundos
      diasTristes: 0,
      humor: 'Normal',
      dormindo: false,
      conquistas: [],
        metas: [
            {
            nome: 'Sobreviver por 30 dias',
            condicao: function(pessoa, meta) {
                return pessoa.idade >= 30;
            },
            alcancada: false,
            },
            {
            nome: 'Sobreviver por 60 dias',
            condicao: function(pessoa, meta) {
                return pessoa.idade >= 60;
            },
            alcancada: false,
            },
            {
              nome: 'Manter Feliz por 5 dias',
              diasPleno: 0,
              condicao: function(pessoa, meta) {
                return meta.diasPleno >= 5;
              },
              alcancada: false,
            },
            {
              nome: 'Manter Feliz por 10 dias',
              diasSenior: 0,
              condicao: function(pessoa, meta) {
                return meta.diasSenior >= 10;
              },
              alcancada: false,
            },
        ],
        recompensas: [],
    },
    methods: {
      formatarTempoRestauracao() {
        const horas = Math.floor(this.tempoRestauracao / (60 * 60 * 1000));
        const minutos = Math.floor((this.tempoRestauracao % (60 * 60 * 1000)) / (60 * 1000));
        const segundos = Math.floor((this.tempoRestauracao % (60 * 1000)) / 1000);
        return `${horas}h ${minutos}m ${segundos}s`;
      },
      
      atualizarTempoRestauracao() {
        this.tempoRestauracao -= 1000;
        if (this.tempoRestauracao <= 0) {
          this.tempoRestauracao = 5 * 60 * 1000;
          this.restaurarCapacidadeMineracao()
        }
      },      
      salvarEstado() {
        const dataToSave = {
          pessoa: this.pessoa,
          miner: this.miner,
          tempoRestauracao: this.tempoRestauracao,
          diasTristes: this.diasTristes,
          humor: this.humor,
          dormindo: this.dormindo,
          conquistas: this.conquistas,
        };
        localStorage.setItem('appState', JSON.stringify(dataToSave));
      },
      restaurarEstado() {
        const savedState = localStorage.getItem('appState');
        if (savedState) {
          Object.assign(this.$data, JSON.parse(savedState));
          // Reconstrua o objeto metas
          const metasOriginais = this.metas;
          this.metas = metasOriginais.map((metaOriginal, index) => {
            const metaRestaurada = this.metas[index];
            metaRestaurada.condicao = metaOriginal.condicao;
            return metaRestaurada;
          });
        }
      },
            
      alimentar() {
        if (this.miner.saldo >= 10) {
          this.pessoa.fome -= 20;
          if (this.pessoa.fome < 0) {
            this.pessoa.fome = 0;
          }
          this.miner.saldo -= 10;
        }
      },
      tick() {
        if (!this.dormindo) {
          this.pessoa.fome = parseFloat(Math.min(100, this.pessoa.fome + 1).toFixed(3));
          this.pessoa.sono = parseFloat(Math.min(100, this.pessoa.sono + 1).toFixed(3));
          this.pessoa.idade = parseFloat((this.pessoa.idade + 1).toFixed(3));
        } else {
          this.pessoa.sono = parseFloat(Math.max(0, this.pessoa.sono - 1).toFixed(3));
          this.pessoa.fome = parseFloat(Math.min(100, this.pessoa.fome + 0.01).toFixed(3));
          this.pessoa.idade = parseFloat((this.pessoa.idade + 0.1).toFixed(3));
        }
        if (this.humor === 'Feliz') {
            this.metas.forEach(meta => {
              if (meta.nome === 'Manter Feliz por 5 dias' && !meta.alcancada) {
                meta.diasPleno += 1;
              }
              if (meta.nome === 'Manter Feliz por 10 dias' && !meta.alcancada) {
                meta.diasSenior += 1;
              }
            });
          }
          if (this.humor === 'Triste') {
            this.diasTristes += 1;
            this.removerConquistasERecompensas();
          } else {
            this.diasTristes = 0;
          }
          if (this.pessoa.sono < 99){
            this.minerar();
          }
       
        this.verificarMetas();
        this.atualizarHumor(); 
        this.salvarEstado();
        this.atualizarTempoRestauracao(); 
      }, 
      atualizarHumor() {
        if (this.pessoa.fome > 90 && this.pessoa.sono < 20) {
            this.humor = 'Raiva';
          } else if (this.pessoa.fome < 20 && this.pessoa.sono > 90) {
            this.humor = 'Medo';
          } else if (this.pessoa.fome > 80 || this.pessoa.sono > 80 && this.miner.saldo < 500) {
            this.humor = 'Triste';
          } else if (this.pessoa.fome < 30 && this.pessoa.sono < 30 && this.miner.saldo > 10) {
            this.humor = 'Feliz';
          } else {
            this.humor = 'Normal';
          } 
        //this.atualizarEvolucao();
      },
      progressBarColor(value) {
        if (value < 20) {
          return '#07aa2a76';
        } else if (value < 60) {
          return '#9faa0776';
        } else if (value >= 60) {
          return '#aa072276';
        }
      },
      minerBarColor(value) {
        if (value < 20) {
          return '#aa072276';
        } else if (value < 60) {
          return '#9faa0776';
        } else if (value >= 60) {
          return '#07aa2a76';
        }
      },
      atualizarEvolucao() {
        if (this.pessoa.idade > 300 && this.humor === 'Feliz') {
          this.pessoa.evolucao = 'Sênior';
        } else if (this.pessoa.idade > 100) {
          this.pessoa.evolucao = 'Pleno';
        } else {
          this.pessoa.evolucao = 'Junior';
        }
      },
      verificarMetas: function() {
        this.metas.forEach(meta => {
          if (!meta.alcancada && meta.condicao(this.pessoa, meta)) {
            meta.alcancada = true;
            this.conquistas.push(meta);
            this.recompensar(meta);
          }
        });
      },
      recompensar: function(meta) {
        if (meta.nome === 'Manter Feliz por 5 dias') {
            this.recompensas.push({ nome: 'Pleno', descricao: 'Manter Feliz por 10 dias' });
            this.pessoa.evolucao = 'Pleno';
          }
          if (meta.nome === 'Manter Feliz por 10 dias') {
            this.pessoa.evolucao = 'Sênior';
            this.recompensas.push({ nome: 'Sênior', descricao: 'Manter Feliz por 20 dias' });
          }
      },
      removerConquistasERecompensas() {
        if (this.diasTristes >= 10) {
          this.pessoa.evolucao = 'Junior';
          this.conquistas = this.conquistas.filter(meta => meta.nome !== 'Manter Feliz por 10 dias' && meta.nome !== 'Manter Feliz por 20 dias');
          this.recompensas = this.recompensas.filter(recompensa => recompensa.nome !== 'Pleno' && recompensa.nome !== 'Sênior');
          this.diasTristes = 0;
        }
      },
      minerar() {
        if (!this.dormindo) {
          let incrementoSaldo = (this.miner.capacidadeMineracao / 100);
          let decrementoCapacidade = Math.max(0, this.miner.capacidadeMineracao / 100);

          this.miner.saldo = (Math.round(this.miner.saldo * 1000) + Math.round(incrementoSaldo * 1000)) / 1000;
          this.miner.capacidadeMineracao = (Math.round(this.miner.capacidadeMineracao * 1000) - Math.round(decrementoCapacidade * 1000)) / 1000;
        }
      },
      restaurarCapacidadeMineracao() {
        this.miner.capacidadeMineracao = 100;
      },      
      comprarEquipamento() {
        // Lógica para comprar equipamento e atualizar a capacidade de mineração
      },
      atualizarCapacidadeMineracao() {
        // Lógica para atualizar a capacidade de mineração com base nos equipamentos
      },
      consumirEnergia() {
        // Lógica para gerenciar o consumo de energia com base na capacidade de mineração
      },
    },
    mounted() {
      this.restaurarEstado();
        setInterval(() => {
          this.tick();
        }, 1000);

        setInterval(() => {
          this.restaurarCapacidadeMineracao();
        }, 5 * 60 * 1000); // 24 horas em milissegundos 24 * 60 * 60 * 1000);
      },
      
  });
  