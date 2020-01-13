/**
 * Checks if at least one value of the object is equal to true
 *
 * @param {object} params
 * @returns {boolean}
 */
export const checkSomeIsTrue = (modalState) => {
    return (Object.values(modalState).some(state => state === true));
};
