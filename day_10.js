const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, 'day_10.txt'), 'utf8');
const array = input.split('\n');

const replaceCorrect = (string) => {
  return string
    .replace(/\(\)/g, '')
    .replace(/\[\]/g, '')
    .replace(/\{\}/g, '')
    .replace(/\<\>/g, '');
};

const replaceAllCorrect = (string) => {
  while (true) {
    const out = replaceCorrect(string);
    if (out === string) {
      break;
    }
    string = out;
  }
  return string;
};

const replaceOpeningTags = (string) => {
  return string
    .replace(/\(/g, '')
    .replace(/\[/g, '')
    .replace(/\{/g, '')
    .replace(/\</g, '');
};

const getFirstIncorrectClosingTag = (string) => {
  return replaceOpeningTags(string).charAt(0);
};

// Part 1
(function () {
  const getFirstIncorrectClosingTagPerLine = (array) => {
    return array
      .map(replaceAllCorrect)
      .reduce((chars, line) => {
        const char = getFirstIncorrectClosingTag(line);
        if (char) chars.push(char);
        return chars;
      }, []);
  };

  const calcPoints = (chars) => {
    return chars.reduce((points, char) => {
      if (char === ')') return points + 3;
      if (char === ']') return points + 57;
      if (char === '}') return points + 1197;
      if (char === '>') return points + 25137;
      return points;
    }, 0)
  };

  const chars = getFirstIncorrectClosingTagPerLine(array);
  const points = calcPoints(chars);
  console.log(points);
})();

// Part 2
(function () {
  const filterIncompleteLines = (array) => {
    return array
      .map(replaceAllCorrect)
      .filter(line => getFirstIncorrectClosingTag(line) === '')
  };

  const generateClosingTagsPerLine = (lines) => {
    return lines.map(generateClosingTags);
  }

  const generateClosingTags = (line) => {
    const closingTags = [];
    for (let char of line.split('')) {
      if (char === '(') closingTags.push(')');
      if (char === '[') closingTags.push(']');
      if (char === '{') closingTags.push('}');
      if (char === '<') closingTags.push('>');
    }
    return closingTags.reverse();
  };

  const getPointsForTag = (tag) => {
    if (tag === ')') return 1;
    if (tag === ']') return 2;
    if (tag === '}') return 3;
    if (tag === '>') return 4;
  };

  const calcPointsFromClosingTags = (tags) => {
    return tags.reduce((points, tag) => {
      return points * 5 + getPointsForTag(tag);
    }, 0);
  };

  const calcPoints = (tags) => {
    return tags.map(calcPointsFromClosingTags);
  };

  const sortPoints = (points) => {
    return points.sort((a, b) => {
      if (a > b) return 1;
      if (a < b) return -1;
      return 0;
    });
  };

  const getPointsInMiddle = (points) => {
    return points[Math.ceil(points.length / 2) - 1];
  };

  const incomplete = filterIncompleteLines(array);
  const tags = generateClosingTagsPerLine(incomplete);
  const points = sortPoints(calcPoints(tags));
  const winner = getPointsInMiddle(points);
  console.log(winner);
})();