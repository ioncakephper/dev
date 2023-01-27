const { slug } = require("file-easy");
const hbsr = require("hbsr");
const { isUndefined, isString, isNumber, isArray } = require("lodash");

/**
 * A class that can render a template string.                     
 */
class Renderer {
    constructor(options = {}) {
        options = {
            ...{ useTemplateFilename: true },
            ...options,
        }

        Object.keys(options).forEach(opt => {
            this[opt] = options[opt]
        })
    }

    /**
     * Renders the template file or string.           
     * @param {string} template - the template to render.           
     * @param {object} values - the values to pass to the template.           
     * @returns {string} the rendered template.           
     */
    render(values = {}) {

        return this.useTemplateFilename
            ? this.renderTemplateFilename(this.getTemplateFilename(), values)
            : this.renderTemplateString(this.getTemplateString(), values);
    }

    /**
     * Renders a template file with the given values.           
     * @param {string} templateFilename - the name of the template file.           
     * @param {object} [values={}] - the values to render the template with.           
     * @returns {string} the rendered template.           
     */
    renderTemplateFilename(templateFilename, values = {}) {
    }

    /**
     * Takes in a template string and replaces the placeholders with the values in the values object.       
     * @param {string} templateString - the template string to render       
     * @param {object} [values={}] - the values to replace the placeholders with       
     * @returns {string} the rendered template string       
     */
    renderTemplateString(templateString, values = {}) { }

    /**
     * Returns the filename of the template file that is used to generate the style sheet.       
     * @returns {string} the filename of the template file that is used to generate the style sheet.       
     */
    getTemplateFilename() {
        return this.templateFilename;
    }

    /**
     * Returns the template string for the style sheet.       
     * @returns {string} the template string for the style sheet.       
     */
    getTemplateString() {
        return this.templateString;
    }
}

/**
 * A renderer that uses Handlebars to render templates.   
 * @extends Renderer    
 * @param {Object} options - The options object.       
 * @param {string} options.templateDirectory - The directory that contains the templates.       
 * @param {string} options.templateExtension - The extension of the templates.       
 * @param {string} options.templateFileName - The name of the template file.       
 * @param {string} options.templateString - The string of the template.       
 * @param {Object} options.values - The values to pass to the template.             
 */
class HandlebarsRenderer extends Renderer {
    constructor(options) {
        super(options)
    }

    /**
     * Renders a template file with the given values.       
     * @param {string} templateFilename - the name of the template file to render.       
     * @param {object} [values={}] - the values to pass to the template.       
     * @returns {string} the rendered template.       
     */
    renderTemplateFilename(templateFilename, values = {}) {
        return hbsr.render_template(templateFilename, values);
    }

    /**
     * Takes in a template string and values and returns a rendered string.       
     * @param {string} templateString - the template string to render       
     * @param {object} [values={}] - the values to pass to the template string       
     * @returns {string} the rendered template string       
     */
    renderTemplateString(templateString, values = {}) {
        return hbsr.render(templateString, values)
    }
}

/**
 * Returns the filename of the template to use for the wrapper element.       
 * @returns {string} the filename of the template to use for the wrapper element.       
 */
class UiField {

    constructor(options = {}) {
        options = {
            ...{
                type: 'base',
                label: 'No label',
                required: false,
            },
            ...options,
        }
        options['name'] = options['name'] || slug(options.label);

        this.props = options;
        this.useTemplateFilename = true;
    }

    /**
     * Renders the template with the given values.           
     * @param {object} values - the values to render the template with.           
     * @returns {string} the rendered template.           
     */
    render(values = {}) {
        let contentRenderer = this.buildContentRenderer()
        let content = contentRenderer.render(this.variables(values))

        let wrapperRenderer = this.buildWrapperRenderer();
        return wrapperRenderer.render({
            ...this.defaultVariables(values),
            ...{ content: content }
        })
    }

    /**
     * Returns a new object with the default variables and the given values.       
     * @param {object} values - the values to add to the variables object.       
     * @returns {object} - the new variables object.       
     */
    variables(values = {}) {
        return {
            ...this.defaultVariables(values),
            ...{ value: this.getValue(values) },
        }
    }

    /**
     * Returns the default values for the variables used in the component.           
     * @param {object} [values={}] - the values to use for the default variables.           
     * @returns {object} - the default values for the variables used in the component.           
     */
    defaultVariables(values = {}) {
        return this.props;
    }

    /**
     * Gets the value of the property from the values object.       
     * @param {object} values - the values object.       
     * @returns The value of the property.       
     */
    getValue(values = {}) {
        return values[this.props.name]
    }

    /**
     * Builds a content renderer based on the options given.       
     * @param {object} options - The options to build the content renderer with.       
     * @returns A content renderer.       
     */
    buildContentRenderer(options) {
        return new HandlebarsRenderer({ useTemplateFilename: this.useTemplateFilename, templateFilename: this.getTemplateFilename(), templateString: this.getTemplateString() })
    }

