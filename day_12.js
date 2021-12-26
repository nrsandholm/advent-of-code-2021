const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, 'day_12.txt'), 'utf8');
const map = input
  .split('\n')
  .reduce((map, route) => {
    const [a, b] = route.split('-');
    const routesA = map[a] || [];
    const routesB = map[b] || [];
    routesA.push(b);
    routesB.push(a);
    map[a] = routesA;
    map[b] = routesB;
    return map;
  }, {});

const print = (v) => {
  console.log(JSON.stringify(v, null, 4));
};

const isUpperCase = (s) => {
  return s === s.toUpperCase();
};

// Part 1
(function () {
  const findRoutes = (map, current, end, thisRoute = '', validRoutes = []) => {
    thisRoute += current;
    if (current !== end) thisRoute += '-';
    if (current === end) {
      validRoutes.push(thisRoute);
      return;
    }
    for (let cave of map[current]) {
      if (!isUpperCase(cave) && thisRoute.split('-').includes(cave)) continue;
      findRoutes(map, cave, end, thisRoute, validRoutes);
    }
    return validRoutes;
  };

  print(map);

  const routes = findRoutes(map, 'start', 'end');

  console.log(routes.length);
})();

// Part 2
(function () {
  const hasSomeSmallCaveBeenVisitedTwice = (array) => {
    return array
      .filter(v => !isUpperCase(v))
      .reduce((acc, cave) => {
        if (acc === true) return acc;
        acc[cave] = (acc[cave] || 0) + 1;
        if (acc[cave] > 1) acc = true;
        return acc;
      }, {}) === true;
  };

  const findRoutes = (map, current, end, thisRoute = '', validRoutes = []) => {
    thisRoute += current;
    if (current !== end) thisRoute += '-';
    if (current === end) {
      validRoutes.push(thisRoute);
      return;
    }
    for (let cave of map[current]) {
      const visitedCaves = thisRoute.split('-');
      const visitedThisCave = visitedCaves.includes(cave);
      const someSmallVisitedTwice = hasSomeSmallCaveBeenVisitedTwice(visitedCaves);
      if (cave === 'start' || (!isUpperCase(cave) && visitedThisCave && someSmallVisitedTwice)) continue;
      findRoutes(map, cave, end, thisRoute, validRoutes);
    }
    return validRoutes;
  };

  print(map);

  const routes = findRoutes(map, 'start', 'end');

  console.log(routes.length);
})();