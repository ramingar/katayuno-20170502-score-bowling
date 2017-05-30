import test from 'tape';

/*
 0    1    2   3   4   5     6 ... <- frame
 -  0 1  2 3 4 5 6 7 8 9 10 11 ... <- rolls
 -  1 4 10 0 2 5 3 3 4 1  3  4 ... <- pins
 */

const Roll = function (pinsKnocked) {
    const MAX_PINS = 10;

    const isAllowed = function (pins) {
        return pins <= MAX_PINS && pins >= 0;
    };

    const pins = isAllowed(pinsKnocked) ? pinsKnocked : null;
    const allPinsInOneShot = pins === MAX_PINS;

    return {pins, allPinsInOneShot};
};

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

const Score = function () {
    let strikes = [];
    let spares = [];
    let totalScore = 0;
    let accumulatedFrameScore = [];
    let pinsPerRoll = [];

    return {strikes, spares, totalScore, accumulatedFrameScore, pinsPerRoll};
};

// Component to test
const Bowling = function () {
    const MAX_FRAMES = 10;
    let frames = [Frame()];

    const roll = function (pins) {

        if (frames[frames.length - 1].isFull()) {
            frames.push(Frame());
        }

        const currentFrame = frames[frames.length - 1];
        currentFrame.roll(pins);

        return null;
    };

    const getFrameScore = function (indexFrame) {
        return frames[indexFrame] ? frames[indexFrame].getScore() : 0;
    };

    const getFrameFirstRollScore = function (indexFrame) {
        return frames[indexFrame] ? frames[indexFrame].getScoreFirstRoll() : 0;
    };

    const frameScore = function (indexFrame) {
        const index = adjustFrame(indexFrame);
        const frame = frames[index];

        let result = getFrameScore(index);

        if (frame && frame.isStrike()) {
            result += getFrameScore(index + 1);
        }

        if (frame && frame.isSpare()) {
            result += getFrameFirstRollScore(index + 1);
        }

        return result;
    };

    const totalScore = function () {
        let currentPoints = 0;
        for (let frame = 1; frame <= MAX_FRAMES; frame++) {
            currentPoints += frameScore(frame);
        }

        return currentPoints;
    };

    // our frames' array begins with index = 0; but user thinks first frame is number 1
    const adjustFrame = function (indexFrame) {
        return indexFrame > 0 ? indexFrame - 1 : 0;
    };

    const getScore = function (score) {

        score.totalScore = totalScore();

        score.strikes = frames.reduce((acc, value) => {
            acc.push(value.isStrike());
            return acc;
        }, []);

        score.spares = frames.reduce((acc, value) => {
            acc.push(value.isSpare());
            return acc;
        }, []);

        const pinsPerFrame = frames.reduce((acc, value, index) => {
            acc.push(frameScore(index + 1));
            return acc;
        }, []);

        score.accumulatedFrameScore = pinsPerFrame.reduce((acc, val, index, array) => {
            acc.push(array.slice(0, array.length - index).reduce((acc, val) => acc + val, 0));
            return acc;
        }, []).reverse();

        score.pinsPerRoll = frames.reduce((acc, value) => {
            const firstRoll = value.getScoreFirstRoll();
            acc.push(firstRoll ? firstRoll : 0);

            if (value.isFull()) {
                acc.push(value.getScore() - value.getScoreFirstRoll());
            }
            return acc;
        }, []);

        return null;
    };

    return {roll, getScore};
};

//***********************************************************//
//*********************** TESTS *****************************//
//***********************************************************//

test('-------- Bowling: test if we can add 1 point', (assert) => {
    const message = 'The score must be 1';
    const expected = Score();
    expected.totalScore = 1;
    expected.strikes = [false];
    expected.spares = [false];
    expected.accumulatedFrameScore = [1];
    expected.pinsPerRoll = [1];

    const bowling = Bowling();

    bowling.roll(1);

    const actual = Score();
    bowling.getScore(actual);

    assert.deepEqual(actual, expected, message);

    assert.end();
});

