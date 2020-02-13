export function mapState(states): any {
  const res = {};
  Object.keys(states).forEach(key => {
    const val = states[key];
    res[key] = function() {
      const state = this.$store.state;
      const getters = this.$store.getters;
      return typeof val === 'function'
        ? val.call(this, state, getters)
        : state[val];
    };
  });
  return res;
}
