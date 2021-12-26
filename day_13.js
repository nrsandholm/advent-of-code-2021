const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, 'day_13.txt'), 'utf8');
const { coordinates, instructions, maxX, maxY } = input
  .split('\n')
  .reduce((result, row) => {
    if (row.indexOf(',') !== -1) {
      const [x_, y_] = row.split(',');
      const x = parseInt(x_);
      const y = parseInt(y_);
      result.coordinates.push([x, y]);
      result.maxX = Math.max(result.maxX, x);
      result.maxY = Math.max(result.maxY, y);
    }
    if (row.indexOf('fold') === 0) {
      const [fold, along, coordinate] = row.split(' ');
      const [axis, point] = coordinate.split('=');
      if (axis === 'y') result.instructions.push([0, parseInt(point)]);
      if (axis === 'x') result.instructions.push([parseInt(point), 0]);
    }
    return result;
  }, {
    maxX: 0,
    maxY: 0,
    coordinates: [],
    instructions: []
  });

const initMatrix = (maxX, maxY) => {
  console.log(`Matrix size ${maxX + 1} x ${maxY + 1}`);
  return Array(maxY + 1).fill(null).map(() => Array(maxX + 1).fill(0));
};

const fillDots = (matrix, coordinates) => {
  for (let [x, y] of coordinates) {
    matrix[y][x] = 1;
  }
};

const print = (matrix) => {
  if (matrix[0].length > 250) {
    console.log('Too big to print');
    return;
  }
  console.log();
  for (let row of matrix) {
    console.log(row.join('').replace(/0/g, '.').replace(/1/g, '#'));
  }
  console.log();
}

const fold = (matrix, [x, y]) => {
  if (y > 0) {
    const spliced = matrix.splice(y + 1);
    // Folded row is discarded
    const row = matrix.splice(y);
    // Verify that row does not contain dots!
    if (row.includes(1)) throw new Error('Row contains dot(s)!');
    if (matrix.length !== spliced.length) {
      console.log(`Uneven horizontal folding, ${matrix.length} !== ${spliced.length}`);
    }
    const offset = matrix.length - spliced.length;
    const reversed = spliced.reverse();
    for (let y = 0; y < reversed.length; y++) {
      for (let x = 0; x < reversed[y].length; x++) {
        if (reversed[y][x] === 1) {
          matrix[y + offset][x] = 1;
        }
      }
    }
  }
  if (x > 0) {
    let offset = null;
    let reversed = [];
    for (let y = 0; y < matrix.length; y++) {
      const spliced = matrix[y].splice(x + 1);
      // Folded column is discarded
      const col = matrix[y].splice(x);
      // Verify that column does not contain dots!
      if (col.includes(1)) throw new Error('Column contains dot(s)!');
      if (matrix[y].length !== spliced.length && offset === null) {
        console.log(`Uneven vertical folding, ${matrix[y].length} !== ${spliced.length}`);
      }
      if (offset === null) offset = matrix[y].length - spliced.length;
      reversed.push(spliced.reverse());
    }
    for (let y = 0; y < reversed.length; y++) {
      for (let x = 0; x < reversed[y].length; x++) {
        if (reversed[y][x] === 1) {
          matrix[y][x + offset] = 1;
        }
      }
    }
  }
};

const countDots = (matrix) => {
  return matrix.reduce((count, row) => {
    return count + row.reduce((count, v) => {
      return count + v;
    }, 0);
  }, 0);
};

// Part 1
(function () {
  const matrix = initMatrix(maxX, maxY);
  fillDots(matrix, coordinates);
  fold(matrix, instructions[0]);
  print(matrix);
  console.log(countDots(matrix));
})();

// Part 2
(function () {
  const foldAll = (matrix, instructions) => {
    for(let instruction of instructions) {
      fold(matrix, instruction);
      print(matrix);
    }
  };

  const matrix = initMatrix(maxX, maxY);
  fillDots(matrix, coordinates);
  foldAll(matrix, instructions);
})();