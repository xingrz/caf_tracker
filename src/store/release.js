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
      const { data, next } = await load(`latest`);
      commit('append', { data, next });
    },
  },
};
