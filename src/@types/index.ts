export interface vuexOptions {
  state: any
  // the only way to change state
  mutations?: any
  actions?: any
  modules?: any

  vue?: any

  _parentState?: any
}
