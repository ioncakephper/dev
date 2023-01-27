/**
 * @module EntityManagement
 */

const { isString, isUndefined, isNumber, isEmpty, isObject, isArray } = require("lodash");
const { execute } = require("./db");
const { guarantees, expects, hasAllKeys } = require("./dbc");
const {  buildLimitClause,
    buildWhereClause,
    buildOrderbyClause,
    buildEntitySelectStatement, buildEntityInsertStatement, buildUpdateEntityStatement,
    buildGroupbyClause,  } = require('./entity-management-helper')


/**
 * Get the top records for the given entity.       
 * @param {string} entityName - the name of the entity to get records for.       
 * @param {number} [top=10] - the number of records to get.       
 * @param {object} [options={}] - the options to pass to the getRangeEntityRecords function.       
 * @returns {Promise<Array<EntityRecord>>} - the top records for the given entity.       
 */
function getTopEntityRecords(entityName, top = 10, options = {}) {
    return getRangeEntityRecords(entityName, 0, 10, options)
}

/**
 * Get the bottom records of an entity.       
 * @param {string} entityName - the name of the entity to get records for.       
 * @param {number} [bottom=10] - the number of records to get.       
 * @param {object} [options={}] - the options to pass to the getRangeEntityRecords function.       
 * @returns {object} - the records of the entity.       
 */
function getBottomEntityRecords(entityName, bottom = 10, options = {}) {
    let recordCount = getCountEntityRecords(entityName, options);
    return getRangeEntityRecords(entityName, Math.max(0, recordCount - bottom), recordCount, options)
}

/**
 * Get the number of records in the given entity.       
 * @param {string} entityName - the name of the entity to get the count for.       
 * @param {object} [options] - the options to use when getting the count.       
 * @param {array} [options.conditions] - the conditions to use when getting the count.       
 * @param {array} [options.columns] - the columns to use when getting the count.       
 * @returns {number} the number of records in the given entity.       
 */
function getCountEntityRecords(entityName, options = {}) {
    expects({
        entityName: isString(entityName) && !isEmpty(entityName.trim()),
        options: isObject(options)
    })
    let rc = getFirstEntityRecord(entityName, {
        conditions: options.conditions || [],
        columns: [
            'COUNT(*) COUNT'
        ]
    })['COUNT']
    return guarantees(rc, (r) => {
        return isNumber(r) && (r >= 0) && (r <= Number.MAX_VALUE)
    })
}

/**
 * Get the first entity record for the given entity name.           
 * @param {string} entityName - the name of the entity to get the record for.           
 * @param {object} [options={}] - the options to pass to getSingleEntityRecord.           
 * @returns {object} the first entity record for the given entity name.           
 */
function getFirstEntityRecord(entityName, options = {}) {
    expects({
        entityName: isString(entityName) && !isEmpty(entityName.trim()),
        options: isObject(options)
    })
    return getSingleEntityRecord(entityName, 0, options);
}

/**
 * Gets a single entity record from the current page.       
 * @param {string} entityName - the name of the entity to get       
 * @param {number} [offset=0] - the offset to start getting records from       
 * @param {object} [options={}] - the options to pass to the getRangeEntityRecords function       
 * @returns {object} the entity record       
 */
function getSingleEntityRecord(entityName, offset = 0, options = {}) {
    expects({
        entityName: isString(entityName) && !isEmpty(entityName.trim()),
        options: isObject(options),
        offset: isNumber(offset) && (offset <= Number.MAX_VALUE),
    })
    return getRangeEntityRecords(entityName, offset, 1, options)[0];
}

/**
 * Get a range of records from the given entity.       
 * @param {string} entityName - the name of the entity to get records from       
 * @param {number} [offset=0] - the offset to start getting records from       
 * @param {number} [count=100] - the number of records to get       
 * @param {object} [options={}] - the options to pass to the API       
 * @returns {Promise<Array<object>>} - a promise that resolves to an array of records       
 */
function getRangeEntityRecords(entityName, offset = 0, count = 100, options = {}) {
    expects({
        entityName: isString(entityName) && !isEmpty(entityName.trim()),
        options: isObject(options),
        offset: isNumber(offset) && (offset <= Number.MAX_VALUE),
        count: isNumber(count) && (count <= Number.MAX_VALUE)
    })
    options = {
        ...options,
        ...{ limit: [offset, count] }
    }
    return getAllEntityRecords(entityName, options)
}

