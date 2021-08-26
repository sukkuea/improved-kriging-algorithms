
export default (node = []) => (NUGGET, SILL, RANGE) =>
  node.reduce((acc, current) => {
    return [
      ...acc, //round 1 [] //round 2[{id:1,x:1,y2,rage:[...value]}] rund 3 [{..},{..}]
      {
        latitude: current.latitude,
        longtitude: current.longtitude,
        attitude: current.attitude,
        //  range:current.range,
        exponential: current.range.reduce((acc, rangeValue) => {
          //model exponential
          if (acc.length === current.range.length - 1) {
            return [...acc, 1];
          } else if (rangeValue === 0) {
            return [...acc, rangeValue];
          } else {
            return [
              ...acc,
              NUGGET + SILL * (1 - Math.exp(-rangeValue / RANGE)),
            ];
          }
        }, []),
        linear: current.range.reduce((acc, rangeValue) => {
          if (acc.length === current.range.length - 1) {
            return [...acc, 1];
          } else if (rangeValue === 0) {
            return [...acc, rangeValue];
          } else {
            return [...acc, NUGGET + SILL * (rangeValue / RANGE)];
          }
        }, []),
        spherical: current.range.reduce((acc, rangeValue) => {
          if (acc.length === current.range.length - 1) {
            return [...acc, 1];
          } else if (rangeValue === 0) {
            return [...acc, rangeValue];
          } else {
            return [
              ...acc,
              NUGGET +
              SILL *
              ((3 * rangeValue) / (2 * RANGE) -
                Math.pow(rangeValue / RANGE, 3) / 2),
            ];
          }
        }, []),
        pentaspherical: current.range.reduce((acc, rangeValue) => {
          if (acc.length === current.range.length - 1) {
            return [...acc, 1];
          } else if (rangeValue === 0) {
            return [...acc, rangeValue];
          } else {
            return [
              ...acc,
              NUGGET +
              SILL *
              ((15 * rangeValue) / (8 * RANGE) -
                (5 / 4) * Math.pow(rangeValue / RANGE, 3) +
                (3 / 8) * Math.pow(rangeValue / RANGE, 5)),
            ];
          }
        }, []),
        gaussian: current.range.reduce((acc, rangeValue) => {
          if (acc.length === current.range.length - 1) {
            return [...acc, 1];
          } else if (rangeValue === 0) {
            return [...acc, rangeValue];
          } else {
            return [
              ...acc,
              NUGGET +
              SILL *
              (1 -
                Math.exp(
                  (Math.pow(rangeValue, 2) / Math.pow(RANGE, 2)) * -1
                )),
            ];
          }
        }, []),
        exponentialPolynomialTrendlines: current.range.reduce(
          (acc, rangeValue) => {
            if (acc.length === current.range.length - 1) {
              return [...acc, 1];
            } else if (rangeValue === 0) {
              return [...acc, rangeValue];
            } else {
              return [
                ...acc,
                1.692 * Math.pow(rangeValue, 3) * Math.pow(10, -10) -
                2.969 * Math.pow(rangeValue, 2) * Math.pow(10, -7) +
                2.507 * rangeValue * Math.pow(10, -4) +
                2.53 * Math.pow(10, -5),
              ];
            }
          },
          []
        ),
        exponentialConstant: current.range.reduce((acc, rangeValue) => {
          //model exponential
          if (acc.length === current.range.length - 1) {
            return [...acc, 1];
          } else if (rangeValue === 0) {
            return [...acc, rangeValue];
          } else {
            return [
              ...acc,
              NUGGET + SILL * (1 - Math.exp(-rangeValue / RANGE)),
            ];
          }
        }, []),
      },
    ];
  }, []);
