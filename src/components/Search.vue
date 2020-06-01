<template>
  <v-autocomplete
    v-model="select"
    v-bind:search-input.sync="search"
    v-bind:items="items"
    label="Search for Tag, SoC, OS…"
    hide-no-data
    hide-details
    hide-selected
    chips
    deletable-chips
    multiple
    clearable
    flat
    solo-inverted
  >
    <template v-slot:selection="data">
      <v-chip color="blue-grey" close v-on:click:close="handleRemove(data.item)">
        {{ data.item }}
      </v-chip>
    </template>
  </v-autocomplete>
</template>

<script>
function uniq(list) {
  const dict = {};
  for (const item of list) {
    dict[item] = 1;
  }
  return Object.keys(dict);
}

export default {
  name: 'Search',
  data() {
    return {
      select: this.$store.state.release.search,
      search: '',
    };
  },
  computed: {
    releases() {
      return this.$store.state.release.data.map(item => item.tag);
    },
    query() {
      let query = [ ...this.select ];

      if (this.search) {
        query = [ ...query, this.search ];
      }

      return uniq(query);
    },
    items() {
      const { chipsets, versions } = this.$store.state.release;

      let items = [ ...this.query ];

      if (!this.select.some(v => v.startsWith('soc:'))) {
        items = [ ...items, ...chipsets.map(item => `soc:${item}`) ];
      }

      if (!this.select.some(v => v.startsWith('os:'))) {
        items = [ ...items, ...versions.map(item => `os:${item}`) ];
      }

      return items;
    },
  },
  watch: {
    query(query) {
      this.$store.commit('search', query);
    },
  },
  methods: {
    handleRemove(item) {
      const index = this.select.indexOf(item);
      if (index >= 0) this.select.splice(index, 1);
    },
  },
};
</script>
