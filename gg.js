const { camelCase, isString } = require("lodash");

/**
 * A class that handles the database for the extension.           
 */
class DB {

    /**
     * Executes a query on the database.       
     * @param {object} options - the options for the query.       
     * @returns {Promise<object>} - the result of the query.       
     */
    static query(options = {}) {
        let statement = DB.buildSelectStatement(options)
        return DB.execute(statement)
    }

    /**
     * Executes the given statement and returns the result.       
     * @param {string} statement - the statement to execute       
     * @returns The result of the statement.       
     */
    static execute(statement) {
        return []
    }


    /**
    * Builds a select statement for the given options.        
    * @param {Object} options - the options to build the statement with.        * @param {Array<string>} [options.columns=['*']] - the columns to select.        
    * @param {string} [options.tableName='notable'] - the table to select from.        
    * @returns {string} the select statement.        
    * @example
    * // in your code:
    * options = {};
    * 
    * // ...
    * let statement = DB.buildSelectStatement(options);
    * // SELECT * FROM notable
    * @example
    * let options = {columns = ['name', {name: 'gender', alias: 'g'}, {name: 'firstName'}]}
    * let statement = DB.buildSelectStatement(options);
    * // SELECT name name, gender g, firstName firstName FROM notable
     */
    static buildSelectStatement(options = {}) {

        let { columns = ['*'], tableName = 'notable' } = options;
        let columnsClause = columns.map(col => {
            const getNameAndAlias = (col) => {
                if (isString(col)) {
                    return { name: col, alias: '' }
                }
                return {
                    ...{ alias: '' },
                    ...col
                }
            }
            let { name, alias } = getNameAndAlias(col)
            return `${name} ${alias}`.trim()
        }).join(', ')

        let joinClause = ` FROM ${tableName}`

        return `SELECT ${columnsClause}${joinClause}`
    }
}

function find(hook) {
    return dispatch('find', arguments);
}

/**
 * Calls the hook function with the given arguments.
 * @param {string} hook - the name of the hook to call.
 * @param {any[]} args - the arguments to pass to the hook.
 * @returns The return value of the hook.
 */
function dispatch(hook, args) {

    // Add the arguments to the params array so you can use params as an array.
    let params = [];
    for (let i = 0; i < args.length; i++) {
        params.push(args[i]);
    }
    let fn;
    if (existsFunction(fn = buildHookFunction(hook, params[0]))) {
        return callMethod(fn, params.slice(1));
    }
    if (existsFunction(fn = buildDefaultHookFunction(hook))) {
        return callMethod(fn, params.slice(1));
    }
    throw new Error(`No hook found for "${hook}"`);
}

/**
 * Builds a function name from the base and hook.       
 * @param {string} base - the base function name.       
 * @param {string} hook - the hook function name.       
 * @returns {string} the function name.       
 */
function buildHookFunction(base, hook) {
    return camelCase(`${base} ${hook}`)
}

/**
 * Builds a hook function for the given hook.           
 * @param {string} hook - the hook to build a function for.           
 * @returns {Function} a function that can be used as a hook.           
 */
function buildDefaultHookFunction(hook) {
    return buildHookFunction('default', hook);
}

/**
 * Checks if a function exists in the global scope.           
 * @param {string} fn - the name of the function to check for.           
 * @returns {boolean} - true if the function exists, false otherwise.           
 */
function existsFunction(fn) {
    return eval(`typeof ${fn} === 'function'`);
}

/**
 * Calls a method with the given arguments.       
 * @param {string} fn - the name of the method to call.       
 * @param {any[]} args - the arguments to pass to the method.       
 * @returns The return value of the method.       
 */
function callMethod(fn, args) {
    args = args.map(e => JSON.stringify(e))
    let e = `${fn}(${args.join(', ')})`;
    return eval(e);
}

function findAll(options = {}) {

    return DB.query(options)
}

let r = find('all', { tableName: 'table', columns: ['name', 'gender'] })


module.exports = {

}