<template>
    <div id="app">
      <pessoa></pessoa>
      <miner></miner>
      <metas></metas>
    </div>
  </template>
  
  <script>
  import Pessoa from './components/Pessoa.vue';
  import Miner from './components/Miner.vue';
  import Metas from './components/Metas.vue';
  
  export default {
    components: {
      Pessoa,
      Miner,
      Metas,
    },
  };
  </script>
  