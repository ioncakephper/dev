/*
 * Filename: c:\Users\ion.gireada\Documents\VS Code Development\dev\sample-source.js
 * Path: c:\Users\ion.gireada\Documents\VS Code Development\dev
 * Created Date: Saturday, December 31st 2022, 10:58:02 am
 * Author: Ion Gireada
 *
 * Copyright (c) 2022 Your Company
 */

const path = require('path')
const yaml = require('yaml')
const fs = require('fs');
const { isEmpty, isObject, isString, isArray } = require('lodash');

/**
 * Parse a YAML file and return the sidebars object.
 * @param {string} [fileName=""] - the name of the file to parse.
 * @returns {object} - the sidebars object from the YAML file.
 */
function parseYamlFile(fileName = "") {
    if (!isEmpty(fileName)) {
        fileName = setDefaultExtension(fileName, ".yaml");
    }
    let sidebars = yaml.parse(fs.readFileSync(fileName, 'utf8')).sidebars;
    return sidebars.map(sidebar => {
        return normalize(sidebar)
    });
}

// convert a string into a SidebarDefinitions object
function normalize(item = "") {
    item = isString(item) ? { label: item } : item;
    if (isObject(item)) {
        if (!itHasLabel(item)) {
            item = convertObjectIntoSidebarDefinition(item);
        }
    }
    item = {
        ...{items: []},
        ...item
    }
    return item;
}


/**
 * Checks if the given item has a label.
 * @param {object} item - the item to check for a label.
 * @returns {boolean} - true if the item has a label, false otherwise.
 */
function itHasLabel(item = {}) {
    return item.label !== undefined;
}

/**
 * Takes in an object and converts it into a sidebar definition.
 * @param {object} item - the object to convert
 * @returns {object} - the sidebar definition
 */
function convertObjectIntoSidebarDefinition(item = {}) {
    let k = Object.keys(item)[0];
    let v = item[k];
    let result = {
        label: k,
        items: []
    };
    if (isArray(v)) {
        v.forEach(item => {
            result.items.push(normalize(item));
        });
    } else {
        if (isObject(v)) {
            for (let prop in v) {
                let getPropName = (prop) => {
                    let propRexEx = /^@([a-zA-Z0-9]+)$/;
                    if (propRexEx.test(prop)) {
                        return prop.match(propRexEx)[1];
                    }
                }
                let propName = getPropName(prop);
                if (propName) {
                    result[propName] = isString(v[prop]) ? v[prop] : normalize(v[prop]);
                }
            }
        }
    }
    return result;
}


// set default file extension if extension is missing
/**
 * Adds a default extension to a file name if it doesn't already have one.
 * @param {string} fileName - the file name to add the extension to.
 * @param {string} defaultExtension - the default extension to add.
 * @returns {string} the file name with the extension added.
 */
function setDefaultExtension(fileName, defaultExtension) {
    if (fileName.lastIndexOf(".") < 0) {
        fileName += defaultExtension;
    }
    return fileName;
}

// get file extension
function getFileExtension(fileName = "") {
    var pos = fileName.lastIndexOf(".");
    if (pos > 0) {
        return fileName.substring(pos);
    }
    else {
        return "";
    }
}

module.exports = {
    parseYamlFile,
    setDefaultExtension,
    getFileExtension,
    normalize,
    convertObjectIntoSidebarDefinition,
    itHasLabel
}