<template>
  <div>
    <v-data-table
      v-bind:headers="headers"
      v-bind:items="$store.state.release.data"
      v-bind:disable-pagination="true"
      v-bind:disable-sort="true"
      v-bind:hide-default-footer="true"
    >
      <template v-slot:item.tag="{ item }">
        <span style="font-family: monospace;">{{ item.tag }}</span>
      </template>
      <template v-slot:item.date="{ item }">
        <span style="font-family: monospace;">{{ item.date }}</span>
      </template>
      <template v-slot:item.chipset="{ item }">
        <span style="font-family: monospace;">{{ item.chipset }}</span>
      </template>
      <template v-slot:item.version="{ item }">
        <span style="font-family: monospace;">{{ item.version }}</span>
      </template>
    </v-data-table>
    <div v-if="$store.state.release.loading" class="loading">
      <v-progress-circular indeterminate />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Table',
  data () {
    return {
      headers: [
        { text: 'Tag', value: 'tag' },
        { text: 'Date', value: 'date', width: '10em' },
        { text: 'SoC', value: 'chipset', width: '14em' },
        { text: 'OS', value: 'version', width: '10em' },
      ],
    }
  },
  async mounted() {
    this.$store.dispatch('loadInitial');
    this.unwatchData = this.$watch('$store.state.release.data', this.loadMore);
    document.addEventListener('scroll', this.loadMore, false);
  },
  beforeDestroy() {
    this.unwatchData();
    document.removeEventListener('scroll', this.loadMore);
  },
  methods: {
    loadMore() {
      const scroll = document.documentElement.scrollTop;
      const viewportHeight = document.documentElement.clientHeight;
      const contentHeight = document.body.clientHeight;
      if (contentHeight - (scroll + viewportHeight) < 10) {
        this.$store.dispatch('loadMore');
      }
    },
  },
};
</script>

<style>
.loading {
  text-align: center;
  padding: 10px 0;
}
</style>
