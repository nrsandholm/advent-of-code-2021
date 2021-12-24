const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, 'day_09.txt'), 'utf8');
const matrix = input
  .split('\n')
  .reduce((result, row) => {
    result.push(row.split('').map(v => parseInt(v)))
    return result;
  }, []);

const isLow = (matrix, x, y) => {
  let lowest = true;
  if (y > 0 && matrix[y - 1][x] <= matrix[y][x]) lowest = false;                    // Top
  if (x < matrix[y].length - 1 && matrix[y][x + 1] <= matrix[y][x]) lowest = false; // Right
  if (y < matrix.length - 1 && matrix[y + 1][x] <= matrix[y][x]) lowest = false;    // Bottom
  if (x > 0 && matrix[y][x - 1] <= matrix[y][x]) lowest = false;                    // Left
  return lowest;
};

const findLows = (matrix) => {
  const lows = [];
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      if (isLow(matrix, x, y)) {
        lows.push([x, y]);
      }
    }
  }
  return lows;
};

// Part 1
(function () {
  const sum = (matrix, lows) => {
    return lows.reduce((sum, [x, y]) => {
      return sum + matrix[y][x] + 1;
    }, 0);
  };

  const lows = findLows(matrix);
  const sumOfRiskLevels = sum(matrix, lows);
  console.log(sumOfRiskLevels);
})();

// Part 2
(function () {
  const sum = (lows) => {
    return lows.reduce((sum, [point, value]) => {
      return sum + value + 1;
    }, 0);
  };

  const findPoint = (array, [x, y]) => array.find(([xx, yy]) => x === xx && y === yy);

  const shouldCrawl = (matrix, [x, y], visited) => {
    if (!matrix[y] || !matrix[y][x]) return false;
    return matrix[y][x] !== 9 && findPoint(visited, [x, y]) === undefined;
  }

  const crawl = (matrix, point, visited, unvisited) => {
    !findPoint(visited, point) && visited.push(point);
    const [x, y] = point;
    const point1 = [x, y + 1];
    shouldCrawl(matrix, point1, visited) && unvisited.push(point1);
    const point2 = [x, y - 1];
    shouldCrawl(matrix, point2, visited) && unvisited.push(point2);
    const point3 = [x + 1, y];
    shouldCrawl(matrix, point3, visited) && unvisited.push(point3);
    const point4 = [x - 1, y];
    shouldCrawl(matrix, point4, visited) && unvisited.push(point4);
    if (unvisited.length > 0) {
      const point = unvisited.pop();
      crawl(matrix, point, visited, unvisited);
    }
  };

  const findAllInBasins = (matrix, lows) => {
    return lows.map((point) => {
      const visited = [];
      const unvisited = [];
      crawl(matrix, point, visited, unvisited);
      return {
        point,
        visited,
        unvisited
      };
    });
  };

  const lows = findLows(matrix);
  const basins = findAllInBasins(matrix, lows);
  const [a, b, c, ...rest] = basins.sort((a, b) => {
    if (a.visited.length > b.visited.length) return -1;
    if (a.visited.length < b.visited.length) return 1;
    return 0;
  });
  const multipleOfThreeBiggestBasins = a.visited.length * b.visited.length * c.visited.length;
  console.log(multipleOfThreeBiggestBasins);
})();