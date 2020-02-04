export let Vue
export function install(_Vue) {
  Vue = _Vue
  // apply $store
  Vue.mixin({
    beforeCreate() {
      const options = this.$options
      // store injection
      if (options.store) {
        this.$store = typeof options.store === 'function'
          ? options.store()
          : options.store
      } else if (options.parent && options.parent.$store) {
        this.$store = options.parent.$store
      }
    }
  })
}
