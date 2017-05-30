const Score = function () {
    let strikes = [];
    let spares = [];
    let totalScore = 0;
    let accumulatedFrameScore = [];
    let pinsPerRoll = [];

    return {strikes, spares, totalScore, accumulatedFrameScore, pinsPerRoll};
};

export default Score;
