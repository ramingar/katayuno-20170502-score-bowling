import test from 'tape';

// Component to test
const Bowling = function () {
    let rolls = 0;
    let points = 0;
    let frames = 0;

    const roll = function (pins) {
        if (pins > 10 || pins < 0) {
            return false;
        }

        rolls++;

        if (0 === rolls % 2) {
            addFrame();
        }

        points += pins;
    };

    const addFrame = function () {
        frames++;
    };

    const frame = function () {
        return frames;
    };

    const score = function () {
        return points;
    };

    return {roll, score, frame};
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

test('-------- Bowling: test frame counter', (assert) => {
    const message = 'Frame is the number 1';
    const expected = 1;

    const bowling = Bowling();

    bowling.roll(1);
    bowling.roll(4);

    const actual = bowling.frame();

    assert.equal(actual, expected, message);

    assert.end();
});

/*
test('-------- Bowling: test spare', (assert) => {
    const message = 'The score must be 34';
    const expected = 34;

    const bowling = Bowling();

    bowling.roll(1);
    bowling.roll(4);
    bowling.roll(4);
    bowling.roll(5);
    bowling.roll(6);
    bowling.roll(4);
    bowling.roll(5);

    const actual = bowling.score();

    assert.equal(actual, expected, message);

    assert.end();
});
*/
