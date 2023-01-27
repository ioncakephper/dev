const { 
    UiTextField, UiNumberField, UiColorField, UiFileField, UiRangeField, UiTextareaField, UiBooleanField, UiSelectField, UiRadioField, UiFormField, UiCollectionField, UiButtonField, UiLabelField, UiGroupField, UiCheckboxesField, UiDateField
 } = require('./ui-fields')
const { isEmpty } = require('lodash')

/**
 * Takes in a string and removes any trailing asterisks.       
 * @param {string} label - the string to sanitize       
 * @returns {string} the sanitized string       
 */
function sanitize(label = '') {
    return label.trim().replace(/\*+\s*$/, '')
}

/**
 * Checks if the given label ends with a '*' and returns true if it does.       
 * @param {string} label - the label to check.       
 * @returns {boolean} - true if the label ends with a '*', false otherwise.       
 */
function itSuggestsRequired(label = '') {
    return label.trim().endsWith('*')
}

/**
 * Takes in a label and returns a label and a boolean indicating whether the label suggests that the field is required.           
 * @param {string} label - the label to format           
 * @returns {object} - an object containing the label and a boolean indicating whether the label suggests that the field is required.           
 */
function getLabelAndRequired(label = '') {
    label = (isEmpty(label.trim()))
        ? 'No label'
        : label.trim()
    return {
        label: sanitize(label),
        required: itSuggestsRequired(label)
    }
}

/**
 * Creates a text field with the given label and options.           
 * @param {string} label - the label for the text field.           
 * @param {object} [options={}] - the options for the text field.           
 * @returns {UiTextField} - the text field object.           
 */
function textField(label, options = {}) {
    return new UiTextField({
        ...getLabelAndRequired(label),
        ...options,
    })
}

/**
 * Creates a date field.           
 * @param {string} label - the label for the field.           
 * @param {object} [options={}] - the options for the field.           
 * @returns {UiDateField} - the date field.           
 */
function dateField(label, options = {}) {
    return new UiDateField({
        ...getLabelAndRequired(label),
        ...options,
    })
}

/**
 * Creates a new UiNumberField object.           
 * @param {string} label - The label for the field.           
 * @param {object} [options={}] - The options for the field.           
 * @returns {UiNumberField} - The new UiNumberField object.           
 */
function numberField(label, options = {}) {
    return new UiNumberField({
        ...getLabelAndRequired(label),
        ...options,
    })
}

/**
 * Creates a boolean field.           
 * @param {string} label - the label for the field.           
 * @param {object} [options={}] - the options for the field.           
 * @returns {UiBooleanField} - the boolean field.           
 */
function booleanField(label, options = {}) {
    return new UiBooleanField({
        ...getLabelAndRequired(label),
        ...options,
    })
}

/**
 * Creates a color field.           
 * @param {string} label - the label for the field.           
 * @param {object} [options={}] - the options for the field.           
 * @returns {UiColorField} - the color field.           
 */
function colorField(label, options = {}) {
    return new UiColorField({
        ...getLabelAndRequired(label),
        ...options,
    })  
}

/**
 * Creates a UiRangeField object.           
 * @param {string} label - the label for the field.           
 * @param {object} [options={}] - the options for the field.           
 * @returns {UiRangeField} - the UiRangeField object.           
 */
function rangeField(label, options = {}) {
    return new UiRangeField({
        ...getLabelAndRequired(label),
        ...options,
    })
}

/**
 * Creates a file field.           
 * @param {string} label - the label for the field.           
 * @param {object} [options={}] - the options for the field.           
 * @returns {UiFileField} - the file field.           
 */
function fileField(label, options = {}) {
    return new UiFileField({
        ...getLabelAndRequired(label),
        ...options,
    })
}

/**
 * Creates a textarea field.           
 * @param {string} label - the label for the textarea field.           
 * @param {object} [options={}] - the options for the textarea field.           
 * @returns {UiTextareaField} - the textarea field.           
 */
