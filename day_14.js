const fs = require('fs');
const path = require('path');
const stream = require("stream");

const input = fs.readFileSync(path.resolve(__dirname, 'day_14.test.txt'), 'utf8');
const { template, rules } = input
  .split('\n')
  .reduce((result, row, index) => {
    if (index === 0) {
      result.template = row;
    }
    else if(row.length) {
      const [group, value] = row.split(' -> ');
      result.rules[group] = value;
    }
    return result;
  }, {
    template: null,
    rules: {}
  });

const countCharOccurances = (template) => {
  const chars = template.split('');
  return chars.reduce((groups, char) => {
    groups[char] = (groups[char] || 0) + 1;
    return groups;
  }, {});
};

const findCharWithLeastOccurances = (chars) => {
  return Object
    .keys(chars)
    .reduce((min, char) => {
      if (!min) return char;
      return chars[char] < chars[min] ? char : min;
    }, null);
};

const findCharWithMostOccurances = (chars) => {
  return Object
    .keys(chars)
    .reduce((max, char) => {
      if (!max) return char;
      return chars[char] > chars[max] ? char : max;
    }, null);
};

// Part 1
(function () {
  const applyRules = (template, rules) => {
    const newTemplate = [];
    for (let i = 0; i < template.length - 1; i++) {
      const pair = template[i] + template[i + 1];
      const value = rules[pair];
      if (i === 0) newTemplate.push(template[i]);
      newTemplate.push(value);
      newTemplate.push(template[i + 1]);
    }
    return newTemplate;
  };

  const applyRulesXTimes = (template, rules, count) => {
    template = template.split('');
    for (let i = 0; i < count; i++) {
      template = applyRules(template, rules);
    }
    return template.join('');
  };

  const templateAfterRules = applyRulesXTimes(template, rules, 10);
  const chars = countCharOccurances(templateAfterRules);
  const charWithLeast = findCharWithLeastOccurances(chars);
  const charWithMost = findCharWithMostOccurances(chars);
  console.log(charWithLeast, charWithMost);
  console.log(chars[charWithMost] - chars[charWithLeast]);
})();

// Part 2
(function () {
  const applyRules = (iteration, readable, rules) => {
    const writable = fs.createWriteStream(`template.${iteration + 1}.txt`);
    let data;
    if (! readable.read) {
        writable.write(readable);
        writable.write(iteration + '');
    } else {
      while (data = readable.read()) {
        // TODO Here!
        writable.write(data);
        writable.write(iteration + '');
      }
    }
    /*
    for (let i = 0; i < template.length - 1; i++) {
      const [first, second] = template.substring(i, i + 2).split('');
      const value = rules[first + second];
      if (i === 0) newTemplate += first;
      newTemplate += value;
      newTemplate += second;
    }
    */
    writable.end();
  };

  const applyRulesXTimes = (template, rules, count) => {
    for (let i = 0; i < count; i++) {
      if (i === 0) {
        applyRules(i, template, rules);
        continue;
      }
      const readable = fs.createReadStream(`template.${i}.txt`);
      readable.on('readable', function() {
        applyRules(i, readable, rules);
      });
    }
  };

  const templateAfterRules = applyRulesXTimes(template, rules, 40);
  /*
  const chars = countCharOccurances(templateAfterRules);
  const charWithLeast = findCharWithLeastOccurances(chars);
  const charWithMost = findCharWithMostOccurances(chars);
  console.log(charWithLeast, charWithMost);
  console.log(chars[charWithMost] - chars[charWithLeast]);
  */
})();