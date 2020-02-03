import { vuexOptions } from '../@types';
import { Vue } from '../install';

export class Store {
  public vue: any;
  private _vm: any;
  private _mutations = Object.create(null)

  constructor(options: vuexOptions) {
    // vue.use(vuex) must call
    // 强耦合vue
    this.vue = Vue || options.vue;
    // the root of state
    const state = options.state;
    // state作为data传入并初始化了一个vm
    this._vm = new this.vue({
      data: {
        $$state: state
      }
    })
    // init mutations
    this.initMutations(options)
  }

  commit(type: string, payload?: any) {
    const entry = this._mutations[type]
    if(entry && entry.length!== 0) {
      entry.forEach(cb => {
        cb(payload)
      })
    }
  }

  initMutations(options: vuexOptions) {
    Object.keys(options.mutations).forEach(type => {
      this.registerMutation(type, options.mutations[type])
    })
  }
  private registerMutation(type, handler) {
    const entry = this._mutations[type] || (this._mutations[type] = [])
    entry.push((payload) => {
      // state payload
      handler.call(this, this.state, payload)
    })
  }

  get state() {
    return this._vm._data.$$state
  }

  set state(val)  {

  }
}
