const pessoaTemplate = `
  <div>
  <div>Anos: {{ idade }}</div>
    <div class="column">
        <div class="cardb">
            <h2>{{ nome }}</h2>
            <div class="pessoa-avatar">
            <img :src="'img/' + evolucao.toLowerCase() + '_' + (dormindo ? 'dormindo' : humor.toLowerCase()) + '.gif'" alt="Avatar do pessoa">
            <!--<img src="img/junior_feliz.gif" alt="Avatar do pessoa">-->
            </div>
        </div>
        <div class="cardb">
        {{ evolucao }} || {{ humor }}
        </div>
        <div class="cardb">
            <button class="button" @click="alimentar" :disabled="dormindo" title="Comer 20$">Comer</button>
            <label class="switch" title="dormir?">
              <input type="checkbox" id="yes_no" name="yes_no" v-model="dormindo">
              <span class="slider round"></span>
            </label>
        </div>
        <div class="card">
               <div class="circular-progress">
                <svg viewBox="0 0 36 36" class="circular-chart">
                  <path
                    class="circle-bg"
                    d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    class="circle"
                    stroke-dasharray="0, 100"
                    :stroke-dasharray="(fome / 100) * 100 + ', 100'"
                    d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <text x="18" y="13" class="label">Fome</text>
                  <text x="18" y="20.35" class="percentage"> {{ fome }}% </text>
                </svg>
              </div>
              <div class="circular-progress">
                <svg viewBox="0 0 36 36" class="circular-chart">
                  <path
                    class="circle-bg"
                    d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    class="circle"
                    stroke-dasharray="0, 100"
                    :stroke-dasharray="(sono / 100) * 100 + ', 100'"
                    d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                  /> <text x="18" y="13" class="label">Sono</text>
                  <text x="18" y="20.35" class="percentage"> {{ sono }}% </text>
                </svg>
              </div>
             
          </div>
          <div class="cardb">
          Saldo:  {{ saldo }}
      </div>
      </div>
      <button class="button" v-if="showSyncButton" @click="restoreDataFromServer">Resgatar do servidor</button>
  </div>
`;

import eventBus from './event-bus.js';

