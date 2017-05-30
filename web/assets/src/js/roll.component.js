const Roll = function (pinsKnocked) {
    const MAX_PINS = 10;

    const isAllowed = function (pins) {
        return pins <= MAX_PINS && pins >= 0;
    };

    const pins = isAllowed(pinsKnocked) ? pinsKnocked : null;
    const allPinsInOneShot = pins === MAX_PINS;

    return {pins, allPinsInOneShot};
};

export default Roll;
