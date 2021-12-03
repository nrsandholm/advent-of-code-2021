const fs = require('fs');
const path = require('path'); 

const input = fs.readFileSync(path.resolve(__dirname, 'day_03.txt'), 'utf8');
const array = input.split('\n').map(str => str.split('').map(v => parseInt(v)));

const parseRate = (array) => {
	return parseInt(array.join(''), 2);
};

// Part 1
(function() {
	const findMostCommonBits = (array) => {
		const result = array.reduce((stats, binArray) => {
			return binArray.reduce((stats_, bit, index) => {
				stats_[index] += bit;
				return stats_; 
			}, stats || Array(binArray.length).fill(0));
		}, null);
		const half = Math.floor(array.length / 2);
		return result.map(v => v > half ? 1 : 0);
	};

	const calcGammaRate = (mostCommonBitArray) => {
		return parseRate(mostCommonBitArray);
	};

	const calcEpsilonRate = (mostCommonBitArray) => {
		const leastCommonBitArray = mostCommonBitArray.map(x => 1 - x);
		return parseRate(leastCommonBitArray);
	};

	const mostCommonBitArray = findMostCommonBits(array);
	const gammaRate = calcGammaRate(mostCommonBitArray);
	const epsilonRate = calcEpsilonRate(mostCommonBitArray);
	const powerConsumption = gammaRate * epsilonRate;
	console.log(powerConsumption);
})();

// Part 2
(function() {
	const countOnesAtIndex = (array, index) => {
		return array.reduce((count, binArray) => {
			return count + binArray[index];
		}, 0);
	};

	const findMostCommonBitAtIndex = (array, index) => {
		const onesCount = countOnesAtIndex(array, index);
		const half = array.length / 2;
		// If half, prefeŕ ones
		if (onesCount === half) return 1;
		return onesCount > half ? 1 : 0;
	};

	const findLeastCommonBitAtIndex = (array, index) => {
		const onesCount = countOnesAtIndex(array, index);
		const half = array.length / 2;
		// If half, prefeŕ zeroes
		if (onesCount === half) return 0;
		return onesCount < half ? 1 : 0;
	};

	const filterByValueAtIndex = (array, index, findFilterBy) => {
		const filterByValue = findFilterBy(array, index);
		let result = array.filter(binArray => binArray[index] === filterByValue);
		return result.length > 1 ? filterByValueAtIndex(result, index + 1, findFilterBy) : result; 
	}

	const findOxygenGeneratorRatingRow = (array) => {
		const result = filterByValueAtIndex(array, 0, findMostCommonBitAtIndex);
		if (result.length !== 1) throw new Error('WTF');
		return result[0];
	};

	const findCO2ScrubberRatingRow = (array) => {
		const result = filterByValueAtIndex(array, 0, findLeastCommonBitAtIndex);
		if (result.length !== 1) throw new Error('WTF');
		return result[0];
	};

	const oxygenRow = findOxygenGeneratorRatingRow(array);
	const scrubberRow = findCO2ScrubberRatingRow(array);
	const oxygenGeneratorRating = parseRate(oxygenRow);
	const scrubberRating = parseRate(scrubberRow);
	const lifeSupportRating = oxygenGeneratorRating * scrubberRating;
	console.log(lifeSupportRating);
}());
