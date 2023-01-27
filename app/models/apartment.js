const {Entity } = require('../apps')

class Apartment extends Entity {
    constructor() {
        super('apartments')
    }
}

module.exports = {
    Apartment,
}