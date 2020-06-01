<template>
  <v-app>
    <v-app-bar app dark color="cyan">
      <v-toolbar-title>CAF Tracker</v-toolbar-title>
      <v-spacer />
      <Search />
    </v-app-bar>
    <v-content>
      <Table />
    </v-content>
  </v-app>
</template>

<script>
import { debounce } from 'throttle-debounce';
import { stringifyHistory } from './utils/history';

import Table from './components/Table.vue';
import Search from './components/Search.vue';

export default {
  name: 'App',
  components: {
    Table,
    Search,
  },
  computed: {
    search() {
      return this.$store.state.release.search;
    },
  },
  watch: {
    search: debounce(500, false, (search) => {
      history.pushState({}, null, stringifyHistory(search));
    }),
  },
};
</script>
