const fs = require('fs');
const path = require('path');


const input = fs.readFileSync(path.resolve(__dirname, 'day_02.txt'), 'utf8');
const array = input.split('\n');

// Part 1
(function() {
    const submarineInitial = {
        position: 0,
        depth: 0
    };

    const move = (submarine, data) => {
        return data.reduce((sub, actionValue) => {
            const [action, value] = actionValue.split(' ');
            if (action === 'forward') {
                sub.position += parseInt(value);
            } else if (action === 'up') {
                sub.depth -= parseInt(value);
            } else if (action === 'down') {
                sub.depth += parseInt(value);
            } else {
                throw new Error(`Unknown action '${action}'`);
            }
            return sub;
        }, submarine);
    };

    const submarineNew = move(submarineInitial, array);

    console.log(submarineNew);
    console.log(submarineNew.position * submarineNew.depth);
})();

// Part 2
(function() {
    const submarineInitial = {
        position: 0,
        depth: 0,
        aim: 0
    };

    const move = (submarine, data) => {
        return data.reduce((sub, actionValue) => {
            const [action, value] = actionValue.split(' ');
            if (action === 'forward') {
                sub.position += parseInt(value);
                sub.depth += (parseInt(value) * sub.aim);
            } else if (action === 'up') {
                sub.aim -= parseInt(value);
            } else if (action === 'down') {
                sub.aim += parseInt(value);
            } else {
                throw new Error(`Unknown action '${action}'`);
            }
            return sub;
        }, submarine);
    };

    const submarineNew = move(submarineInitial, array);

    console.log(submarineNew);
    console.log(submarineNew.position * submarineNew.depth);
})();