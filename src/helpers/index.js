/**
 * Checks if at least one value of the object is equal to true
 *
 * @param {object} params
 * @returns {boolean}
 */
export const checkSomeIsTrue = (modalState) => {
    return (Object.values(modalState).some((state) => state === true));
};

export const deepCloneObject = (obj) => {
    let clonedObj;

    try {
        clonedObj = JSON.parse(JSON.stringify(obj));
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
    }
    return clonedObj;
};
