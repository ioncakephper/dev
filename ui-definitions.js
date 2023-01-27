/*
 * Filename: c:\Users\ion.gireada\Documents\VS Code Development\dev\ui-definitions.js
 * Path: c:\Users\ion.gireada\Documents\VS Code Development\dev
 * Created Date: Saturday, December 31st 2022, 11:57:34 am
 * Author: Ion Gireada
 * Copyright (c) 2022 Your Company
 */

const hbsr = require('hbsr');

/**
 * A class that renders the page.
 */
class Renderer {

    /**
     * Creates an instance of Renderer.
     * @param {*} [options={}] - the options for the renderer.
     * @memberof Renderer
     */
    constructor(options = {}) {
         for (let key in options) {
            this[key] = options[key];
         }
    }

    /**
     * Renders the template file with the given values.
     * @param {string} filename - the filename of the template file.
     * @param {object} values - the values to pass to the template file.
     * @returns {string} the rendered template file.
     */
    render(values = {}) {
        return this.useTemplateFile
            ? this.renderTemplateFile(this.getTemplateFilename(), values)
            : this.renderTemplateString(this.getTemplateString(), values);
    }


    /**
     * Renders a template file with the given values.
     * @param {string} templateFilename - the name of the template file.
     * @param {object} [values={}] - the values to render the template with.
     * @returns {string} the rendered template.
     */
    renderTemplateFile(templateFilename, values = {}) {
        throw new Error('Method not implemented yet.')
    }

    /**
     * Takes in a template string and replaces the placeholders with the values in the values object.
     * @param {string} templateString - the template string to render.
     * @param {object} [values={}] - the values to replace the placeholders with.
     * @returns {string} the rendered template string.
     */
    renderTemplateString(templateString, values = {}) {
        throw new Error('Method not implemented yet.')
    }

    /**
     * Returns the filename of the template file.
     * @returns {string} the filename of the template file.
     */
    getTemplateFilename() {
        return this.templateFilename;
    }

    /**
     * Returns the template string for the filter style sheet.
     * @returns {string} The template string for the filter style sheet.
     */
    getTemplateString() {
        return this.templateString || ''
    }
}

/**
 * A renderer that uses Handlebars to render templates.
 * @extends Renderer
 */
class HandlebarsRenderer extends Renderer {

    /**
     * @override
     */
    renderTemplateFile(templateFilename, values = {}) {
        return hbsr.render_template(templateFilename, values, this.templateOptions);
    }

    /**
     * @override
     */
    renderTemplateString(templateString, values = {}) {
        return hbsr.render(templateString, values, this.templateOptions);
    }
}

/**
 * A basic field that can be used to create a field that can be used in a form.
 */
class BasicField {

    /**
     * Takes in an options object and returns a new options object with default values.
     * @param {object} [options={}] - the options object to format.
     * @returns {object} a new options object with default values.
     */
    defaultOptions(options = {}) {
        return {
            ...{choices: [], items: []},
            ...options,
        }
    }
}

/**
 * A class that represents a field in the UI.
 * @extends BasicField
 */
class UiField extends BasicField {

    /**
     * Creates an instance of UiField.
     * @param {*} [options={}] - the options for the field.
     * @memberof UiField
     */
    constructor(options = {})  {
        super()
        this.props = this.defaultOptions(options)
    }

    /**
     * Renders the component with the given values.
     * @param {object} values - the values to render the component with.
     * @returns {string} the rendered component.
     */
    render(values = {}) {
        let content = this.body().render(this.variables(values));
        return this.wrapper().render({
            ...this.defaultVariables(values),
            ...{content: content}
        })
    }

    /**
     * Returns the body of the page.
     * @returns {string} The body of the page.
     */
    body() {
        let bodySettings = {
            useTemplateFile: this.useTemplateFile,
            templateFilename: this.getTemplateFilename(),
            templateString: this.getTemplateString(),
        }
        return this.getRenderer(bodySettings);
    }

    /**
     * Returns a function that can be used to render the wrapper.
     * @param {Object} wrapperSettings - the settings for the wrapper.
     * @param {boolean} wrapperSettings.useTemplateFile - whether to use a template file.
     * @param {string} wrapperSettings.templateFilename - the name of the template file.
     * @param {string} wrapperSettings.templateString - the string of the template.
     * @returns {Function} a function that can be used to render the wrapper.
     */
    wrapper() {
        let wrapperSettings = {
            useTemplateFile: this.useTemplateFile,
            templateFilename: this.getWrapperTemplateFilename(),
            templateString: this.getWrapperTemplateString(),
        }
        return this.getRenderer(wrapperSettings);
    }

    /**
     * Returns a renderer for the given settings.
     * @param {HandlebarsSettings} settings - The settings to use.
     * @returns A renderer for the given settings.
     */
    getRenderer(settings) {
        return new HandlebarsRenderer(settings)
    }

    /**
     * Returns the filename of the template file that should be used for the given type.
     * @returns {string} the filename of the template file that should be used for the given type.
     */
    getTemplateFilename() {
        return this.props.type;
    }

    /**
     * Returns the template string for the current site.
     * @returns {string} The template string for the current site.
     */
    getTemplateString() {
        return this.props.templateString || '';
    }

    /**
     * Returns the name of the wrapper template file.
     * @returns {string} the name of the wrapper template file.
     */
    getWrapperTemplateFilename() {
        return this.wrapperTemplateFilename || 'wrapper';
    }

    /**
     * Returns the wrapper template string.
     * @returns {string} The wrapper template string.
     */
    getWrapperTemplateString() {
        return this.wrapperTemplateString || '{{{content}}}';
    }
}

/**
 * A text field that can be used in a UI.
 * @extends UiField
 */
class UiTextField extends UiField {

    /**
     * Creates an instance of UiTextField.
     * @param {*} [options={}] - the options for the field.
     * @memberof UiTextField
     */
    constructor(options = {}) {
        super(options);
        this.props.type = 'text'
    }

    getTemplateFilename() {
        return 'text'
    }
}

/**
 * A text field that only accepts numbers.
 * @extends UiTextField
 */
class UiNumberField extends UiTextField {

    /**
     * Creates an instance of UiNumber.
     * @param {*} [options={}] - the options for the field.
     * @memberof UiNumber
     */
    constructor(options = {}) {
        super(options);
        this.props.type = 'number';
    }
}

function textField(label, options = {}) {
    return new UiTextField({
        ...labelAndRequired(label),
        ...options,
    })
}

function numberField(label, options = {}) {
    return new UiNumberField({
        ...labelAndRequired(label),
        ...options,
    })
}

function labelAndRequired(label = '') {
    return {
        label: sanitizedLabel(label),
        required: itSuggestsRequired(label)
    }
}

function sanitizedLabel(label = '') {
    // If the message is a group message, then the subject is the first word of the message. Otherwise, the subject is the message itself.
    return label.trim().replace(/\s+/g, ' ').replace(/\*/g, '');
}

/**
 * Checks if the given label suggests that the field is required.
 * @param {string} [label=''] - the label to check
 * @returns {boolean} - true if the label suggests that the next line is required.
 */
function itSuggestsRequired(label = '') {
    return /\*+\s*$/g.test(label);
}

module.exports = {
    UiField,
    UiTextField,
    UiNumberField,
    Renderer,
    BasicField,
    HandlebarsRenderer,

    labelAndRequired,
    sanitizedLabel,
    itSuggestsRequired,
}