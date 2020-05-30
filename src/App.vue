<template>
  <v-app>
    <v-content>
      <Table />
    </v-content>
  </v-app>
</template>

<script>
import Table from './components/Table.vue';

export default {
  name: 'App',
  components: {
    Table,
  },
};
</script>
