const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, 'day_07.txt'), 'utf8');
const array = input.split(',').map(v => parseInt(v));
Object.freeze(array);

const countMovesToAlignment = (array, to, countFuelConsumption) => {
  return array.reduce((count, from) => {
    return count + countFuelConsumption(to, from);
  }, 0);
};

// Part 1
(function () {
  const countFuelConsumption = (to, from) => {
    return Math.abs(to - from);
  }

  const submarines = [...array].sort((a, b) => a - b);
  const median = submarines[Math.floor(submarines.length / 2)];
  const consumption = countMovesToAlignment(submarines, median, countFuelConsumption);
  console.log(consumption);
})();

// Part 2
(function () {
  const countFuelConsumption = (to, from) => {
    let consumption = 0;
    for (let i = 1; i <= Math.abs(to - from); i++) {
      consumption += i;
    }
    return consumption;
  };

  const findPositionWithLowestFuelConsumtion = (submarines, start, end) => {
    const result = {
      position: null,
      consumption: null
    };
    for (let i = start; i <= end; i++) {
      const count = countMovesToAlignment(submarines, i, countFuelConsumption);
      if (!result.consumption || count < result.consumption) {
        result.consumption = count;
        result.position = i;
      }
    }
    return result;
  };

  const submarines = [...array];
  const submarinePositionCount = submarines.reduce((count, v) => count + v, 0);
  const average = Math.round(submarinePositionCount / submarines.length);
  const tenthOfAverage = Math.round(average / 10);
  const { consumption, position } = findPositionWithLowestFuelConsumtion(submarines, average - tenthOfAverage, average + tenthOfAverage);
  console.log(consumption);
})();
