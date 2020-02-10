export interface vuexOptions {
  state: any
  // the only way to change state
  mutations?: any
  actions?: any
  modules?: any
  namespaced?: boolean
  getters?: any
}
