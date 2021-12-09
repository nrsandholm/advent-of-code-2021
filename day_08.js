const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, 'day_08.txt'), 'utf8');
const array = input
  .split('\n')
  .reduce((result, row) => {
    const [patternsRaw, outputRaw] = row.split('|');
    const r = {
      patterns: patternsRaw.trim().split(' '),
      output: outputRaw.trim().split(' ')
    };
    result.push(r);
    return result;
  }, []);

const numbers = [
  'abcefg',
  'cf',
  'acdeg',
  'acdfg',
  'bcdf',
  'abdfg',
  'abdefg',
  'acf',
  'abcdefg',
  'abcdfg'
];

const sortString = (s) => s.split('').sort().join('');

const decodeOutputs = (array, mapNumbers) => {
  return array.map(({patterns, output}) => {
    const map = mapNumbers(patterns);
    const numbers = [];
    for (let pattern of output) {
      numbers.push(map[sortString(pattern)]);
    }
    return numbers;
  });
};

(function () {
  const mapNumbers = (patterns) => {
    return patterns.reduce((map, pattern) => {
      pattern = sortString(pattern);
      map[pattern] = undefined;
      if (pattern.length === numbers[1].length) map[pattern] = 1;
      if (pattern.length === numbers[4].length) map[pattern] = 4;
      if (pattern.length === numbers[7].length) map[pattern] = 7;
      if (pattern.length === numbers[8].length) map[pattern] = 8;
      return map;
    }, {});
  }

  const countNumbers = (decodedOutputs) => {
    return decodedOutputs.reduce((count, numbers) => {
      return count + numbers.filter((v) => v !== undefined).length;
    }, 0)
  };

  const decodedOutputs = decodeOutputs(array, mapNumbers);
  const count = countNumbers(decodedOutputs);
  console.log(count);
})();


// Part 2
(function () {
  const replacePattern = (from, pattern) => {
    const chars = pattern.split('');
    for (let char of chars) {
      from = from.replace(char, '');
    }
    return from;
  };

  const mapNumbers = (patterns) => {
    // First map the easy ones
    const someKnown = patterns
      .reduce((array, pattern) => {
        pattern = sortString(pattern);
        if (pattern.length === numbers[1].length) array[1] = pattern;
        if (pattern.length === numbers[4].length) array[4] = pattern;
        if (pattern.length === numbers[7].length) array[7] = pattern;
        if (pattern.length === numbers[8].length) array[8] = pattern;
        return array;
      }, Array(10).fill(null));
    // Then use the easy ones to map the hard ones
    const allKnown = patterns
      .reduce((array, pattern) => {
        pattern = sortString(pattern);
        if (pattern.length === numbers[2].length) {
          const p1 = replacePattern(pattern, array[1]).length;
          const p2 = replacePattern(pattern, array[4]).length;
          if (p1 === 4 && p2 === 3) {
            array[2] = pattern;
          }
        }
        if (pattern.length === numbers[3].length) {
          const p1 = replacePattern(pattern, array[1]).length;
          const p2 = replacePattern(pattern, array[4]).length;
          if (p1 === 3 && p2 === 2) {
            array[3] = pattern;
          }
        }
        if (pattern.length === numbers[5].length) {
          const p1 = replacePattern(pattern, array[1]).length;
          const p2 = replacePattern(pattern, array[4]).length;
          if (p1 === 4 && p2 === 2) {
            array[5] = pattern;
          }
        }
        if (pattern.length === numbers[6].length) {
          const p1 = replacePattern(pattern, array[1]).length;
          if (p1 === 5) {
            array[6] = pattern;
          }
        }
        if (pattern.length === numbers[9].length) {
          const p1 = replacePattern(pattern, array[4]).length;
          const p2 = replacePattern(pattern, array[7]).length;
          if (p1 === 2 && p2 === 3) {
            array[9] = pattern;
          }
        }
        if (pattern.length === numbers[0].length) {
          const p1 = replacePattern(pattern, array[4]).length;
          const p2 = replacePattern(pattern, array[7]).length;
          if (p1 === 3 && p2 === 3) {
            array[0] = pattern;
          }
        }
        return array;
      }, someKnown);
      // The make a map out of 'em
      return allKnown.reduce((map, pattern, index) => {
        map[pattern] = index;
        return map;
      }, {});
  }

  const countSumOfOutputs = (decodedOutputs) => {
    return decodedOutputs.reduce((count, output) => {
      return count + parseInt(output.join(''));
    }, 0);
  };

  const decodedOutputs = decodeOutputs(array, mapNumbers);
  const sum = countSumOfOutputs(decodedOutputs);
  console.log(sum);
})();