const {expects, hasAllKeys} = require('./dbc')
const {isObject, isUndefined} = require('lodash')
const {getAttributes} = require('./entity-management')

/**
 * @module EntityManagementHelper
 */

/**
 * Builds the clauses for a SQL query.       
 * @param {object} options - the options object.       
 * @returns {object} the clauses for the SQL query.       
 */
 function buildClauses(options = {}) {
    expects({
        options: isObject(options)
            && hasAllKeys(options, ['entity'])
            && isObject(options['entity'])
            && hasAllKeys(options['entity'], ['name'])
    })
    return {
        'columnsClause': (options.entity.attributesList || ['*']).join(', '),
        'whereClause': buildWhereClause(options),
        'joinClause': options.entity.name.trim(),
        'limitClause': buildLimitClause(options),
        'orderbyClause': buildOrderbyClause(options),
        'groupbyClause': buildGroupbyClause(options),
    }
}

/**
 * Builds a SQL ORDER BY clause from an array of strings.       
 * @param {Array<string>} options.orderby - An array of strings to use as the ORDER BY clause.       
 * @returns {string} A SQL ORDER BY clause.   
 * @example
 * // the order by clause generated: ORDER BY name, color
 * let options = {
 *    ...,
 *    orderby: ['name', 'color']
 * }
 * let records = getAllEntityRecords('applications', options)
 * 
 * @example
 * // specify ordering direction for each column
 * // the order by clause generated: ORDER BY name, color desc
 * let options = {
 *    ...,
 *    orderby: ['name', 'color desc'],
 * }   
 */
function buildOrderbyClause(options = {}) {
    options = {
        ...{ orderby: [] },
        ...options,
    }
    let { orderby } = options;
    if (orderby.length === 0) {
        return ''
    }
    return ` ORDER BY ${orderby.join(', ')}`
}

/**
 * Takes in an options object and returns a string that can be used to groupby.       
 * @param {object} options - the options object.       
 * @param {string[]} [options.groupby=[]] - the array of columns to groupby.       
 * @returns {string} the string to groupby.       
 */
function buildGroupbyClause(options = {}) {
    options = {
        ...{ groupby: [] },
        ...options
    }

    let { groupby } = options;
    if (groupby.length === 0) {
        return ''
    }
    return ` GROUP BY ${groupby.join(', ')}`
}

/**
 * Builds a LIMIT clause for a SQL query.       
 * @param {object} options - the options object.       
 * @param {number[]} [options.limit] - the limit clause.       
 * @returns {string} the LIMIT clause.       
 */
function buildLimitClause(options = {}) {
    options = {
        ...{
            limit: []
        },
        ...options
    }

    let [offset, count] = options.limit;

    // nothing specified, return empty string
    if (isUndefined(offset)) {
        return ``
    }
    if (isUndefined(count)) {
        return ` LIMIT ${offset}`
    }

    return ` LIMIT ${offset}, ${count}`
}

/**
 * Builds a WHERE clause for the given options.       
 * @param {object} options - the options to build the WHERE clause with       
 * @param {object} [options.where] - the options to build the WHERE clause with       
 * @param {string} [options.where.type] - the type of condition to use for the WHERE clause       
 * @param {array} [options.where.conditionsList] - the list of conditions to use for the WHERE clause       
 * @returns {string} the WHERE clause to use in the query       
 */
function buildWhereClause(options = {}) {
    expects({
        options: isObject(options)
    })
    options = {
        ...{
            where: {
                type: ' and ',
                conditionsList: options.conditions || [],
            }
        },
    }

    let { where } = options

    let conditionSegments = where.conditionsList.map(condition => {
        let [left, oper, right] = condition;
        return ` (${left} ${oper} ${right}) `;
    })
    return (conditionSegments.length === 0)
        ? ''
        : ` WHERE ( ${conditionSegments.join(where.type)} )`
}


/**
 * Builds a select statement for the given entity.           
 * @param {string} entityName - the name of the entity to select from           
 * @param {object} [options={}] - the options for the select statement           
 * @param {string} [options.columns=['*']] - the columns to select           
 * @param {string} [options.joinClause] - the join clause to use           
 * @param {string} [options.whereClause] - the where clause to use           
 * @param {string} [options.limitClause] - the limit clause to use           
 * @returns {string} the select statement
 */
 function buildEntitySelectStatement(entityName, options = {}) {
    options = {
        ...options,
        ...{
            entity: {
                name: entityName,
                attributesList: options.columns || ['*']
            }
        }
    }
    let {
        columnsClause,
        joinClause,
        whereClause,
        limitClause,
        orderbyClause,
        groupbyClause,
    } = buildClauses(options)

    return `SELECT ${columnsClause} FROM ${joinClause} ${whereClause}${orderbyClause}${groupbyClause} ${limitClause}`
}


/**
 * Builds a SQL statement to update an entity.
 * 
 * Will update only those columns in the specified values that exist in the entity.    
 * @param {string} entityName - the name of the entity to update       
 * @param {object} [values={}] - the values to update the entity with       
 * @param {array} [conditions=[]] - the conditions to update the entity with       
 * @returns {string} the SQL statement to update the entity       
 */
 function buildUpdateEntityStatement(entityName, values = {}, conditions = []) {

    let options = {
        entity: {
            name: entityName
        },
        where: {
            type: ' AND ',
            conditionsList: conditions,
        }
    }

    let { joinClause, whereClause } = buildClauses(options);

    let validAttributeNames = getAttributes(entityName).map(attr => attr['name']);

    let validValues = {};
    let validColnames = Object.keys(values).filter(colName => validAttributeNames.includes(colName));
    validColnames.forEach(colName => {
        validValues[colName] = values[colName];
    })
    let colValuePair = Object.keys(validValues).map(colName => {
        return `${colName}="${validValues[colName]}"`
    })

    return `UPDATE ${joinClause} SET ${colValuePair.join(',')}${whereClause}`
}

/**
 * Builds an INSERT statement for the given entity and values.       
 * @param {string} entityName - the name of the entity to insert into.       
 * @param {Object} [values={}] - the values to insert into the entity.       
 * @param {Array} [conditions=[]] - the conditions to apply to the insert.       
 * @returns {string} the INSERT statement.       
 */
 function buildEntityInsertStatement(entityName, values = {}, conditions = []) {
    let options = {
        entity: {
            name: entityName
        },
        conditions: conditions,
    }
    // The join clause for the query, which is used to get the group's ID
    let {
        joinClause,
        whereClause,
    } = buildClauses(options)
    // Check if the column name is valid and if it is, add it to the validValues object.
    let validAttributeNames = getAttributes(entityName).map(attr => attr.name);
    // Check if the column name is valid and if it is, add it to the validValues object.
    let validValues = {};
    let validColnames = Object.keys(values).filter(colName => validAttributeNames.includes(colName));
    validColnames.forEach(colName => {
        validValues[colName] = values[colName]
    })
    // Create the SQL query for inserting the data into the database.
    let columnsClause = Object.keys(validValues);
    let valuesClause = Object.values(validValues).map(v => `"${v}"`);
    return `INSERT INTO ${joinClause} (${columnsClause}) VALUES (${valuesClause})${whereClause}`
}

module.exports = {
    buildClauses,
    buildEntitySelectStatement,
    buildEntityInsertStatement,
    buildUpdateEntityStatement,
    buildLimitClause,
    buildWhereClause,
    buildOrderbyClause,
    buildGroupbyClause,
}