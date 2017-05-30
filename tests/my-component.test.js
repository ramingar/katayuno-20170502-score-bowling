import test from 'tape';
import Bowling from '../web/assets/src/js/bowling.component';
import Score from '../web/assets/src/js/score.component';

// RESTRICTIONS:
// 1- Tests must not use primitive values to compare results
// 2- `Bowling` public methods must always return `null`

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

test('-------- Bowling: testing max 10 frames', (assert) => {
    const message = 'Total number of frames must be 10';
    const expected = Score();
    expected.totalScore = 88;
    expected.strikes = [false, true, false, false, false, false, false, false, false, false];
    expected.spares = [false, false, false, true, true, true, false, false, false, false];
    expected.accumulatedFrameScore = [5, 18, 21, 31, 50, 62, 66, 70, 79, 88];
    expected.pinsPerRoll = [2, 3, 10, 0, 2, 1, 1, 9, 0, 10, 9, 1, 2, 2, 2, 2, 9, 0, 7, 2];

    const bowling = Bowling();

    bowling.roll(2);
    bowling.roll(3);
    bowling.roll(10);
    bowling.roll(2);
    bowling.roll(1);
    bowling.roll(1);
    bowling.roll(9);
    bowling.roll(0);
    bowling.roll(10);
    bowling.roll(9);
    bowling.roll(1);
    bowling.roll(2);
    bowling.roll(2);
    bowling.roll(2);
    bowling.roll(2);
    bowling.roll(9);
    bowling.roll(0);
    bowling.roll(7);
    bowling.roll(2);  // 2nd roll of 10th frame
    bowling.roll(3);
    bowling.roll(2);
    bowling.roll(7);

    const actual = Score();
    bowling.getScore(actual);

    assert.deepEqual(actual, expected, message);

    assert.end();
});

test('-------- Bowling: testing max 10 frames (spare in last frame)', (assert) => {
    const message = 'Total number of rolls must be 21';
    const expected = Score();
    expected.totalScore = 92;
    expected.strikes = [false, true, false, false, false, false, false, false, false, false];
    expected.spares = [false, false, false, true, true, true, false, false, false, true];
    expected.accumulatedFrameScore = [5, 18, 21, 31, 50, 62, 66, 70, 79, 92];
    expected.pinsPerRoll = [2, 3, 10, 0, 2, 1, 1, 9, 0, 10, 9, 1, 2, 2, 2, 2, 9, 0, 7, 3, 3];

    const bowling = Bowling();

    bowling.roll(2);
    bowling.roll(3);
    bowling.roll(10);
    bowling.roll(2);
    bowling.roll(1);
    bowling.roll(1);
    bowling.roll(9);
    bowling.roll(0);
    bowling.roll(10);
    bowling.roll(9);
    bowling.roll(1);
    bowling.roll(2);
    bowling.roll(2);
    bowling.roll(2);
    bowling.roll(2);
    bowling.roll(9);
    bowling.roll(0);
    bowling.roll(7);
    bowling.roll(3);  // 2nd roll of 10th frame
    bowling.roll(3);
    bowling.roll(2);
    bowling.roll(7);

    const actual = Score();
    bowling.getScore(actual);

    assert.deepEqual(actual, expected, message);

    assert.end();
});

test('-------- Bowling: testing max 10 frames (strike in last frame)', (assert) => {
    const message = 'Total number of rolls must be 21';
    const expected = Score();
    expected.totalScore = 92;
    expected.strikes = [false, true, false, false, false, false, false, false, false, true];
    expected.spares = [false, false, false, true, true, true, false, false, false, false];
    expected.accumulatedFrameScore = [5, 18, 21, 31, 50, 62, 66, 70, 79, 92];
    expected.pinsPerRoll = [2, 3, 10, 0, 2, 1, 1, 9, 0, 10, 9, 1, 2, 2, 2, 2, 9, 0, 10, 0, 3];

    const bowling = Bowling();

    bowling.roll(2);
    bowling.roll(3);
    bowling.roll(10);
    bowling.roll(2);
    bowling.roll(1);
    bowling.roll(1);
    bowling.roll(9);
    bowling.roll(0);
    bowling.roll(10);
    bowling.roll(9);
    bowling.roll(1);
    bowling.roll(2);
    bowling.roll(2);
    bowling.roll(2);
    bowling.roll(2);
    bowling.roll(9);
    bowling.roll(0);
    bowling.roll(10);  // 1st roll of 10th frame
    bowling.roll(3);
    bowling.roll(2);
    bowling.roll(7);

    const actual = Score();
    bowling.getScore(actual);

    assert.deepEqual(actual, expected, message);

    assert.end();
});
