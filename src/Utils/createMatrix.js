export default (data = [], model = 'exponential') =>
  data.reduce((array, next) => {
    return [
      ...array,
      next[model].reduce((prev, value) => {
        if (array.length === data.length - 1) {
          if (prev.length === data.length - 1) {
            return [...prev, 0];
          }
          return [...prev, 1];
        }
        return [...prev, value];
      }, [])
    ];
  }, []);
