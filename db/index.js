const format = require('format')
const { isString, isObject, isEmpty, isNumber, isArray } = require('lodash')
const { FindOperators } = require('mongodb')

/**
 * @typedef {object} FieldDescriptor - the name and optional alias of a table or column.
 * @property {string} name - the name of table or column.
 * @property {string} [alias=''] - the alias of table of column.
 */

/**
 * @typedef {object} QueryDescriptor - the SQL select options.
 * @property {string|FieldDescriptor} table -the table name and an optional alias.
 * @property {Array<string|FieldDescriptor>} [columns=['*']] - the list of table columns to retrieve.
 * @property {Array<number>} [limit=[]] - the offset and number of records to retrieve.
 */

/**
 * A class that handles the database.
 */
class DB {

    /**
     * A function that takes in a query object and returns a promise that resolves to an array of objects.
     * @param {QueryDescriptor} options - The query object.
     * @returns {Promise<object[]>} A promise that resolves to an array of objects.
     */
    static query(options = {}) {
        let statement = DB.buildSelectStatement(options)
        return DB.execute(statement)
    }

    /**
     * Builds a select statement for the database.
     * @param {QueryDescriptor} options - the options to build the select statement with.
     * @returns {string} the select statement.
     */
    static buildSelectStatement(options = {}) {
        let {
            columnsClause,
            joinClause,
            limitClause,
            whereClause,
        } = DB.buildSelectClauses(options)
        return format("SELECT %s %s %s", columnsClause, joinClause, whereClause, limitClause).trim()
    }

    /**
     * Builds the select clauses for the SQL query.
     * @param {QueryDescriptor} options - the options to build the select clause with.
     * @returns {string} the select clause.
     */
    static buildSelectClauses(options = {}) {
        let {limit = []} = options;
        let isLimitValid = isArray(limit) && (isEmpty(limit) || limit.every(v => isNumber(v)))
        if (!isLimitValid) {
            throw new Error("Limit is invalid: it is not an array nor its values are numbers.")
        }
        return {
            columnsClause: DB.buildSelectColumnsClause(options),
            joinClause: DB.buildSelectJoinClause(options),
            limitClause: DB.buildSelectLimitClause(options),
            whereClause: DB.buildSelectWhereClause(options),
        }
    }

    /**
     * @typedef {array} Condition - describe elements of a boolean condition
     */

    /**
     * @typedef {Array<Condition>} ConditionGroup - group of conditions connected with a boolean connector.

     */

    static buildSelectWhereClause(options = {}) {
        let {conditions = []} = options;
        // return format("WHERE ( %s )", factors.join(' AND '))
        return format("WHERE ( %s )", '1')
    }

    /**
     * Builds a LIMIT clause for a SELECT statement.
     * @param {QueryDescriptor} options - the options object.
     * @param {number} [options.offset] - the offset to start at.
     * @param {number} [options.count] - the number of results to return.
     * @returns {string} the LIMIT clause.
     */
    static buildSelectLimitClause(options = {}) {
        let {limit} = options;
        if (!limit) {
            return ''
        }
        let [offset, count] = limit;
        if (!offset) {
            return ''
        }
        return format("LIMIT %s%s", offset, (count) ? `, ${count}` : '')
    }

    /**
     * Builds a SELECT clause for the given table.
     * @param {QueryDescriptor} [options={}] - the options object.
     * @param {string} [options.table] - the table to build the SELECT clause for.
     * @returns {string} the SELECT clause for the given table.
     * @throws Table description has no name.
     * @throws Table not specified.
     */
    static buildSelectJoinClause(options = {}) {
        let {table = ''} = options;
        let isTableValid = (isString(table) && !isEmpty(table.trim()))
           || (
            isObject(table) && (Object.keys(table).includes("name"))
           )
        if (!isTableValid) {
            throw new Error("Table not specified.")
        }
        if (isString(table)) {
            let [name, alias] = table.split(/\s+/)
            table = {name, alias}
        }
        let {name, alias = ''} = table;
        let isNameCorrect = isString(name) && !isEmpty(name.trim())
        if (!isNameCorrect) {
            throw new Error('Table description has no name')
        }
        return format("FROM %s %s", name.trim(), alias.trim()).trim();
    }

    /**
     * Builds a select columns clause for a SQL query.
     * @param {QueryDescriptor} options - the options object.
     * @param {Array<string|FieldDescriptor>} [options.columns=['*']] - the columns to select.
     * @returns {string} the select columns clause.
     */
    static buildSelectColumnsClause(options = {}) {
        let {columns = ['*']} = options;
        return columns.map(col => {
            if (isString(col)) {
                let [name, alias] = col.trim().split(/\s+/)
                col = {name, alias}
            }
            let {name, alias = ''} = col;
            let isNameCorrect = isString(name) && !isEmpty(name.trim())
            if (!isNameCorrect) {
                throw new Error('Attribute description has no name')
            }
            return format("%s %s", name.trim(), alias.trim()).trim()
        }).join(', ')
    }

    /**
     * Executes the given SQL statement and returns the result.
     * @param {string} statement - the SQL statement to execute
     * @returns {object} - the result of the SQL statement
     */
    static execute(statement) {
        return {records: [{colName: 'string'}], fields: ['string']}
    }
}

module.exports = {
    DB
}