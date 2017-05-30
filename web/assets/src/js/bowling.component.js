import Frame from './frame.component';
import Score from './score.component';

/*
 0    1    2   3   4   5     6 ... <- frame
 -  0 1  2 3 4 5 6 7 8 9 10 11 ... <- rolls
 -  1 4 10 0 2 5 3 3 4 1  3  4 ... <- pins
 */

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

    const getScore = function (score = Score()) {

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

export default Bowling;
