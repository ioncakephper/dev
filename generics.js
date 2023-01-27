
/**
 * Create documentation files and an API outline for classes and functions.
 * The API outline is a YAML string
 * 
 * The API outline contains:
 * 1. The API category, with Classes and Functions subcategories
 * 2. Under Classes, list class names alphabetically. The class name links to the class summary page.
 * 3 Under the class name in the menu, list class methods in alphabetical order. Each method name opens the method page.
 */

/**
 * API:
 *      - Classes:
 *          - {{{name}}}:
 *              - Methods:
 *                  -- {{{name}}}
 *      - Functions:
 *          - {{{name}}}
 */

/**
 * API:
 *      - Classes:
 *          - {{{name}}}:
 *              '@headings`:
 *                  - Constructor
 *                  - Methods:
 *                      - {{{name}}}:
 *                          - Description
 *                          - Parameters
 *                          - Returns
 *                          - Examples
 */
const yaml = require('yaml-js')


function generateAPI({classes, functions}) {


}