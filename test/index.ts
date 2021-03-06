import Vuex from '../src';
// import Vuex from 'vuex'
import Vue from 'vue/dist/vue';
import { mapState } from '../src/class/map';

Vue.use(Vuex);

// base use
function baseUse() {
  const store = new Vuex.Store({
    state: {
      count: 0,
    },
    mutations: {
      increment(state) {
        state.count++;
      },
    },
  });

  store.commit('increment');

  console.log(store.state.count); // -> 1
}

function baseCounter() {
  const store = new Vuex.Store({
    state: {
      count: 0,
    },
    mutations: {
      increment: state => state.count++,
      decrement: state => state.count--,
    },
  });

  new Vue({
    el: '#app',
    store,
    template: '<div id="app">\n' +
      '  <p>{{ count }}</p>\n' +
      '  <p>\n' +
      '    <button @click="increment">+</button>\n' +
      '    <button @click="decrement">-</button>\n' +
      '  </p>\n' +
      '</div>',
    computed: {
      count() {
        return this.$store.state.count;
      },
    },
    methods: {
      increment() {
        this.$store.commit('increment');
      },
      decrement() {
        this.$store.commit('decrement');
      },
    },
  });
}

function baseAction() {
  const store = new Vuex.Store({
    state: {
      count: 0,
    },
    mutations: {
      increment(state) {
        state.count++;
      },
    },
    actions: {
      increment() {
        this.commit('increment');
      },
    },
  });

  store.dispatch('increment');

  console.log(store.state.count); // -> 1
}

function baseModules() {
  const store = new Vuex.Store({
    modules: {
      a: {
        namespaced: true,
        mutations: {
          increment(state) {
            // local state
            console.log(state);
            state.count++;
          },
        },
        actions: {
          increment(store) {
            store.commit('increment')
          }
        },
        state: {
          count: 222
        },
        modules: {
          b: {
            state: {
              count: 333
            }
          }
        }
      },
    },
    state: {
      count: 0,
    },
  });

  store.dispatch('a/increment');

  console.log(store.state); // -> 1
}

function baseGetters() {
  const myPlugin = store => {
    // 当 store 初始化后调用
    store.subscribe((mutation, state) => {
      // 每次 mutation 之后调用
      // mutation 的格式为 { type, payload }
      console.log(mutation);
    })
  }
  const store = new Vuex.Store({
    modules: {
      a: {
        plugins: [myPlugin],
        namespaced: true,
        mutations: {
          increment(state) {
            // local state
            state.count++;
          },
        },
        actions: {
          increment(store) {
            store.commit('increment')
          }
        },
        getters: {
          test: (state) => {
            return state.count
          }
        },
        state: {
          count: 222
        },
        modules: {
          b: {
            state: {
              count: 333
            }
          }
        }
      },
    },
    state: {
      count: 0,
    },
  });

  store.dispatch('a/increment');
  console.log(store.getters['a/test']);
}

function baseMapFunction() {
  const store = new Vuex.Store({
    state: {
      count: 0,
    },
    mutations: {
      increment: state => state.count++,
      decrement: state => state.count--,
    },
  });
  new Vue({
    el: '#app',
    store,
    template: '<div id="app">\n' +
      '  <p>{{ count }}</p>\n' +
      '  <p>\n' +
      '    <button @click="increment">+</button>\n' +
      '    <button @click="decrement">-</button>\n' +
      '  </p>\n' +
      '</div>',
    computed: mapState({
      // 箭头函数可使代码更简练
      count: state => state.count,
    }),
    methods: {
      increment() {
        this.$store.commit('increment');
      },
      decrement() {
        this.$store.commit('decrement');
      },
    },
  });
}
baseMapFunction();

