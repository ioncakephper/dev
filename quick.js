
const yaml = require('yaml')
const fs = require('fs');
const { isString, isObject, isArray } = require('lodash');
const path = require('path');
const hbsr = require('hbsr');
const { saveDocument, setDefaultExtension } = require('file-easy')


let sidebars = loadSidebars('outline.yaml')

let sidebarsContent = buildSidebarsContent(sidebars);

saveDocument('sidebars.js', hbsr.render(`module.export = {{{content}}}`, {content: JSON.stringify(sidebarsContent, null, 4)}))


/**
 * Builds the sidebar content for the given sidebar.
 * @param {Sidebar} sidebar - the sidebar to build content for
 * @returns {SidebarContent} the sidebar content for the given sidebar
 */
function buildSidebarsContent(sidebars) {

    let documentationSidebars = {};
    sidebars.forEach(sidebar => {
        documentationSidebars[sidebar.label] = buildSidebarContent(sidebar)
    })
    return documentationSidebars;
}

/**
 * Builds the sidebar content for the sidebar.
 * @param {Sidebar} sidebar - the sidebar object
 * @returns {Array<string>} - the sidebar content
 */
function buildSidebarContent(sidebar) {
    let items = sidebar.items
    return items.map((item) => {
        item = buildStandardItem(item)
        if (isCategory(item)) {
            return {
                label: item.label,
                type: 'category',
                items: buildSidebarContent(item)
            }
        }

        let itemPath = path.join(buildPath(sidebar), buildPath(item), buildFilename(buildItemSlug(item)))
        buildTopicDocument(path.join('docs', itemPath), item)
        return formattedFilePath(itemPath)
    })
}

/**
 * Builds a topic document for the given item.
 * @param {string} targetFilename - the filename to save the document to.
 * @param {Topic} item - the topic to build a document for.
 * @returns None
 */
function buildTopicDocument(targetFilename, item) {

    let data = {...item, ...{
        title: item.title || item.label,
        sidebar_label: item.label,
    }}
    let topicContent = hbsr.render(`---
title: {{{title}}}
sidebar_label: {{{sidebar_label}}}
---

# {{{title}}}

{{#if headings}}
It has headings
{{/if}}

`, data)
    saveDocument(setDefaultExtension(targetFilename, '.md'), topicContent)
}

/**
 * Builds a slug for the given item.
 * @param {Item} item - the item to build a slug for.
 * @returns {string} the slug for the given item.
 */
function buildItemSlug(item) {
    return item.slug || item.label;
}

/**
 * Builds the path to the given item.
 * @param {Item} item - the item to build the path for.
 * @returns {string} the path to the given item.
 */
function buildPath(item) {
    let itemPath = item.folder || '';
    itemPath = buildFilename(itemPath);
    return path.join(itemPath)

}

/**
 * Takes in a string and returns a string with all non-alphanumeric characters replaced with underscores.
 * @param {string} source - the string to replace characters in
 * @returns {string} - the string with all non-alphanumeric characters replaced with underscores
 */
function buildFilename(source) {
    source = source.trim().toLowerCase();
    let replacableChars = /[^a-zA-Z0-9\_\-]+/;
    while (replacableChars.test(source)) {
        source = source.replace(replacableChars, '_')
    }
    return source
}

/**
 * Takes in a string of code and removes all the backslashes.
 * @param {string} source - the code to format
 * @returns None
 */
function formattedFilePath(source = '') {
    source = source.trim();
    while (/\\/.test(source)) {
        source = source.replace(/\\/, '/')
    }
    return source;
}

/**
 * Checks if the given item is a category.
 * @param {object} item - the item to check
 * @returns {boolean} - true if the item is a category, false otherwise
 */
function isCategory(item = {items: []}) {
    return item.items.length > 0
}


/**
 * Loads the sidebars from the given file.
 * @param {string} filename - the name of the file to load the sidebars from.
 * @returns {Array<SidebarItem>} - an array of SidebarItems.
 */
function loadSidebars(filename) {
    let source = yaml.parse(fs.readFileSync(filename, 'utf-8'))['sidebars'];
    if (isString(source)) {
        return [buildStandardItem(source)]
    }
    if (isArray(source)) {
        return source.map(item => {
            return buildStandardItem(item)
        })
    }
}

/**
 * Takes in an item and returns a standard item object.
 * @param {string | object} item - the item to convert to a standard item object.
 * @returns {object} - the standard item object.
 */
function buildStandardItem(item) {
    if (isString(item)) {
        item = {label: item}
    }
    if (isObject(item)) {
        if (!isStandard(item)) {
            item = buildItemFromObject(item)
        }
        item = {...{items: []}, ...item}
    }
    return item;
}

/**
 * Takes in an object and returns a menu item object.
 * @param {object} item - the object to build a menu item from.
 * @returns {object} - the menu item object.
 */
function buildItemFromObject(item) {
    let isValidObject = isObject(item) && Object.keys(item).length === 1;
    if (!isValidObject) {
        throw new Error('Expecting object with a single key')
    }
    let key = Object.keys(item)[0]
    let value = item[key]
    if (isArray(value)) {
        value = value.map(el => buildStandardItem(el))
    }
    if (isString(value)) {
        value = [value]
    }
    return {
        label: key,
        items: isArray(value) ? value.map(el => buildStandardItem(el)) : buildStandardItem(value)
    }

}

/**
 * Checks if the given item is a standard object.
 * @param {object} item - the item to check
 * @returns {boolean} - true if the item is a standard object, false otherwise
 */
function isStandard(item = {}) {
    if (!isObject(item)) return false;
    return ['label'].some(key => Object.keys(item).includes(key))
}