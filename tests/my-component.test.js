import test from 'tape';

// Component to test
/*
 0    1    2   3   4   5     6 ... <- frame
 -  0 1  2 3 4 5 6 7 8 9 10 11 ... <- rolls
 -  1 4 10 0 2 5 3 3 4 1  3  4 ... <- pins
 */
const Bowling = function () {
    let rolls = [];

    const roll = function (pins) {
        const rollNumber = rolls.length;
        const currentFrame = getFrame(rollNumber);

        if (pins > 10 || pins < 0) {
            return false;
        }

        if ((firstRollInFrame(currentFrame) + 1) === rollNumber) {
            if (rolls[rollNumber - 1] + pins > 10) {  // in a frame, the two rolls can't score more than 10 pins
                return false;
            }
        }

        rolls.push(pins);

        if (isStrike(currentFrame)) {
            rolls.push(0);  // we need two rolls in each frame in spite of doing a strike in the frame's first roll
        }
    };

    const getFrame = function (roll) {
        return (parseInt(roll / 2)) + 1;
    };

    const scoreForRoll = function (roll) {
        return rolls[roll] ? rolls[roll] : 0;
    };

    const firstRollInFrame = function (frame) {
        return (frame - 1) * 2;
    };

    const isStrike = function (frame) {
        const index = firstRollInFrame(frame);
        return 10 === rolls[index];
    };

    const isSpare = function (frame) {
        const index = firstRollInFrame(frame);
        return !isStrike(frame) && 10 === rolls[index] + rolls[index + 1];
    };

    const frameScore = function (frame = 1) {
        const index = firstRollInFrame(frame);

        let result = scoreForRoll(index) + scoreForRoll(index + 1);

        if (isStrike(frame)) {
            result += scoreForRoll(index + 2) + scoreForRoll(index + 3);
        }

        if (isSpare(frame)) {
            result += scoreForRoll(index + 2);
        }

        return result;
    };

    const validateFrameScore = function (frame = 1, points = 0) {
        return frameScore(frame) === points;
    };

    const totalScore = function () {
        const MAX_FRAMES = 10;
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
