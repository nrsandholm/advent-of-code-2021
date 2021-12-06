const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, 'day_06.txt'), 'utf8');
const array = input.split(',').map(v => parseInt(v));

// Part 1
(function () {
  const fishes = [...array];
  const days = 80;

  const breed = (fishes, days) => {
    for (let i = 1; i <= days; i++) {
      let resetCount = 0;
      for (let k = 0; k < fishes.length; k++) {
        if (fishes[k] === 0) {
          resetCount++;
          fishes[k] = 6;
          continue;
        }
        fishes[k] -= 1;
      }
      for (let i = 0; i < resetCount; i++) {
        fishes.push(8);
      }
    }
  }

  breed(fishes, days);

  console.log(`After ${days} days, lanternfish count is ${fishes.length}`);
})();

// Part 2
(function () {
  // Index equals sequence
  const groups = Array(9).fill(0);
  const fishes = [...array];
  const days = 256;

  const assign = (fishes, groups) => {
    for (let fish of fishes) {
      groups[fish] += 1;
    }
  };

  const breed = (groups, days) => {
    for (let i = 1; i <= days; i++) {
      const resetCount = groups[0];
      for (let k = 1; k < groups.length; k++) {
        groups[k - 1] = groups[k];
      }
      groups[6] += resetCount;
      groups[8] = resetCount;
    }
  };

  const count = (groups) => {
    return groups.reduce((total, count) => {
      return total + count;
    }, 0);
  }

  assign(fishes, groups);
  breed(groups, days);
  const c = count(groups);

  console.log(`After ${days} days, lanternfish count is ${c}`);
})();