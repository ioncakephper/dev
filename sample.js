const hbsr = require("hbsr");
const {saveDocument} = require("file-easy");

const { UiTextField, UiNumberField, UiTableField, UiCollectionField } = require("./ui-fields");
const { textField, numberField, formField, dateField, timeField, colorField, rangeField, fileField, tableField, booleanField, textareaField, selectField, radioField, checkboxesField, getLabelAndRequired, buttonField} = require("./ui-fields-helper");
const { isUndefined, isString } = require("lodash");

class UiFileChooserField extends UiCollectionField {
    constructor(options = {}) {
        super({...{fields: []}, ...options, ...{type: 'fileChooser'}})
    }
}

let t = new UiNumberField({label: 'First name'})
console.table(t)
let u = t.render({})
let countryOptions = ["Romania", "Greece", "United Kingdom", "Spain", "Portugal"].sort().map((label, value) => {
    return {
        label: label,
        value: `${value}`
    }
});
let fields = [
    radioField('Another', [{label: 'First', value: '0'}, {label: 'Second', value: '1'}], {class: 'inline'}),
    // checkboxesField('Preferred country', countryOptions),
    // selectField('Country', [...[{label: '__', value: '-1'}], ...countryOptions]),
    // radioField('Preferred country', countryOptions),

    // textareaField('Description'),
    // textField('First name*'),
    // numberField('Age*'),
    // dateField('Date of Birth'),
    // timeField('Start time'),
    // colorField('Color'),
    // rangeField('Range'),
    // fileField('File'),
    // booleanField('Required'),
    // tableField('Resources', ['Title', 'Required']),

    // tableField('Order resources', [{text: 'Title'}, 'Required'], [
    //     ['Title 1', 'True'],
    //     ['Title 2', 'False'],
    //     ['Title 3', 'True'],
    //     ['Title 4', 'False'],
    //     ['Title 5', 'True'],
    // ]),

    textField('Label*'),
    textField('Name*'),
    booleanField('Required'),
    selectField('Type', [...["Text", "Boolean", "Textarea", "Color", "Date", "Time", "Radio", "Checkboxes", "Select", "Range", "File"].sort().map((label, value) => {
        return {
            label,
            value
        }
    })]),
    textField('Description'),
    textField('Placeholder'),
    radioField('Position', ["Vertical", "Horizontal"].map((label, value) => {
        return {
            label,
            value,
        }
    })),


    // fileChooserField('Document'),

    textField('Label'),
    textField('Code'),
    numberField('Value'),
    textField('Description'),


    buttonField('Cancel', {class: "btn-secondary float-right inline"}),
    buttonField('Save', {class: "btn-primary float-right inline mx-3"}),

]
// let v = fields.map(field => field.render({}))
// console.table(v)

let fm = formField('Contact', fields)
console.log(fm.render())

let values = {'country': ['4'], 'preferred-country': ['2', '3']}
let pageContent = hbsr.render_template('page', {content: fm.render(values)});
saveDocument('sample.html', pageContent)




// function fileChooserField(label, options = {}) {
//     return new UiFileChooserField({
//         ...getLabelAndRequired(label),
//         ...{fields: [fileField('Filename')]},
//         ...options,
//     })
// }

// let p = getLabelAndRequired('label');
