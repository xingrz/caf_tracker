import Vue from 'vue';
import Vuex from 'vuex';

import release from './release';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    release,
  },
});
