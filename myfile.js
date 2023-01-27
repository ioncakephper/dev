const { HandlebarsRenderer } = require("./ui-fields")

/**
 * A class that represents a standard feature.           
 * @returns None           
 */
class StandardFeature {

    /**
     * Renders the component.       
     * @param {object} values - The values to render the component with.       
     * @returns {React.ReactElement} React element containing the rendered component.       
     */
    render(values = {}) {
        return this.wrapper().render({
            ...{content: this.content().render(values)}
        })
    }

    /**
     * A wrapper function that returns a HandlebarsRenderer object.           
     * @returns {HandlebarsRenderer} - a HandlebarsRenderer object.           
     */
    wrapper() {
        return new HandlebarsRenderer();
    }

    /**
     * Returns a new HandlebarsRenderer object.           
     * @returns {HandlebarsRenderer} - a new HandlebarsRenderer object.           
     */
    content() {
        return new HandlebarsRenderer();
    }
}

module.exports = {
    StandardFeature,
}