const getRarityStar = (dups) => {
	/*
	1: 1 total copies
	2: 1+2=3 total copies
	3: 1+2+3=6 total copies
	4: 1+2+3+4=10 total copies
	5: 1+2+3+4+5=15 total copies
	*/
	const COPIES = dups + 1;
	if (COPIES < 3) {
		return 1;
	} else if (COPIES < 6) {
		return 2;
	} else if (COPIES < 10) {
		return 3;
	} else if (COPIES < 15) {
		return 4;
	} else if (COPIES >= 15) {
		return 5;
	}
};

const getRarityName = (dups) => {
	const STAR = getRarityStar(dups);
	switch (STAR) {
		case 1:
			return 'common';
			break;
		case 2:
			return 'uncommon';
			break;
		case 3:
			return 'rare';
			break;
		case 4:
			return 'epic';
			break;
		case 5:
			return 'legendary';
			break;
		default:
			return 'unknown';
			break;
	}
};

const getRarityProgress = (dups) => {
	let star = getRarityStar(dups);
	if (star === 1) return dups;
	if (star === 5) return 0;
	return dups - summation(2, star);
};

const summation = (i, j) => {
	if (i > j) throw new Error('i must be <= j');
	let sum = 0;
	for (; i <= j; i++) {
		sum += i;
	}
	return sum;
};

export { getRarityName, getRarityStar, getRarityProgress };
