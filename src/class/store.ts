import { vuexOptions } from '../@types';
import { Vue } from '../install';

export class Store {
  public vue: any;
  private _state: any;
  private _mutations = Object.create(null);
  private _actions =  Object.create(null);

  constructor(options: vuexOptions) {
    // vue.use(vuex) must call
    // 强耦合vue
    this.vue = Vue || options.vue;
    // the root of state
    const state = options.state;
    // 使用observable替换vm
    this._state = this.vue.observable(state);
    // init mutations
    if(options.mutations) this.initMutations(options.mutations);
    if(options.actions) this.initActions(options.actions)
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

  initMutations(mutations) {
    Object.keys(mutations).forEach(type => {
      this.registerMutation(type, mutations[type]);
    });
  }

  private registerMutation(type, handler) {
    const entry = this._mutations[type] || (this._mutations[type] = []);
    entry.push((payload) => {
      // state payload
      handler.call(this, this.state, payload);
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

  initActions(actions) {
    Object.keys(actions).forEach(type => {
      this.registerActions(type, actions[type]);
    });
  }

  registerActions(type, handler) {
    const entry = this._actions[type] || (this._actions[type] = []);
    entry.push((payload) => {
      // state payload
      handler.call(this, {}, payload);
    });
  }

  get state() {
    return this._state;
  }

  set state(val) {

  }
}
