const path = require('path')
const hbsr = require('hbsr');

class DB {
    query(options = {}) {
        let selectStatement = this.buildSelectStatement(options)
        return this.execute(selectStatement)
    }

    insert(options = {}) {
        let insertStatement = this.buildInsertStatement(options);
        return this.execute(insertStatement)
    }

    execute(statement) {

    }

    buildSelectStatement(options = {}) {
        options = {
            ...{tables: ['noentities']}
        }
        let joinClause = options.tables[0]
        return `SELECT * FROM [${joinClause}]`
    }

    buildInsertStatement(options = {}) {
        let joinClause = options['table'];
        let colNamesList = Object.keys(options.record).join(', ');
        let valuesList = Object.values(options.record).map(value => `"${value}"`).join(', ')
        return `INSERT INTO [${joinClause}] (${colNamesList}) VALUES (${valuesList})`
    }
}

class Entity {

    constructor(tableName) {
        this.tableName = tableName;
        this.db = new DB();
    }

    findRange(offset = 0, count = Number.MAX_SAFE_INTEGER, options = {}) {
        options = {
            ...options,
            ...{
                limit: [offset, count]
            }
        }
        return this.findAll(options)
    }

    findAll(options = {}) {
        return this.db.query(options)
    }

    insert(values = {}) {
        let options = {
            ...{
                table: this.tableName,
            },
            ...{record: values}
        }
        return this.db.insert(options)
    }
}

class Controller {
    constructor(entity) {
        this[entity.constructor.name] = entity;
    }

    view(actionName) {
        return actionName;
    }
}

class Router {

    render(route) {

        let {controllerName, actionName, actionPath, query} = this.parseRoute(route)
        let controller = this.loadController(controllerName);
        let data = controller[actionName]();
        if (!data) {
            return
        }

        let viewFilename = controller.view(actionName);
        let templatePath = './' + path.join('app','views', controllerName);

        let output = hbsr.render_template(viewFilename, data, {
            template_path: templatePath,
        })
    }

    loadController(controllerName) {

        let controllerClassFilename = './' + path.join('controllers', `${controllerName}-controller.js`);

        const controllerClass = require(controllerClassFilename);
        let properControllerName = controllerName.substr(0, 1).toUpperCase() + controllerName.substr(1)
        return new controllerClass[`${properControllerName}Controller`]
    }

    parseRoute(route) {
        let [controllerName, actionName, trailing] = route.split('/');
        let [actionPath, query] = (trailing) ? trailing.split('?') : [];

        return {
            controllerName, actionName, actionPath, query
        }
    }
}

module.exports = {
    Entity,
    Controller,
    Router,
    DB,
}