import { updatePullRewardHistoryInDb, updateNumPullsTodayInDb } from '$lib/services/gachaService.js';
// const tempUserOld = {
//     pullRewardHistory: {
//         prevWeek: {
//             "timestamp": 1623307200,
//             numPulls: 3,
//             isRewardWeek: false,
//         },
//         currWeek: {
//             "timestamp": 1623912000,
//             numPulls: 1,
//             isRewardWeek: true,
//         },
//     },
//     numPullsToday: 1,
// }

// const tempUser = {
//     pullRewardHistory: {
//         lastPullDate: new Date(),
//         consecutiveDaysPulled: 2,
//         rewardDaysRemaining: 7
//     },
//     numPullsToday: 1,
// }

// screw this weekly reward thing, just give double rewards for 7 days if user has rolled 4 days in a row


// called after the first time user pulls in a day
// assume pullRewardHistory exists
export const updatePullRewardHistoryOnPullChange = (user) => {
    const today = new Date();
    // const pullRewardHistory = localStorage.getItem('pullRewardHistory');
    const { pullRewardHistory } = user;
    const { consecutiveDaysPulled, rewardDaysRemaining } = pullRewardHistory;
    const newPullRewardHistory = {
        lastPullDate: today,
        consecutiveDaysPulled: consecutiveDaysPulled + 1,
        rewardDaysRemaining: rewardDaysRemaining
    }
    // localStorage.setItem('pullRewardHistory', newPullRewardHistory);
    updatePullRewardHistoryInDb(user.docId, newPullRewardHistory);
}

// called when user opens the app
// only changing factor here is the date
// pull logic updates is handled elsewhere
export const updatePullRewardHistoryOnDateChange = (user) => {
    const today = new Date();
    const yesterday = today - 1;
    // create new pullRewardHistory if user doesn't have it
    // const pullRewardHistory = localStorage.getItem('pullRewardHistory');
    const { pullRewardHistory } = user;
    if (!pullRewardHistory) {
        const newPullRewardHistory = {
            lastPullDate: today - 7, //otherwise user cannot pull
            consecutiveDaysPulled: 0,
            rewardDaysRemaining: 0
        }
        // localStorage.setItem('pullRewardHistory', newPullRewardHistory);
        updatePullRewardHistoryInDb(user.docId, newPullRewardHistory);
        return;
    }
    // otherwise if pullRewardHistory already exists, check for updates
    const { lastPullDate, rewardDaysRemaining } = pullRewardHistory;

    // check if last pull was yesterday
    if (lastPullDate < yesterday) {
        // consecutive pull chain is broken, so reset consecutiveDaysPulled to 0
        const newPullRewardHistory = {
            // lastPullDate: today,
            consecutiveDaysPulled: 0,
            rewardDaysRemaining: Math.max(rewardDaysRemaining - 1, 0)
        }
        // localStorage.setItem('pullRewardHistory', newPullRewardHistory);
        updatePullRewardHistoryInDb(user.docId, newPullRewardHistory);
    }
    // NOTE: can assume lastPullDate will never be today at this point since this 
    // function is called before updatePullRewardHistoryOnPullChange()
}

export const updateNumPullsToday = (user) => {
    // const numPullsToday = localStorage.getItem('numPullsToday');
    const { numPullsToday } = user;
    if (!numPullsToday) {
        // localStorage.setItem('numPullsToday', 1);
        updateNumPullsTodayInDb(user.docId, 1);
    } else {
        // localStorage.setItem('numPullsToday', numPullsToday + 1);
        updateNumPullsTodayInDb(user.docId, numPullsToday + 1);
    }
}

const isDoublePull = (user) => {
    // const pullRewardHistory = localStorage.getItem('pullRewardHistory');
    const { pullRewardHistory } = user;
    if (!pullRewardHistory) return false;
    const { rewardDaysRemaining } = pullRewardHistory;
    return rewardDaysRemaining > 0;
}

export const numPullsToday = (user) => {
    // const numPullsToday = localStorage.getItem('numPullsToday');
    const { numPullsToday } = user;
    if (!numPullsToday) return 0;
    return numPullsToday;
}

export const maxPullsToday = (user) => {
    if (isDoublePull(user)) return 2;
    return 1;
}