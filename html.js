/**
 * @module BasicHtmlTag
 */

const { isEmpty, isArray, isString, isObject } = require("lodash")
const { expects } = require("./dbc")
const path = require('path');

/**
 * Creates a tag with the given tagName and content.       
 * @param {string} tagName - the name of the tag to create.       
 * @param {string | Array<string>} content - the content of the tag.       
 * @param {Object} options - the options for the tag.       
 * @returns {string} the tag.       
 */
function tag(tagName, content = '', options = {}) {
    if (isEmpty(content)) {
        return shortTag(tagName, options)
    }
    if (isArray(content)) {
        return tag(tagName, content.join(''), options)
    }
    return `${tagStart(tagName, options)}>${content}</${tagName}>`
}

/**
 * Creates a short tag with the given tag name and options.       
 * @param {string} tagName - the name of the tag to create       
 * @param {object} [options={}] - the options to pass to the tag       
 * @returns {string} the short tag       
 */
function shortTag(tagName, options = {}) {
    return `${tagStart(tagName, options)} />`
}

/**
 * Returns the start of a tag with the given tag name and attributes.       
 * @param {string} tagName - the name of the tag.       
 * @param {object} [options={}] - the attributes of the tag.       
 * @returns {string} the start of the tag.       
 */
function tagStart(tagName, options = {}) {
    return `<${tagName} ${tagAttributes(options)}`.trim()
}

/**
 * Takes in an object of attributes and returns a string of attributes.           
 * @param {object} options - the object of attributes to format.           
 * @returns {string} - the string of attributes.           
 */
function tagAttributes(options = {}) {
    let parts = Object.keys(options).map(attr => {
        let value = options[attr];
        return `${attr}="${value}"`
    })
    return parts.join(' ')
}

/**
 * Creates a table element.       
 * @param {string} thead - the table header       
 * @param {string} tbody - the table body       
 * @param {object} options - the options for the table       
 * @returns {string} the table element       
 */
function table(thead = '', tbody = '', options = {}) {
    return tag('table', [thead, tbody], options)
}

/**
 * Creates a tbody element.       
 * @param {string} content - the content of the tbody element.       
 * @param {object} options - the options for the tbody element.       
 * @returns {string} the tbody element.       
 */
function tbody(content = '', options = {}) {
    return tag('tbody', content, options)
}

/**
 * Creates a table header element.       
 * @param {string} content - the content of the table header element.       
 * @param {object} options - the options for the table header element.       
 * @returns {string} the table header element.       
 */
function thead(content = '', options = {}) {
    return tag('thead', content, options)
}

/**
 * Creates a table row element.       
 * @param {string} content - the content to put in the table row.       
 * @param {object} options - the options to pass to the tag function.       
 * @returns {string} the table row element.       
 */
function tr(content = '', options = {}) {
    return tag('tr', content, options)
}

/**
 * Creates a table header element.       
 * @param {string} content - the content of the table header element.       
 * @param {object} options - the options for the table header element.       
 * @returns {string} the table header element.       
 */
function th(content = '', options = {}) {
    return tag('th', content, options)
}

/**
 * Creates a table data element.       
 * @param {string} content - the content of the table data element.       
 * @param {object} options - the options for the table data element.       
 * @returns {string} the table data element.       
 */
function td(content = '', options = {}) {
    return tag('td', content, options)
}

/**
 * Creates a block of HTML with a title and a list of items.           
 * @param {string} title - the title of the block.           
 * @param {string[]} items - the items to put in the block.           
 * @param {object} [options={}] - the options for the block.           
 * @param {string} [options.h2] - the options for the h2 tag.           
 * @param {string} [options.div] - the options for the div tag.           
 * @returns {string} the HTML string for the block.           
 */
function block(title, items = [], options = {}) {
    return tag('div',
        [
            tag('h2', title, options['h2']),
            tag('ol', items.map(item => tag('li', item)))
        ],
        options['div']
    )
}

/**
 * Creates an anchor tag with the given title and url.       
 * @param {string} title - the title of the anchor tag.       
 * @param {string | Array.<string> | Object} url - the url of the anchor tag.       
 * @param {object} [options={}] - the options of the anchor tag.       
 * @returns {string} the anchor tag.       
 */
function alink(title, target, options = {}) {
    expects({
        title: isString(title),
        url: isString(target),
        options: isObject(options),
    })
    return tag('a', title, {...options, ...{href: url(target)}})
}

/**
 * Returns the URL of the current page.           
 * @param {string | string[] | object} context - The context to use when generating the URL.           
 * @returns {string} The URL of the current page.           
 */
function url(context) {
    if (isArray(context)) {
        let [controller, action, params] = context;

        let queryString;
        if (isObject(params)) {
            queryString = Object.keys(params).map(k => {
                return `${k}=${params[k]}`
            }).join('&')
        }
        if (isArray(params)) {
            queryString = params.join('&')
        }
        if (isString(params)) {
            queryString = params;
        }
        if (!isEmpty(queryString)) {
            queryString = `?${queryString}`
        }
        return path.join(controller || '', action || '', queryString || '')
    }
    if (isObject(context)) {
        let {controller, action, params} = context;
        return url([controller, action, params])
    }
    if (isString(context)) {
        return context;
    }
    return context;
}

module.exports = {
    alink,
    block,
    shortTag,
    table,
    tag,
    tagAttributes,
    tagStart,
    tbody,
    td,
    th,
    thead,
    tr,
    url,
}