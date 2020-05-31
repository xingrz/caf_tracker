import moment from 'moment';
import { debounce } from 'throttle-debounce';

async function load(name) {
  const res = await fetch(`/data/${name}.json`);
  const { data, next } = await res.json();
  return {
    data: data.map(item => ({
      ...item,
      date: moment.utc(item.date).format('YYYY-MM-DD'),
    })),
    next: next,
  };
}

let lock = false;

export default {
  state: {
    data: [],
    next: null,
    loading: false,
    search: [],
  },
  mutations: {
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
      const { data, next } = await load(`latest`);
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
