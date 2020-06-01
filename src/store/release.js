import moment from 'moment';
import { debounce } from 'throttle-debounce';
import { parseHistory } from '../utils/history';

async function load(name) {
  const res = await fetch(`/data/${name}.json`);
  const json = await res.json();
  return {
    ...json,
    data: json.data.map(item => ({
      ...item,
      date: moment.utc(item.date).format('YYYY-MM-DD'),
    })),
  };
}

let lock = false;

export default {
  state: {
    data: [],
    chipsets: [],
    versions: [],
    next: null,
    loading: false,
    search: parseHistory(location.search),
  },
  mutations: {
    init(state, { chipsets, versions }) {
      state.chipsets = chipsets;
      state.versions = versions;
    },
    append(state, { data, next }) {
      state.data = [ ...state.data, ...data ];
      state.next = next;
    },
    loading(state, loading) {
      state.loading = loading;
    },
    search(state, search) {
      state.search = search;
    },
  },
  actions: {
    startLoading: debounce(200, true, ({ commit }) => {
      commit('loading', true);
    }),
    stopLoading: debounce(200, false, ({ commit }) => {
      commit('loading', false);
    }),
    async loadInitial({ commit, dispatch }) {
      dispatch('startLoading');
      lock = true;
      const { data, chipsets, versions, next } = await load(`latest`);
      commit('init', { chipsets, versions });
      commit('append', { data, next });
      lock = false;
      dispatch('stopLoading');
    },
    async loadMore({ commit, dispatch, state }) {
      if (lock) return;
      if (!state.next) return;
      dispatch('startLoading');
      lock = true;
      const { data, next } = await load(`static-${state.next}`);
      commit('append', { data, next });
      lock = false;
      dispatch('stopLoading');
    },
  },
};
