const getRarity = (dups) => {
	if (dups === 0) {
		return 'common';
	} else if (dups === 2) {
		return 'uncommon';
	} else if (dups === 5) {
		return 'rare';
	} else if (dups === 9) {
		return 'epic';
	} else if (dups === 14) {
		return 'legendary';
	} else {
		return 'unknown';
	}
};

export { getRarity };
