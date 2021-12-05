const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, 'day_05.txt'), 'utf8');
const { coordinates, maxX, maxY } = input
  .split('\n')
  .reduce((result, row) => {
    const [from, to] = row.split(' -> ');
    const [fromX, fromY] = from.split(',').map(v => parseInt(v));
    const [toX, toY] = to.split(',').map(v => parseInt(v));
    result.maxX = Math.max(result.maxX, fromX, toX);
    result.maxY = Math.max(result.maxY, fromY, toY);
    result.coordinates.push({ fromX, fromY, toX, toY });
    return result;
  }, {
    maxX: 0,
    maxY: 0,
    coordinates: []
  });

const drawDiagram = (matrix) => {
  for (let row of matrix) {
    console.log(row.join(' '));
  }
};

const countOverlaps = (matrix) => {
  return matrix.reduce((count, row) => {
    return count + row.filter(v => v >= 2).length;
  }, 0);
};

const initMatrix = (maxX, maxY) => {
  return Array(maxY + 1).fill(null).map(() => Array(maxX + 1).fill(0));
};

const getCoordinate = (index, from, to) => {
  if (from > to) {
    return from - index;
  }
  else if (from < to) {
    return from + index;
  }
  else {
    return from;
  }
}

const generateLine = (fromX, toX, fromY, toY) => {
  const length = Math.max(1 + Math.abs(fromX - toX), 1 + Math.abs(fromY - toY));
  return Array(length)
    .fill(null)
    .map((_, i) => {
      return [getCoordinate(i, fromX, toX), getCoordinate(i, fromY, toY)]
    });
};

// Part 1
(function () {
  const assignCoordinates = (matrix, coordinates) => {
    for (let {fromX, toX, fromY, toY} of coordinates) {
      if (! (fromX === toX || fromY === toY)) {
        continue;
      }
      const line = generateLine(fromX, toX, fromY, toY);
      for (let [x, y] of line) {
        matrix[y][x] += 1;
      }
    }
  };

  const matrix = initMatrix(maxX, maxY);
  assignCoordinates(matrix, coordinates);
  // drawDiagram(matrix);
  const count = countOverlaps(matrix);
  console.log(count);
})();

// Part 2
(function () {
  const assignCoordinates = (matrix, coordinates) => {
    for (let {fromX, toX, fromY, toY} of coordinates) {
      const line = generateLine(fromX, toX, fromY, toY);
      for (let [x, y] of line) {
        matrix[y][x] += 1;
      }
    }
  };

  const matrix = initMatrix(maxX, maxY);
  assignCoordinates(matrix, coordinates);
  // drawDiagram(matrix);
  const count = countOverlaps(matrix);
  console.log(count);
})();
