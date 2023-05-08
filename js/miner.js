const minerTemplate = `
  <div>
  <div>Tempo para restaurar CPU: {{ formatarTempoRestauracao() }}</div>
    <div class="column">
        <div class="cardb">
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
                    :stroke-dasharray="(capacidadeMineracao / 100) * 100 + ', 100'"
                    d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                  /> <text x="18" y="13" class="label">CPU</text>
                  <text x="18" y="20.35" class="percentage"> {{ capacidadeMineracao }}% </text>
                </svg>
              </div>
        </div>
    </div>
  </div>
`;

import eventBus from './event-bus.js';

const miner = new Vue({
  el: '#miner',
  template: minerTemplate,
  data: {
    nome: 'Minerador',
    capacidadeMineracao: 100,
    energia: 100,
    equipamentos: [],
    tempoRestauracao: 12 * 60 * 1000, // 24 horas em milissegundos
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
        this.tempoRestauracao = 12 * 60 * 1000;
        this.restaurarCapacidadeMineracao()
      }
    },    
    restaurarCapacidadeMineracao() {
      this.capacidadeMineracao = 100;
    },  
    minerar(objeto) {
      //console.log('Saldo:', objeto.saldo, 'Dormindo:', objeto.dormindo);
      if (!objeto.dormindo) {
        let incrementoSaldo = (this.capacidadeMineracao / 100);
        let decrementoCapacidade = Math.max(0, this.capacidadeMineracao / 100);

        objeto.saldo = (Math.round(objeto.saldo * 1000) + Math.round(incrementoSaldo * 1000)) / 1000;
        this.capacidadeMineracao = (Math.round(this.capacidadeMineracao * 1000) - Math.round(decrementoCapacidade * 1000)) / 1000;

        eventBus.emit('atualizar-saldo', objeto.saldo);
      }
      
      this.atualizarTempoRestauracao(); 
      this.salvarEstado();
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
        capacidadeMineracao:this.capacidadeMineracao
      };
      localStorage.setItem('appState', JSON.stringify(dataToSave));
    },
    restaurarEstado() {
      const savedState = localStorage.getItem('appState');
      if (savedState) {
        Object.assign(this.$data, JSON.parse(savedState));
        eventBus.emit('pessoa-restaurar-dados', JSON.parse(savedState));
      }
    },
    minerBarColor(saldo) {
      if (saldo <= 25) {
        return "red";
      } else if (saldo <= 50) {
        return "orange";
      } else if (saldo <= 75) {
        return "yellow";
      } else {
        return "green";
      }
    },
    salvarDadosPessoa(dadosPessoa) {
      this.pessoa = dadosPessoa;
      this.salvarEstado();
    },
  },
  created() {
    // Registre os ouvintes de eventos do EventBus
    eventBus.on("minerar", this.minerar);
    eventBus.on("pessoa-emitir-dados", this.salvarDadosPessoa);
  },
  mounted() {
    this.restaurarEstado();

  
    setInterval(() => {
      this.restaurarCapacidadeMineracao();
    }, 12 * 60 * 1000); // 24 horas em milissegundos 24 * 60 * 60 * 1000);
  },
  
});