    /**
     * Builds a wrapper renderer for the given options.       
     * @param {Object} options - The options object.       
     * @returns {HandlebarsRenderer} - The wrapper renderer.       
     */
    buildWrapperRenderer(options) {
        return new HandlebarsRenderer({ useTemplateFilename: this.useTemplateFilename, templateFilename: this.getWrapperTemplateFilename(), templateString: this.getWrapperTemplateString() })
    }

    /**
     * @inheritdoc
     */
    getTemplateFilename() {
        return this.props.type;
    }

    /**
     * @inheritdoc
     */
    getTemplateString() {
        return ``
    }

    getWrapperTemplateFilename() {
        return 'wrapper'
    }

    getWrapperTemplateString() {
        return `{{{content}}}`
    }
}

/**
 * A UiField that represents a text input.           
 * @extends UiField           
 * @param {object} options - The options for the UiTextField.           
 * @param {string} [options.type='text'] - The type of input to use.           
 * @param {string} [options.placeholder] - The placeholder text to display.           
 * @param {string} [options.value] - The value of the input.           
 * @param {string} [options.name] - The name of the input.           
 * @param {string} [options.id] - The id of the input.           
 */
class UiTextField extends UiField {
    constructor(options = {}) {
        super({
            ...{
                type: 'text'
            },
            ...options,
        })
    }
}

/**
 * A text field that is a date.       
 * @extends UiTextField       
 */
class UiDateField extends UiTextField {
    constructor(options = {}) {
        super({
            ...options,
            ...{
                type: 'date'
            }
        })
    }

    /**
     * Returns the filename of the template to use for the given extension.       
     * @returns {string} the filename of the template to use for the given extension.       
     */
    getTemplateFilename() {
        return 'text';
    }
}

/**
 * A text field that only accepts numbers.           
 * @extends UiTextField           
 */
class UiNumberField extends UiTextField {
    constructor(options = {}) {
        super({
            ...options,
            ...{ type: 'number' }
        })
    }

    getTemplateFilename() {
        return 'text'
    }
}

/**
 * A text field that is a color picker.           
 * @extends UiTextField           
 */
class UiColorField extends UiTextField {
    constructor(options = {}) {
        super({
            ...options,
            ...{ type: 'color' }
        })
    }

    getTemplateFilename() {
        return 'text'
    }
}

/**
 * A text field that is a range field.           
 * @extends UiTextField           
 */
class UiRangeField extends UiTextField {
    constructor(options = {}) {
        super({
            ...options,
            ...{ type: 'range' }
        })
    }

    getTemplateFilename() {
        return 'text'
    }
}

/**
 * A text field that is rendered as a file input.           
 * @extends UiTextField           
 */
class UiFileField extends UiTextField {
    constructor(options = {}) {
        super({
            ...options,
            ...{ type: 'file' }
        })
    }

    getTemplateFilename() {
        return 'text'
    }
}

/**
 * A UiField that represents a primary field.       
 * @extends UiField       
 */
class UiPrimaryField extends UiField {
    constructor(options = {}) {
        super({
            ...options,
            ...{
                type: 'Pk'
            }
        })
    }

    getTemplateFilename() {
        return 'text'
    }
}

/**
 * A UiField that represents a boolean value.           
 * @extends UiField           
 */
class UiBooleanField extends UiField {
    constructor(options = {}) {
        super({
            ...options,
            ...{ type: 'boolean' }
        })
    }
}

/**
 * A textarea field that can be used in a form.           
 * @extends UiField           
 * @param {object} options - The options for the field.           
 * @param {string} options.name - The name of the field.           
 * @param {string} options.label - The label of the field.           
 * @param {string} options.placeholder - The placeholder of the field.           
 * @param {string} options.value - The value of the field.           
 * @param {string} options.type - The type of the field.           
 * @param {string} options.className - The class name of the field
 */
class UiTextareaField extends UiField {
    constructor(options = {}) {
        super({ ...options, ...{ type: 'textarea' } })
    }
}

/**
 * A field with options that ia a parent for fields that can be used is a form.
 * @extends UiField                     
 */
class UiOptionsField extends UiField {
    constructor(options = {}) {
        super({
            ...{
                options: []
            },
            ...{
                type: 'options'
            },
            ...options,

        })
    }

    /**
     * Builds the label values for the given filter config.       
     * @param {FilterConfig} config - The filter configuration object.       
     * @returns {LabelValues} The label values for the given filter config.       
     */
    variables(values = {}) {
        return {
            ...super.variables(values),
            ...{
                labelValues: this.buildLabelValues(this.getValue(values))
            }
        }
    }

    /**
     * Takes in an array of label values and an array of field values and marks the label values that are in the field values array.       
     * @param {LabelValue[]} labelValues - the array of label values to mark.       
     * @param {string[]} fieldValues - the array of field values to check against.       
     * @returns {LabelValue[]} - the array of label values with the checked property set to true if the label value is in the field values array.       
     */
    buildLabelValues(fieldValues) {
        let labelValues = this.props.options.map(option => {
            return {
                ...option,
                ...{
                    checked: false,
                }
            }
        })
        labelValues = this.markSelectedOptions(labelValues, fieldValues)
        return labelValues;
    }

