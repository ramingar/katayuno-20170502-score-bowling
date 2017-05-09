import test from 'tape';

// Component to test
const Bowling = function () {
    let rolls = [];

    const roll = function (pins) {
        if (pins > 10 || pins < 0) {
            return false;
        }

        const length = rolls.length;

        if (0 !== length % 2) {  // second roll in a frame
            if (rolls[length - 1] + pins > 10) {
                return false;
            }
        }

        rolls.push(pins);

        if ((0 === length % 2) && (10 === pins)) {  // strike
            rolls.push(0);  // two rolls in the frame in spite of doing a strike in the frame's first roll
        }
    };

    const score = function (frame = 1) {
        const index = (frame - 1) * 2;

        let frameScore = (rolls[index] ? rolls[index] : 0) + (rolls[index + 1] ? rolls[index + 1] : 0);

        if (10 === rolls[index]) {  // strike
            frameScore += (rolls[index + 2] ? rolls[index + 2] : 0) + (rolls[index + 3] ? rolls[index + 3] : 0);
        } else {
            if (10 === frameScore) {  // spare
                frameScore += rolls[index + 2] ? rolls[index + 2] : 0;
            }
        }

        return frameScore;
    };

    const totalScore = function () {
        const MAX_FRAMES = 10;
        let points = 0;
        for (let ii = 1; ii <= MAX_FRAMES; ii++) {
            points += score(ii);
        }

        return points;
    };

    return {roll, score, totalScore};
};

test('-------- Bowling: test if we can add 1 point', (assert) => {
    const message = 'The score must be 1';
    const expected = 1;

    const bowling = Bowling();

    bowling.roll(1);

    const actual = bowling.score();

    assert.equal(actual, expected, message);

    assert.end();
});

test('-------- Bowling: test if we can add 5 points in two rolls', (assert) => {
    const message = 'The score must be 5';
    const expected = 5;

    const bowling = Bowling();

    bowling.roll(1);
    bowling.roll(4);

    const actual = bowling.score();

    assert.equal(actual, expected, message);

    assert.end();
});

test('-------- Bowling: test if no points were added when we pass negative values', (assert) => {
    const message = 'The score must be 0 when you pass negative values';
    const expected = 0;

    const bowling = Bowling();

    bowling.roll(-1);

    const actual = bowling.score();

    assert.equal(actual, expected, message);

    assert.end();
});

test('-------- Bowling: test if no points were added when we pass 10+ values', (assert) => {
    const message = 'The score must be 0 when you pass 10+ values';
    const expected = 0;

    const bowling = Bowling();

    bowling.roll(11);

    const actual = bowling.score();

    assert.equal(actual, expected, message);

    assert.end();
});

// chequear la puntuación en un frame concreto
test('-------- Bowling: test points in a specific frame', (assert) => {
    const message = 'Points must be 5';
    const expected = 5;

    const bowling = Bowling();

    bowling.roll(1);
    bowling.roll(4);
    bowling.roll(4);

    const actual = bowling.score(1);

    assert.equal(actual, expected, message);

    assert.end();
});

// chequear la puntuación en un frame concreto
test('-------- Bowling: test points in a specific frame with only a roll in that frame', (assert) => {
    const message = 'Points must be 7';
    const expected = 7;

    const bowling = Bowling();

    bowling.roll(1);
    bowling.roll(4);
    bowling.roll(7);

    const actual = bowling.score(2);

    assert.equal(actual, expected, message);

    assert.end();
});

// evitar que entre dos tiradas supere más de 10 bolos en el mismo frame
test('-------- Bowling: test cannot add more 10 points in a frame', (assert) => {
    const message = 'Points must be 6';
    const expected = 6;

    const bowling = Bowling();

    bowling.roll(2);
    bowling.roll(9);
    bowling.roll(4);

    const actual = bowling.score(1);

    assert.equal(actual, expected, message);

    assert.end();
});

// spare
test('-------- Bowling: testing spares', (assert) => {
    const message = 'Points must be 15';
    const expected = 15;

    const bowling = Bowling();

    bowling.roll(2);
    bowling.roll(3);
    bowling.roll(0);
    bowling.roll(10);
    bowling.roll(5);

    const actual = bowling.score(2);

    assert.equal(actual, expected, message);

    assert.end();
});

// strikes
test('-------- Bowling: testing strikes', (assert) => {
    const message = 'Points must be 18';
    const expected = 18;

    const bowling = Bowling();

    bowling.roll(2);
    bowling.roll(3);
    bowling.roll(10);
    bowling.roll(5);
    bowling.roll(3);

    const actual = bowling.score(2);

    assert.equal(actual, expected, message);

    assert.end();
});

test('-------- Bowling: testing total score', (assert) => {
    const message = 'Points must be 19';
    const expected = 19;

    const bowling = Bowling();

    bowling.roll(2);
    bowling.roll(3);
    bowling.roll(10);
    bowling.roll(2);

    const actual = bowling.totalScore();

    assert.equal(actual, expected, message);

    assert.end();
});
