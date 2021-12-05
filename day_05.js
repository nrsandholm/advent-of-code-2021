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

const isHorizontalOrVertical = (fromX, toX, fromY, toY) => {
  return fromX === toX || fromY === toY;
}

const isBetween = (v, fromV, toV) => {
  if (fromV > toV) return (v <= fromV && v >= toV);
  if (fromV < toV) return (v >= fromV && v <= toV);
  return v === fromV || v === toV;
};

const isBetweenDiagonal = (x, y, fromX, toX, fromY, toY) => {
  if (x === fromX && y === fromY) return true;
  if (x === toX && y === toY) return true;
  if (!isBetween(x, fromX, toX)) return false;
  if (!isBetween(y, fromY, toY)) return false;
  // Case 1,5 to 5,1
  if (fromX < toX && fromY > toY) {
    return (x - fromX) === (fromY - y) && (toX - x) === (y - toY);
  }
  // Case 1,1 to 5,5
  if (fromX < toX && fromY < toY) {
    return (x - fromX) === (y - fromY) && (toX - x) === (toY - y);
  }
  // Case 5,5 to 1,1
  if (fromX > toX && fromY > toY) {
    return (fromX - x) === (fromY - y) && (x - toX) === (y - toY);
  }
  // Case 5,1 to 1,5
  if (fromX > toX && fromY < toY) {
    return (x - fromX) === (fromY - y) && (toX - x) === (y - toY);
  }
  throw new Error('WTF');
};

// Part 1
(function () {
  const assignCoordinates = (matrix, coordinates) => {
    for (let {fromX, toX, fromY, toY} of coordinates) {
      if (! isHorizontalOrVertical(fromX, toX, fromY, toY)) {
        continue;
      }
      for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[y].length; x++) {
          const yInBetween = isBetween(y, fromY, toY);
          const xInBetween = isBetween(x, fromX, toX);
          if (xInBetween && yInBetween) {
            matrix[y][x] += 1;
          }
        }
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
      for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[y].length; x++) {
          // Horizontal or vertical
          if (isHorizontalOrVertical(fromX, toX, fromY, toY)) {
            const yInBetween = isBetween(y, fromY, toY);
            const xInBetween = isBetween(x, fromX, toX);
            if (xInBetween && yInBetween) {
              matrix[y][x] += 1;
            }
          }
          // Diagonal
          else if (isBetweenDiagonal(x, y, fromX, toX, fromY, toY)) {
            matrix[y][x] += 1;
          }
        }
      }
    }
  };

  const matrix = initMatrix(maxX, maxY);
  assignCoordinates(matrix, coordinates);
  // drawDiagram(matrix);
  const count = countOverlaps(matrix);
  console.log(count);
})();

// Tests
(function () {
  let fromX = 1, toX = 5, fromY = 1, toY = 5;
  if (isBetweenDiagonal(0, 0, fromX, toX, fromY, toY)) throw new Error('Wrong!');
  if (isBetweenDiagonal(6, 6, fromX, toX, fromY, toY)) throw new Error('Wrong!');
  if (isBetweenDiagonal(1, 0, fromX, toX, fromY, toY)) throw new Error('Wrong!');
  if (isBetweenDiagonal(1, 2, fromX, toX, fromY, toY)) throw new Error('Wrong!');
  if (isBetweenDiagonal(2, 1, fromX, toX, fromY, toY)) throw new Error('Wrong!');
  if (isBetweenDiagonal(2, 3, fromX, toX, fromY, toY)) throw new Error('Wrong!');
  if (isBetweenDiagonal(3, 2, fromX, toX, fromY, toY)) throw new Error('Wrong!');
  if (isBetweenDiagonal(3, 4, fromX, toX, fromY, toY)) throw new Error('Wrong!');
  if (isBetweenDiagonal(4, 3, fromX, toX, fromY, toY)) throw new Error('Wrong!');
  if (isBetweenDiagonal(4, 5, fromX, toX, fromY, toY)) throw new Error('Wrong!');
  if (isBetweenDiagonal(5, 4, fromX, toX, fromY, toY)) throw new Error('Wrong!');
  if (isBetweenDiagonal(5, 6, fromX, toX, fromY, toY)) throw new Error('Wrong!');
  if (!isBetweenDiagonal(1, 1, fromX, toX, fromY, toY)) throw new Error('Wrong!');
  if (!isBetweenDiagonal(2, 2, fromX, toX, fromY, toY)) throw new Error('Wrong!');
  if (!isBetweenDiagonal(3, 3, fromX, toX, fromY, toY)) throw new Error('Wrong!');
  if (!isBetweenDiagonal(4, 4, fromX, toX, fromY, toY)) throw new Error('Wrong!');
  if (!isBetweenDiagonal(5, 5, fromX, toX, fromY, toY)) throw new Error('Wrong!');

  fromX = 5; toX = 1; fromY = 1; toY = 5;
  if (isBetweenDiagonal(0, 0, fromX, toX, fromY, toY)) throw new Error('Wrong!');
  if (isBetweenDiagonal(6, 6, fromX, toX, fromY, toY)) throw new Error('Wrong!');
  if (isBetweenDiagonal(5, 2, fromX, toX, fromY, toY)) throw new Error('Wrong!');
  if (isBetweenDiagonal(5, 0, fromX, toX, fromY, toY)) throw new Error('Wrong!');
  if (isBetweenDiagonal(4, 1, fromX, toX, fromY, toY)) throw new Error('Wrong!');
  if (isBetweenDiagonal(4, 3, fromX, toX, fromY, toY)) throw new Error('Wrong!');
  if (isBetweenDiagonal(3, 4, fromX, toX, fromY, toY)) throw new Error('Wrong!');
  if (isBetweenDiagonal(3, 2, fromX, toX, fromY, toY)) throw new Error('Wrong!');
  if (isBetweenDiagonal(2, 3, fromX, toX, fromY, toY)) throw new Error('Wrong!');
  if (isBetweenDiagonal(2, 5, fromX, toX, fromY, toY)) throw new Error('Wrong!');
  if (isBetweenDiagonal(1, 6, fromX, toX, fromY, toY)) throw new Error('Wrong!');
  if (isBetweenDiagonal(1, 4, fromX, toX, fromY, toY)) throw new Error('Wrong!');
  if (!isBetweenDiagonal(5, 1, fromX, toX, fromY, toY)) throw new Error('Wrong!');
  if (!isBetweenDiagonal(4, 2, fromX, toX, fromY, toY)) throw new Error('Wrong!');
  if (!isBetweenDiagonal(3, 3, fromX, toX, fromY, toY)) throw new Error('Wrong!');
  if (!isBetweenDiagonal(2, 4, fromX, toX, fromY, toY)) throw new Error('Wrong!');
  if (!isBetweenDiagonal(1, 5, fromX, toX, fromY, toY)) throw new Error('Wrong!');

  console.log('All passed!');
})();