import { vuexOptions } from '../@types';
import { Vue } from '../install';

let rootStore = null;

export class Store {
  private _mutations = Object.create(null);
  private _actions = Object.create(null);
  public _modules = Object.create(null);
  public getters = Object.create(null);
  public $parent;
  public namespace;
  public namespaceKey;
  public isRoot: boolean = false;
  private _vm: any;
  private _computed = {};

  constructor(options: vuexOptions, parentStore?: Store, namespaceKey?: string) {
    rootStore = rootStore || this;
    // initChild
    if (parentStore && namespaceKey) {
      this.$parent = parentStore;
      this.namespaceKey = namespaceKey;
      const parentNameSpace = parentStore.namespace;
      this.namespace = parentNameSpace ? `${parentNameSpace}/${namespaceKey}` : namespaceKey;
    } else {
      this.isRoot = true;
    }
    // vue.use(vuex) must call
    // 强耦合了vue,比如getters要用computed实现
    // the root of state, current state
    // init getters
    if (options.getters) this.initGetters(options);
    if (options.state) this.initState(options);
    // initModules
    if (options.modules) this.initModules(options);
    // init mutations
    if (options.mutations) this.initMutations(options);
    // init actions
    if (options.actions) this.initActions(options);
  }

  // getters don't support dynamic register
  initGetters(options: vuexOptions) {
    const getters = options.getters;
    const store = this;
    Object.keys(getters).forEach(key => {
      const rawGetter = getters[key];
      // init computed for vm
      this._computed[key] = () => {
        return rawGetter(this.state);
      };
      // define getters to visit in global, but vm in local
      const _key = options.namespaced ? `${this.namespaceKey}/${key}`: key
      Object.defineProperty(rootStore.getters, _key, {
        get(): any {
          return store._vm[key];
        },
      });
    });
  }

  initState(options: vuexOptions) {
    const state = options.state;
    // 使用observable替换vm(又换回来了)
    // localState
    this._vm = new Vue({
      data: {
        $$state: state,
      },
      computed: this._computed,
    });
    if (!this.isRoot) {
      Vue.set(this.$parent.state, this.namespaceKey, this.state);
    }
  }

  initModules(options: vuexOptions) {
    const modules = options.modules;
    // connect state from parent to child
    Object.keys(modules).forEach(key => {
      this._modules[key] = new Store(modules[key], this, key);
    });
  }

  // commit and mutations
  commit(type: string, payload?: any) {
    const entry = this._mutations[type];
    if (entry && entry.length !== 0) {
      entry.forEach(cb => {
        cb(payload);
      });
    }
  }

  initMutations(options: vuexOptions) {
    // init in global, namespaced in itself, only effect name!
    const mutations = options.mutations;
    Object.keys(mutations).forEach(type => {
      // register in root
      const namespaced = options.namespaced ? `${this.namespace}/${type}` : type;
      if (this.isRoot) {
        rootStore.registerMutation(namespaced, mutations[type]);
      } else {
        rootStore.registerMutation(namespaced, mutations[type], this);
      }
      // register in local
      this.registerMutation(type, mutations[type]);
    });
  }

  public registerMutation(type, handler, localStore?: Store) {
    const entry = this._mutations[type] || (this._mutations[type] = []);
    entry.push((payload) => {
      // state payload
      handler.call(this, localStore ? localStore.state : this.state, payload);
    });
  }

  // actions and dispatch
  dispatch(type: string, payload?: any) {
    const entry = this._actions[type];
    if (entry && entry.length !== 0) {
      entry.forEach(cb => {
        cb(payload);
      });
    }
  }

  initActions(options) {
    const actions = options.actions;
    Object.keys(actions).forEach(type => {
      const namespaced = options.namespaced ? `${this.namespace}/${type}` : type;
      // strange... should use store
      // rootStore.registerActions(namespaced, actions[type], {
      //   commit: this.commit.bind(this)
      // });
      rootStore.registerActions(namespaced, actions[type], this);
    });
  }

  public registerActions(type, handler, localStore?: Store) {
    const entry = this._actions[type] || (this._actions[type] = []);
    const store = localStore || this;
    entry.push((payload) => {
      // state payload
      // use store replace this for get localStore
      handler.call(this, store, payload);
    });
  }

  get state() {
    return this._vm._data.$$state;
  }

  get rootState() {
    return rootStore.state;
  }

  set rootState(val) {

  }

  set state(val) {

  }
}