function textareaField(label, options = {}) {
    return new UiTextareaField({
        ...getLabelAndRequired(label),
        ...options,
    })
}

function selectField(label, variants = [], options = {}) {
    return new UiSelectField({
        ...getLabelAndRequired(label),
        ...{
            options: variants,
        },
        ...options,
    })
}

/**
 * Creates a radio field.       
 * @param {string} label - the label for the field       
 * @param {string[]} variants - the variants for the field       
 * @param {object} options - the options for the field       
 * @returns {UiRadioField} - the radio field object       
 */
function radioField(label, variants = [], options = {}) {
    return new UiRadioField({
        ...getLabelAndRequired(label),
        ...{
            options: variants,
        },
        ...options
    })
}

/**
 * Creates a checkboxes field.           
 * @param {string} label - the label for the field.           
 * @param {string[]} variants - the variants for the checkboxes.           
 * @param {object} options - the options for the field.           
 * @returns {UiCheckboxesField} - the checkboxes field.           
 */
function checkboxesField(label, variants = [], options = {}) {
    return new UiCheckboxesField({
        ...getLabelAndRequired(label),
        ...{
            options: variants,
        },
        ...options
    })
}

/**
 * Creates a form field object.           
 * @param {string} label - the label for the form field.           
 * @param {Array<UiFormField>} fields - the fields to add to the form field.           
 * @param {Object} options - the options for the form field.           
 * @returns {UiFormField} - the form field object.           
 */
function formField(label, fields = [], options = {}) {
    return new UiFormField({
        ...getLabelAndRequired(label),
        ...{
            fields: fields,
            method: 'POST',
            action: '',
        },
        ...options,
    })
}

/**
 * Creates a form field with a label and a collection of fields.       
 * @param {string} label - the label for the form field       
 * @param {UiCollectionField[]} fields - the fields to add to the form field       
 * @param {UiFormFieldOptions} options - the options for the form field       
 * @returns {UiFormField} - the form field with the given label and fields       
 */
function formWithButtonsField(label, fields = [], options = {}) {
    return formField(label, [
        ...fields,
        ...[
            new UiCollectionField({
                ...getLabelAndRequired('Buttons'),
                ...{
                    fields: [
                    buttonField('Cancel', {
                        class: 'btn-secondary inline'
                    }),
                    buttonField('Submit', {
                        class: 'btn-primary inline my-3'
                    }),
                    ]
                }
            })
        ],
        options,
    ])
}

/**
 * Creates a button field.           
 * @param {string} label - The label for the button field.           
 * @param {object} [options={}] - The options for the button field.           
 * @returns {UiButtonField} - The button field.           
 */
function buttonField(label, options = {}) {
    return new UiButtonField({
        ...getLabelAndRequired(label),
        ...options,
    })
}

/**
 * Creates a UiLabelField object with the given label and options.           
 * @param {string} label - the label for the field           
 * @param {object} options - the options for the field           
 * @returns {UiLabelField} - the UiLabelField object           
 */
function labelField(label, options = {}) {
    return new UiLabelField({
        ...getLabelAndRequired(label),
        ...options,
    })
}

/**
 * Creates a UiGroupField object with the given label and fields.           
 * @param {string} label - the label for the group field.           
 * @param {Array<UiField>} fields - the fields to add to the group field.           
 * @param {Object} options - the options for the group field.           
 * @returns {UiGroupField} - the group field object.           
 */
function groupField(label, fields = [], options = {}) {
    return new UiGroupField({
        ...getLabelAndRequired(label),
        ...{
            fields: fields,
        },
        ...options,
    })
}

module.exports = {
    booleanField,
    buttonField,
    checkboxesField,
    colorField,
    dateField,
    fileField,
    formField,
    formWithButtonsField,
    getLabelAndRequired,
    groupField,
    itSuggestsRequired,
    labelField,
    numberField,
    radioField,
    rangeField,
    sanitize,
    selectField,
    textareaField,
    textField,
}

