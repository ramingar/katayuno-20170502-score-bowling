import Roll from './roll.component';

const Frame = function () {
    const rolls = {first: Roll(), second: Roll()};

    const roll = function (pins) {

        if (willFrameExceedMaxPins(pins)) {
            return false;
        }

        setPins(pins);

        if (isStrike()) {
            setPins(0);  // we need two rolls in each frame in spite of doing a strike in the frame's first roll
        }
    };

    const setPins = function (pins) {
        if (isFull()) {
            return false;
        }

        if (rolls.first.pins === null) {
            rolls.first = Roll(pins);
        } else {
            rolls.second = Roll(pins);
        }
    };

    const isStrike = function () {
        return rolls.first.allPinsInOneShot;
    };

    const isSpare = function () {
        const sumRolls = Roll(getScore());
        return !isStrike() && sumRolls.allPinsInOneShot;
    };

    // in a frame, the two rolls can't score more than 10 pins
    const willFrameExceedMaxPins = function (pins) {
        const composeRoll = Roll(rolls.first.pins + pins);
        return composeRoll.pins === null;
    };

    const isFull = function () {
        return rolls.first.pins !== null && rolls.second.pins !== null;
    };

    const getScore = function () {
        return rolls.first.pins + rolls.second.pins;
    };

    const getScoreFirstRoll = function () {
        return rolls.first.pins;
    };

    return {roll, isStrike, isSpare, isFull, getScoreFirstRoll, getScore};
};

export default Frame;
