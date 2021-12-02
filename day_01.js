const fs = require('fs');
const path = require('path');


const input = fs.readFileSync(path.resolve(__dirname, 'day_01.txt'), 'utf8');
const array = input.split('\n').map(v => parseInt(v));

// Part 1
(function() {
    const countTheNumberOfTimesADepthMeasurementIncreases = (data) => {
        return data.reduce((count, current, index, array) => {
            if (index === 0) return count;
            const previous = array[index - 1];
            return count + (current > previous ? 1 : 0);
        }, 0);
    };

    const result = countTheNumberOfTimesADepthMeasurementIncreases(array);

    console.log(result);
})();

// Part 2
(function() {
    const sliceAndSum = (array, index, count = 3) => {
        return array
            .slice(index, index + count)
            .reduce((count, current) => {
                return count + current;
            }, 0)
    };

    const countTheNumberOfTimesTheSumOfMeasurementsInThisSlidingWindowIncreases = (data) => {
        return data.reduce((count, current, index, array) => {
            const currentWindowSum = sliceAndSum(array, index);
            const nextWindowSum = sliceAndSum(array, index + 1);
            return count + (nextWindowSum > currentWindowSum ? 1 : 0);
        }, 0);
    };

    const result = countTheNumberOfTimesTheSumOfMeasurementsInThisSlidingWindowIncreases(array);

    console.log(result);
})();