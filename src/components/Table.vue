<template>
  <div>
    <v-data-table
      v-bind:headers="headers"
      v-bind:items="data"
      item-key="tag"
      v-bind:search="search.join(';')"
      v-bind:custom-filter="handleFilter"
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
  computed: {
    data() {
      return this.$store.state.release.data;
    },
    search() {
      return this.$store.state.release.search;
    },
  },
  async mounted() {
    this.$store.dispatch('loadInitial');
    document.addEventListener('scroll', this.loadMore, false);
  },
  beforeDestroy() {
    document.removeEventListener('scroll', this.loadMore);
  },
  watch: {
    data() {
      this.$nextTick(() => this.loadMore());
    },
    search() {
      this.$nextTick(() => this.loadMore());
    },
  },
  methods: {
    loadMore() {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      if (scrollHeight - (scrollTop + clientHeight) < 100) {
        this.$store.dispatch('loadMore');
      }
    },
    handleFilter(_value, _search, item) {
      const { search } = this.$store.state.release;
      if (search.length == 0) {
        return true;
      }
      return search.every(q => {
        if (q.match(/^soc:(.+)$/)) {
          return item.chipset.includes(RegExp.$1);
        } else if (q.match(/^os:(.+)$/)) {
          return item.version.includes(RegExp.$1);
        } else {
          return item.tag.toLowerCase().includes(q.toLowerCase());
        }
      });
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
