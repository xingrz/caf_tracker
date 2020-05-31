import moment from 'moment';

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
  },
  mutations: {
    append(state, { data, next }) {
      state.data = [ ...state.data, ...data ];
      state.next = next;
    },
  },
  actions: {
    async loadInitial({ commit }) {
      lock = true;
      const { data, next } = await load(`latest`);
      commit('append', { data, next });
      lock = false;
    },
    async loadMore({ commit, state }) {
      if (lock) return;
      if (!state.next) return;
      lock = true;
      const { data, next } = await load(`static-${state.next}`);
      commit('append', { data, next });
      lock = false;
    },
  },
};