/**
 * Get all records of the given entity.       
 * @param {string} entityName - the name of the entity to get records of.       
 * @param {Object} [options={}] - the options to pass to the query.       
 * @returns {Promise<Array<Object>>} - the records of the entity.       
 */
function getAllEntityRecords(entityName, options = {}) {
    expects({
        entityName: isString(entityName) && !isEmpty(entityName.trim()),
        options: isObject(options),
    })

    let stmt = buildEntitySelectStatement(entityName, options);
    return execute(stmt)
}




/**
 * Get the first record of the given entity with the given id.       
 * @param {string} entityName - the name of the entity to get the record from.       
 * @param {string} id - the id of the record to get.       
 * @returns {EntityRecord} - the first record of the given entity with the given id.       
 */
function getEntityRecordById(entityName, id) {
    expects({
        entityName: isString(entityName) && !isEmpty(entityName.trim()),
        id: (isString(id) && !isEmpty(id.trim()))
            || (isNumber(id))
    })
    let options = {
        conditions: [
            [`${entityName}id`, '=', `"${id}"`]
        ]
    }
    if (getCountEntityRecords(entityName, options) > 1) {
        throw new Error('Multiple records found, single record expected')
    }
    return getFirstEntityRecord(entityName, options);
}

/**
 * Get all attributes for a given entity.       
 * @param {string} entityName - the name of the entity to get attributes for.       
 * @returns {Array<Attribute>} - an array of attributes for the given entity.       
 */
function getAttributes(entityName) {
    expects({
        entityName: isString(entityName) && !isEmpty(entityName.trim())
    })
    return getAllEntityRecords('attributes', {
        columns: ['name', 'type', 'default', 'extra', 'entityName', 'label'],
        conditions: [
            ['entityName', '=', `"${entityName.trim()}"`]
        ]
    })
}

/**
 * Gets the primary key name for the given entity.           
 * @param {string} entityName - the name of the entity.           
 * @returns {string} the name of the primary key.           
 */
function getPrimaryKeyName(entityName) {
    expects({
        entityName: isString(entityName) && !isEmpty(entityName.trim())
    })
    let attributes = getAttributes(entityName).filter(attr => (attr.type === 'Pk' || attr.name.endsWith('Id')))
    if (attributes.length > 0) {
        return attributes[0]["name"]
    }
}


/**
 * Inserts a new entity into the database.       
 * @param {string} entityName - the name of the entity to insert into.       
 * @param {object} values - the values to insert into the entity.       
 * @param {string[]} conditions - the conditions to apply to the insert.       
 * @returns {Promise<void>} - a promise that resolves when the insert is complete.       
 */
function insertEntityRecord(entityName, values = {}, conditions = []) {
    expects({
        entityName: isString(entityName) && !isEmpty(entityName.trim())
    })
    let pkName = getPrimaryKeyName(entityName);
    if (!Object.keys(values).includes(pkName)) {
        values[pkName] = nextEntityPkValue(entityName)
    }

    let insertStatement = buildEntityInsertStatement(entityName, values, conditions);

    // return execute(insertStatement)
    execute(insertStatement)

    // Add conditions for the query, if any, and then run the query.
    Object.keys(values).forEach(colName => {
        conditions.push([`'${colName}'`, '=', `"${values[colName]}"`]);
    })

    // Get the first entity record that matches the conditions, and return the primary key value.
    return getFirstEntityRecord(entityName, {
        columns: [pkName],
        conditions: conditions
    })[pkName]
}

/**
 * Gets the next value for the given entity.       
 * @param {string} entityName - the name of the entity to get the next value for.       
 * @returns {number} the next value for the given entity.       
 */
function nextEntityPkValue(entityName) {
    expects({
        entityName: isString(entityName) && !isEmpty(entityName.trim())
    })
    let options = {
        columns: ['nextPkValueid', 'lastValue', 'increment', 'entityName'],
        conditions: [
            ['entityName', '=', `"${entityName.trim()}"`],
        ]
    }

    // If there is no record for given entityName, insert a default lastValue records
    if (!existsEntity(entityName)) {
        let rpk = insertEntityRecord('nextPkValue', {
            entityName: entityName.trim(),
            lastValue: -5,
            increment: 5,
        })
        if (isUndefined(rpk)) {
            throw new Error('Could not insert record in nextPkValue')
        }
    }

    // Multiple records, single record expected
    let rc = getCountEntityRecords('nextPkValue', options);
    if (rc > 1) {
        throw new Error('Multiple records, single record expected')
    }

    // Get the next PK value for the entity, and increment it afterwards.
    let record = getFirstEntityRecord('nextPkValue', options);
    let { lastValue, increment, nextPkValueid } = record;
    record['lastValue'] = lastValue + increment;
    updateEntityRecord('nextPkValue', { ...record, ...{ nextPkValueid: nextPkValueid } }, [
        [
            'nextPkValueid', '=', `"${nextPkValueid}"`
        ]
    ])

    return record['lastValue']
}


