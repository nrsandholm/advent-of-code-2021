const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, 'day_11.txt'), 'utf8');

const getMatrix = (input) => {
  return input
    .split('\n')
    .map((row) => row.split('').map(v => parseInt(v)));
}

const increaseEnergyLevelsOfAllAdjacent = (matrix, [x, y]) => {
  for (let yy = -1; yy < 2; yy++) {
    for (let xx = -1; xx < 2; xx++) {
      // Skip current position
      if (yy === 0 && xx === 0) {
        continue;
      }
      if (matrix[y + yy] !== undefined && matrix[y + yy][x + xx] !== undefined) {
        matrix[y + yy][x + xx] += 1;
        if (matrix[y + yy][x + xx] === 10) {
          increaseEnergyLevelsOfAllAdjacent(matrix, [x + xx, y + yy]);
        }
      }
    }
  }
};

const increaseEnergyLevels = (matrix) => {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      matrix[y][x] += 1;
      if (matrix[y][x] === 10) {
        increaseEnergyLevelsOfAllAdjacent(matrix, [x, y]);
      }
    }
  }
};

const resetAndCountFlashed = (matrix) => {
  let count = 0;
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      if (matrix[y][x] > 9) {
        matrix[y][x] = 0;
        count++;
      }
    }
  }
  return count;
};

const print = (matrix) => {
  console.log('');
  matrix.forEach(row => console.log(row.join('')));
  console.log('');
};

// Part 1
(function () {
  const matrix = getMatrix(input);

  const run = (matrix, steps) => {
    let count = 0;
    for (let i = 0; i < steps; i++) {
      increaseEnergyLevels(matrix);
      count += resetAndCountFlashed(matrix);
    }
    print(matrix);
    console.log(count);
  };

  run(matrix, 100);
})();

// Part 2
(function () {
  const matrix = getMatrix(input);

  const run = (matrix) => {
    let iteration = 0;
    while (true) {
      iteration++;
      increaseEnergyLevels(matrix);
      const count = resetAndCountFlashed(matrix);
      if (count === matrix.length * matrix[0].length) {
        break;
      }
    }
    print(matrix);
    console.log(iteration);
  };

  run(matrix);
})();