    /**
     * Takes in an array of label values and an array of field values.           
     * Returns an array of label values with the checked property set to true if the value is in the field values array.           
     * @param {LabelValue[]} labelValues - the array of label values.           
     * @param {string[] | string} fieldValues - the array of field values.           
     * @returns {LabelValue[]} - the array of label values with the checked property set.           
     */
    markSelectedOptions(labelValues, fieldValues = []) {
        return labelValues.map(labelValue => {
            return {
                ...labelValue,
                ...{
                    checked: isArray(fieldValues) ? fieldValues.includes(labelValue.value.toString()) : (isString(fieldValues) ? fieldValues === labelValue.value.toString() : false)
                }
            }
        })
    }

    getValue(values = {}) {
        let r = super.getValue(values);
        if (isUndefined(r)) {
            return []
        }
        if (isString(r) || isNumber(r)) {
            return [`${r}`]
        }
    }
}

/**
 * A UiSelectField is a UiOptionsField that is rendered as a select element.           
 * @extends UiOptionsField           
 */
class UiSelectField extends UiOptionsField {
    constructor(options = {}) {
        super({
            ...options,
            ...{
                type: 'select'
            }
        })
    }
}

/**
 * A UiOptionsField that represents a checkbox.           
 * @extends UiOptionsField           
 */
class UiCheckboxesField extends UiOptionsField {
    constructor(options = {}) {
        super({
            ...options,
            ...{
                type: 'checkboxes'
            }
        })
    }
}

/**
 * A radio button field for the UiOptionsField class.           
 * @extends UiOptionsField           
 * @param {object} options - The options for the radio button field.           
 * @param {string} options.type - The type of the field.           
 * @param {string} options.name - The name of the field.           
 * @param {string} options.label - The label of the field.           
 * @param {string} options.value - The value of the field.           
 * @param {string} options.placeholder - The placeholder of the field.           
 * @param {string} options.description - The description of the
 */
class UiRadioField extends UiOptionsField {
    constructor(options = {}) {
        super({
            ...options,
            ...{
                type: 'radio'
            },
        })
    }
}

/**
 * A class that represents a collection of fields.           
 * @param {UiField[]} fields - the fields to render in the collection.           
 * @param {string} [type='collection'] - the type of field.           
 * @param {object} [options={}] - the options for the field.           
 * @returns None           
 */
class UiCollectionField extends UiField {
    constructor(options = {}) {
        super({
            ...{
                fields: []
            },
            ...{
                type: 'collection'
            },
            ...options,

        })
    }

    variables(values = {}) {
        return {
            ...super.variables(values),
            ...this.buildFields(values)
        }
    }

    /**
     * Builds the fields for the form.       
     * @param {object} values - the values to use for the fields.       
     * @returns {fields: [string]} Object with key fields. The value for fields is an array of strings, each array item represents a field's HTML code.   
     */
    buildFields(values = {}) {
        return {
            fields: this.props.fields.map(field => {
                return field.render(values)
            })
        }
    }
}

/**
 * A UiCollectionField that represents a form.           
 * @extends UiCollectionField           
 * @param {object} options - The options for the UiFormField.           
 * @param {string} options.type - The type of the UiFormField.           
 */
class UiFormField extends UiCollectionField {
    constructor(options = {}) {
        super({
            ...options,
            ...{
                type: 'form'
            }
        })
    }
}

/**
 * A UiField that represents a button.           
 * @extends UiField           
 * @param {object} options - The options for the UiButtonField.           
 * @param {string} options.type - The type of the button.           
 */
class UiButtonField extends UiField {
    constructor(options = {}) {
        super({
            ...options,
            ...{
                type: 'button'
            }
        })
    }
}

/**
 * A UiField that displays a label.           
 * @extends UiField           
 * @param {object} options - The options for the UiLabelField.           
 * @param {string} options.label - The label to display.           
 * @param {string} options.type - The type of UiField to create.           
 */
class UiLabelField extends UiField {
    constructor(options = {}) {
        super({
            ...options,
            ...{
                type: 'label'
            }
        })
    }
}

/**
 * A UiGroupField is a UiCollectionField that has a type of 'group'. UiGroupField's template file places a label HTML element followed by fields in the group.      
 * @extends UiCollectionField           
 */
class UiGroupField extends UiCollectionField {
    constructor(options = {}) {
        super({
            ...options,
            ...{
                type: 'group'
            }
        })
    }
}

module.exports = {
    HandlebarsRenderer,
    Renderer,
    UiBooleanField,
    UiButtonField,
    UiCheckboxesField,
    UiCollectionField,
    UiColorField,
    UiDateField,
    UiField,
    UiFileField,
    UiFormField,
    UiGroupField,
    UiLabelField,
    UiNumberField,
    UiOptionsField,
    UiPrimaryField,
    UiRadioField,
    UiRangeField,
    UiSelectField,
    UiTextareaField,
    UiTextField,
}