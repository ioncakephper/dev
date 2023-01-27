

/**
 * @module DesignByContract
 */

const { isBoolean, isObject, isArray } = require("lodash");


/**
 * Takes in a value and a callback function.       
 * If the callback function returns true, the value is returned.       
 * If the callback function returns false, an error is thrown.       
 * @param {any} v - the value to guarantee       
 * @param {function} callback - the callback function  
 * @throws Will throw an error indicating guarantees are not met.      
 * @returns {any} the value that was passed in  
 * @example
 * //
 * // inside the function, specify result guarantees.
 * //
 * function changeCase(items = []) {
 *     let result = items.map(item => item.toUpperCase());
 *     // return result
 *     return guarantees(result, (r) => {
 *          // it guarantees the result is an array and every item is uppercase
 *          return isArray(r)
 *                 && r.every(item =>  item === item.toUpperCase());
 *     })
 * }     
 */
function guarantees(v, callback) {
    if (typeof callback === 'function') {
        let result = callback(v);
        if (isBoolean(result) && (result === true)) {
            return v
        }
        throw new Error('Guarantees unmet: ' + JSON.stringify(v))
    }
    return v
}

/**
 * Takes in an object of expectations and checks them against the actual values.           
 * @param {Object} expectations - the object of expectations           
 * @returns {boolean} - true if all expectations are met, false otherwise
 * @throws Will throw an error listing failed expectations.   
 * @example
 * // define expectations as an object and pass it to the expects function
 * function sendMessage(message, options) {
 *      expects({
 *          message: isString(message) && !isEmpty(message.trim()),
 *          options: isObject(options)
 *      })
 * }
 * // each time you invoke sendMessage, its parameters are being checked against the expectations.
 * // here is an example where the expections are not met:
 * sendMessage('', []) // throws an exception indicating expectations for message and options are not met.
 */
function expects(expectations = {}) {
    let failedExpectations = []
    let results =  Object.keys(expectations).every(expectationName => {
        let v = expectations[expectationName]
        let r = isBoolean(v) && (v === true);
        if (r === false) {
            failedExpectations.push(`Expectation not met: "${expectationName}"`)
        }
        return r;
    })
    if (!results) {
        throw new Error(failedExpectations.join(', '))
    }
    return results;
}

/**
 * Checks if the target object has all the keys in the keysToHave array.       
 * @param {object} target - the object to check for the keys in the keysToHave array       
 * @param {array} keysToHave - the array of keys to check for in the target object      
 * @returns {boolean} - true if the target object has all the keys in the keysToHave array, false otherwise   
 */
function hasAllKeys(target = {}, keysToHave = []) {
    expects({
        target: isObject(target),
        keysToHave: isArray(keysToHave)
    })
    let targetKeys = Object.keys(target)
    let result = keysToHave.every(k => targetKeys.includes(k))
    return guarantees(result, (r) => {
        return isBoolean(r)
    })
}

/**
 * Checks if the target object has some of the keys in the keysToHave array.           
 * @param {object} target - the object to check for the keys           
 * @param {array} keysToHave - the keys that the target object should have           
 * @returns {boolean} - whether or not the target object has some of the keys in the keysToHave array.           
 */
function hasSomeKeys(target = {}, keysToHave = []) {
    expects({
        target: isObject(target),
        keysToHave: isArray(keysToHave)
    })
    let targetKeys = Object.keys(target)
    let result = keysToHave.some(k => targetKeys.includes(k))
    return guarantees(result, (r) => {
        return isBoolean(r)
    })
}

module.exports = {
    expects,
    guarantees,
    hasAllKeys,
    hasSomeKeys,
}
