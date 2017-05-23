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
    let rolls = {first: Roll(), second: Roll()};

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
    };

    const getFrameScore = function (indexFrame) {
        return frames[indexFrame] ? frames[indexFrame].getScore() : 0;
    };

    const getFrameFirstRollScore = function (indexFrame) {
        return frames[indexFrame] ? frames[indexFrame].getScoreFirstRoll() : 0;
    };

    const frameScore = function (indexFrame) {
        const index = indexFrame > 0 ? indexFrame - 1 : 0;
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

    const validateFrameScore = function (frame = 1, points = 0) {
        return frameScore(frame) === points;
    };

    const totalScore = function () {
        let currentPoints = 0;
        for (let frame = 1; frame <= MAX_FRAMES; frame++) {
            currentPoints += frameScore(frame);
        }

        return currentPoints;
    };

    const validateScore = function (points = 0) {
        return totalScore() === points;
    };

    return {roll, validateFrameScore, validateScore};
};

test('-------- Bowling: test if we can add 1 point', (assert) => {
    const message = 'The score must be 1';
    const expected = true;

    const bowling = Bowling();

    bowling.roll(1);

    const actual = bowling.validateFrameScore(1, 1);

    assert.equal(actual, expected, message);

    assert.end();
});

test('-------- Bowling: test if we can add 5 points in two rolls', (assert) => {
    const message = 'The score must be 5';
    const expected = true;

    const bowling = Bowling();

    bowling.roll(1);
    bowling.roll(4);

    const actual = bowling.validateFrameScore(1, 5);

    assert.equal(actual, expected, message);

    assert.end();
});

test('-------- Bowling: test if no points were added when we pass negative values', (assert) => {
    const message = 'The score must be 0 when you pass negative values';
    const expected = true;

    const bowling = Bowling();

    bowling.roll(-1);

    const actual = bowling.validateFrameScore(1, 0);

    assert.equal(actual, expected, message);

    assert.end();
});

test('-------- Bowling: test if no points were added when we pass 10+ values', (assert) => {
    const message = 'The score must be 0 when you pass 10+ values';
    const expected = true;

    const bowling = Bowling();

    bowling.roll(11);

    const actual = bowling.validateFrameScore(1, 0);

    assert.equal(actual, expected, message);

    assert.end();
});

// chequear la puntuación en un frame concreto
test('-------- Bowling: test points in a specific frame', (assert) => {
    const message = 'Points must be 5';
    const expected = true;

    const bowling = Bowling();

    bowling.roll(1);
    bowling.roll(4);
    bowling.roll(4);

    const actual = bowling.validateFrameScore(1, 5);

    assert.equal(actual, expected, message);

    assert.end();
});

// chequear la puntuación en un frame concreto
test('-------- Bowling: test points in a specific frame with only a roll in that frame', (assert) => {
    const message = 'Points must be 7';
    const expected = true;

    const bowling = Bowling();

    bowling.roll(1);
    bowling.roll(4);
    bowling.roll(7);

    const actual = bowling.validateFrameScore(2, 7);

    assert.equal(actual, expected, message);

    assert.end();
});

// evitar que entre dos tiradas supere más de 10 bolos en el mismo frame
test('-------- Bowling: testing cannot add more than 10 points in a frame', (assert) => {
    const message = 'Points must be 6';
    const expected = true;

    const bowling = Bowling();

    bowling.roll(2);
    bowling.roll(9);
    bowling.roll(4);

    const actual = bowling.validateFrameScore(1, 6);

    assert.equal(actual, expected, message);

    assert.end();
});

test('-------- Bowling: testing spares', (assert) => {
    const message = 'Points must be 15';
    const expected = true;

    const bowling = Bowling();

    bowling.roll(2);
    bowling.roll(3);
    bowling.roll(0);
    bowling.roll(10);
    bowling.roll(5);

    const actual = bowling.validateFrameScore(2, 15);

    assert.equal(actual, expected, message);

    assert.end();
});

test('-------- Bowling: testing strikes', (assert) => {
    const message = 'Points must be 18';
    const expected = true;

    const bowling = Bowling();

    bowling.roll(2);
    bowling.roll(3);
    bowling.roll(10);
    bowling.roll(5);
    bowling.roll(3);

    const actual = bowling.validateFrameScore(2, 18);

    assert.equal(actual, expected, message);

    assert.end();
});

test('-------- Bowling: testing total score', (assert) => {
    const message = 'Points must be 19';
    const expected = true;

    const bowling = Bowling();

    bowling.roll(2);
    bowling.roll(3);
    bowling.roll(10);
    bowling.roll(2);

    const actual = bowling.validateScore(19);

    assert.equal(actual, expected, message);

    assert.end();
});