test('-------- Bowling: test if we can add two rolls', (assert) => {
    const message = 'pinsPerRoll must be 1 and 4';
    const expected = Score();
    expected.totalScore = 5;
    expected.strikes = [false];
    expected.spares = [false];
    expected.accumulatedFrameScore = [5];
    expected.pinsPerRoll = [1, 4];

    const bowling = Bowling();

    bowling.roll(1);
    bowling.roll(4);

    const actual = Score();
    bowling.getScore(actual);

    assert.deepEqual(actual, expected, message);

    assert.end();
});

test('-------- Bowling: test if no points were added when we pass negative values', (assert) => {
    const message = 'The score must be 0 when you pass negative values';
    const expected = Score();
    expected.totalScore = 0;
    expected.strikes = [false];
    expected.spares = [false];
    expected.accumulatedFrameScore = [0];
    expected.pinsPerRoll = [0];

    const bowling = Bowling();

    bowling.roll(-1);

    const actual = Score();
    bowling.getScore(actual);

    assert.deepEqual(actual, expected, message);

    assert.end();
});

test('-------- Bowling: test if no points were added when we pass a value of 10+ pins', (assert) => {
    const message = 'The score must be 0 when you pass 10+ values';
    const expected = Score();
    expected.totalScore = 0;
    expected.strikes = [false];
    expected.spares = [false];
    expected.accumulatedFrameScore = [0];
    expected.pinsPerRoll = [0];

    const bowling = Bowling();

    bowling.roll(11);

    const actual = Score();
    bowling.getScore(actual);

    assert.deepEqual(actual, expected, message);

    assert.end();
});

test('-------- Bowling: testing cannot add more than 10 points in a frame', (assert) => {
    const message = '9 must be ignored because 2+9=11 and there aren\'t 11 pins';
    const expected = Score();
    expected.totalScore = 6;
    expected.strikes = [false];
    expected.spares = [false];
    expected.accumulatedFrameScore = [6];
    expected.pinsPerRoll = [2, 4];

    const bowling = Bowling();

    bowling.roll(2);
    bowling.roll(9);
    bowling.roll(4);

    const actual = Score();
    bowling.getScore(actual);

    assert.deepEqual(actual, expected, message);

    assert.end();
});

test('-------- Bowling: testing spares', (assert) => {
    const message = 'Frame 2 must be a spare';
    const expected = Score();
    expected.totalScore = 25;
    expected.strikes = [false, false, false];
    expected.spares = [false, true, false];
    expected.accumulatedFrameScore = [5, 20, 25];
    expected.pinsPerRoll = [2, 3, 0, 10, 5];

    const bowling = Bowling();

    bowling.roll(2);
    bowling.roll(3);
    bowling.roll(0);
    bowling.roll(10);
    bowling.roll(5);

    const actual = Score();
    bowling.getScore(actual);

    assert.deepEqual(actual, expected, message);

    assert.end();
});

test('-------- Bowling: testing strikes', (assert) => {
    const message = 'Frame number 2 must be a strike';
    const expected = Score();
    expected.totalScore = 31;
    expected.strikes = [false, true, false];
    expected.spares = [false, false, false];
    expected.accumulatedFrameScore = [5, 23, 31];
    expected.pinsPerRoll = [2, 3, 10, 0, 5, 3];

    const bowling = Bowling();

    bowling.roll(2);
    bowling.roll(3);
    bowling.roll(10);
    bowling.roll(5);
    bowling.roll(3);

    const actual = Score();
    bowling.getScore(actual);

    assert.deepEqual(actual, expected, message);

    assert.end();
});

test('-------- Bowling: testing total score', (assert) => {
    const message = 'Total score must be 19';
    const expected = Score();
    expected.totalScore = 19;
    expected.strikes = [false, true, false];
    expected.spares = [false, false, false];
    expected.accumulatedFrameScore = [5, 17, 19];
    expected.pinsPerRoll = [2, 3, 10, 0, 2];

    const bowling = Bowling();

    bowling.roll(2);
    bowling.roll(3);
    bowling.roll(10);
    bowling.roll(2);

    const actual = Score();
    bowling.getScore(actual);

    assert.deepEqual(actual, expected, message);

    assert.end();
});
