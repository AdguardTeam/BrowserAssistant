/**
 * Checks if at least one value of the object is strictly equal to true
 * @param {Object.<string, any>} states
 * @returns {boolean}
 */
export const checkSomeIsTrue = (states) => {
    return Object.values(states)
        .some((state) => state === true);
};