/**
 * Updates the given entity with the given values. 
 * 
 * Filters out columns in specified values that do not exist in specified entity.      
 * @param {string} entityName - the name of the entity to update.       
 * @param {object} values - the values to update the entity with.       
 * @param {object} [conditions] - the conditions to update the entity with.       
 * @returns None       
 */
function updateEntityRecord(entityName, values = {}, conditions = []) {

    let updateStatement = buildUpdateEntityStatement(entityName, values, { conditions: conditions })
    execute(updateStatement)
}


/**
 * Updates an entity record in the database.  
 * 
 * Filters out columns in specified values that do not exist in specified entity.      
 * @param {string} entityName - the name of the entity to update    
 * @param {string|number} id - the primary key value of record to update   
 * @param {object} values - the values to update the entity with       
 * @param {array} conditions - the conditions to update the entity with       
 * @returns None       
 */
function updateEntityRecordById(entityName, id, values = {}, conditions = []) {
    let rc = getCountEntityRecords(entityName, {
        conditions: [
            [getPrimaryKeyName(entityName), '=', `"${id}"`]
        ]
    })
    if (rc > 1) throw new Error('Multiple records exists, a single record expected: ' + `${entityName}: ${id}`)
    if (rc === 0) throw new Error('No record found: ' + `${entityName}: ${id}`)

    return updateEntityRecord(entityName, values, [
        ...conditions,
        ...[getPrimaryKeyName(entityName), '=', `"${id}"`]
    ])

}


/**
 * Checks if an entity exists in the database.       
 * @param {string} entityName - the name of the entity to check for.       
 * @returns {boolean} - true if the entity exists, false otherwise.  
 * @example
 * // check if entity exists given a complete name
 * if (existsEntity('applications')) {
 *    ...
 * }   
 * @example
 * // check if there are any entities whose names starts with 'app'
 * if (existsEntity('app%')) {
 *    ...
 * }
 */
function existsEntity(entityName) {
    expects({
        entityName: isString(entityName) && !isEmpty(entityName.trim())
    })
    return getAllEntityNames([
        ['entityName', 'like', `"${entityName.trim()}"`]
    ])
}

/**
 * Get all the entity names that match the given conditions.       
 * @param {Array<Condition>} conditions - The conditions to match against.       
 * @returns {Array<string>} - An array of all the entity names that match the conditions.       
 */
function getAllEntityNames(conditions = []) {
    expects({
        conditions: isArray(conditions) && conditions.every(condition => {
            return expects({
                condition: isArray(condition) && (condition.length === 3) && condition.every(item => {
                    return expects({
                        item: isString(item) && !isEmpty(item.trim())
                    })
                })
            })
        })
    })
    let result = getAllEntities(conditions).map(entity => entity.name)
    return guarantees(result, (r) => {
        return isArray(r)
            && ((r.length === 0)
                || r.every(item => isString(item) && !isEmpty(item.trim()))
            )
    })
}

/**
 * Get all entities that match the given conditions.       
 * @param {Array<Object>} conditions - An array of conditions to match against.       
 * @returns An array of entities that match the conditions.       
 */
function getAllEntities(conditions = []) {
    return getAllEntityRecords('entities', {
        conditions: conditions
    }) || []
}

module.exports = {
    getAllEntityRecords,
    getBottomEntityRecords,
    getCountEntityRecords,
    getRangeEntityRecords,
    getFirstEntityRecord,
    getSingleEntityRecord,
    getTopEntityRecords,
    getEntityRecordById,
    getAttributes,
    getPrimaryKeyName,
    getAllEntityNames,
    getAllEntities,
    insertEntityRecord,
    // buildClauses,
    // buildEntitySelectStatement,
    // buildEntityInsertStatement,
    // buildUpdateEntityStatement,
    existsEntity,
    nextEntityPkValue,
    updateEntityRecord,
    updateEntityRecordById,
}