const pessoa = new Vue({
  el: '#pessoa',
  template: pessoaTemplate,
  data: {
    nome: "Dev",
    evolucao: "Junior",
    fome: 20,
    sono: 20,
    idade: 0,
    diasTristes: 0,
    humor: 'Normal',
    dormindo: false,
    saldo: 0,
    conquistas: [],
    tempoDesdeUltimaAtualizacaoIdade: 0,
    morreu: false,
    showSyncButton: false,
      metas: [
          {
          nome: 'Sobreviver por 30 dias',
          condicao: function( meta) {
              return this.idade >= 30;
          },
          alcancada: false,
          },
          {
          nome: 'Sobreviver por 60 dias',
          condicao: function( meta) {
              return this.idade >= 60;
          },
          alcancada: false,
          },
          {
            nome: 'Manter Feliz por 5 dias',
            diasPleno: 0,
            condicao: function( meta) {
              return meta.diasPleno >= 5;
            },
            alcancada: false,
          },
          {
            nome: 'Manter Feliz por 10 dias',
            diasSenior: 0,
            condicao: function( meta) {
              return meta.diasSenior >= 10;
            },
            alcancada: false,
          },
      ],
      recompensas: [],
  },
  methods: {
    async restoreDataFromServer() {
      try {
        const email = localStorage.getItem('email');
        
        const response = await fetch('backend/api.php?email=' + encodeURIComponent(email));
        const data = await response.json();
         // Atualizando os atributos de pessoa e miner
         this.idade = data[0].idade;
         this.fome = data[0].fome;
         this.evolucao = data[0].evolucao;
         this.sono = data[0].sono;
         this.diasTristes = data[0].diasTristes;
         this.humor = data[0].humor;
         this.saldo = data[0].saldo;
         this.dormindo = data[0].dormindo === 1 ? true : false; // Convertendo para boolean
         


        // Salvando os dados atualizados no localStorage
        //localStorage.setItem('appState', JSON.stringify({ pessoa: this.pessoa, miner: this.miner }));

        alert("Dados restaurados com sucesso!");
      } catch (error) {
        alert("Erro ao restaurar dados do servidor.");
      }
    },
    showSadSplashScreen() {
      this.morreu = true;
      eventBus.emit("showSadSplash");
    },
    alimentar() {
      if (this.saldo >= 10) {
        this.fome -= 20;
        if (this.fome < 0) {
          this.fome = 0;
        }
        this.saldo -= 10;
      }
    },
    emitirDadosParaSalvar() {
      eventBus.emit('pessoa-emitir-dados', {
        saldo: this.saldo,
        dormindo: this.dormindo,
        evolucao: this.evolucao,
        fome: this.fome,
        sono: this.sono,
        idade: this.idade,
        diasTristes: this.diasTristes,
        humor: this.humor,
        tempoDesdeUltimaAtualizacaoIdade:this.tempoDesdeUltimaAtualizacaoIdade
      });
    },
    
    verificarMetas: function() {
      this.metas.forEach(meta => {
        if (!meta.alcancada && meta.condicao( meta)) {
          meta.alcancada = true;
          this.conquistas.push(meta);
          this.recompensar(meta);
        }
      });
    },
    recompensar: function(meta) {
      if (meta.nome === 'Manter Feliz por 5 anos') {
          this.recompensas.push({ nome: 'Pleno', descricao: 'Manter Feliz por 5 anos' });
          this.evolucao = 'Pleno';
        }
        if (meta.nome === 'Manter Feliz por 10 anos') {
          this.evolucao = 'Sênior';
          this.recompensas.push({ nome: 'Sênior', descricao: 'Manter Feliz por 20 anos' });
        }
    },
    removerConquistasERecompensas() {
      if (this.diasTristes >= 10) {
        this.evolucao = 'Junior';
        this.conquistas = this.conquistas.filter(meta => meta.nome !== 'Manter Feliz por 5 anos' && meta.nome !== 'Manter Feliz por 20 anos');
        this.recompensas = this.recompensas.filter(recompensa => recompensa.nome !== 'Pleno' && recompensa.nome !== 'Sênior');
        this.diasTristes = 0;
      }
      if(this.diasTristes >= 20){
        localStorage.removeItem("splashShown");
        this.showSadSplashScreen();
      }
    },
    tick() {
        if (localStorage.getItem("splashShown") === "true") {
        this.tempoDesdeUltimaAtualizacaoIdade += 1;
        // Verifica se 12 minutos se passaram (12 minutos * 60 segundos = 720 segundos)
        if (this.tempoDesdeUltimaAtualizacaoIdade >= 720) {
          this.idade = this.idade + 1;
          this.tempoDesdeUltimaAtualizacaoIdade = 0; // Reinicie o contador
        }
        if (!this.dormindo) {
          this.fome = parseFloat(Math.min(100, this.fome + 1).toFixed(3));
          this.sono = parseFloat(Math.min(100, this.sono + 1).toFixed(3));
        } else {
          this.sono = parseFloat(Math.max(0, this.sono - 1).toFixed(3));
          this.fome = parseFloat(Math.min(100, this.fome + 0.01).toFixed(3));
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
          if (this.sono < 99){
            eventBus.emit('minerar', { saldo: this.saldo, dormindo: this.dormindo });
            //this.minerar();
          }
      
        this.verificarMetas();
        this.atualizarHumor(); 
        this.emitirDadosParaSalvar();
      }
    }, 
    atualizarHumor() {
      if (this.fome > 90 && this.sono < 20) {
          this.humor = 'Raiva';
        } else if (this.fome < 20 && this.sono > 90) {
          this.humor = 'Medo';
        } else if (this.fome > 80 || this.sono > 80 && this.saldo < 500) {
          this.humor = 'Triste';
        } else if (this.fome < 30 && this.sono < 30 && this.saldo > 10) {
          this.humor = 'Feliz';
        } else {
          this.humor = 'Normal';
        } 
      //this.atualizarEvolucao();
    },
    atualizarSaldo(novoSaldo) {
      this.saldo = novoSaldo;
    },
    restaurarDados(dadosPessoa) {
      //console.log(dadosPessoa.pessoa);
      //Object.assign(this.$data, dadosPessoa);
      Object.assign(this.$data, dadosPessoa.pessoa);
    }
  },
  mounted() {
    setInterval(() => {
      this.tick();
    }, 1000);
    const savedEmail = localStorage.getItem("email");
    if (savedEmail) {
      this.showSyncButton = true;
    }
  },
  created() {
    eventBus.on("atualizar-saldo", this.atualizarSaldo);
    eventBus.on("pessoa-restaurar-dados", this.restaurarDados);
  setInterval(() => {
    this.tick();
  }, 1000);
  },
});
