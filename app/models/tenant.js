const { Entity } = require('../apps');

class Tenant extends Entity {
    constructor() {
        super('tenants')
    }

    index() {
        return {
            records: this.Tenant.findRange()
        }
    }
}

module.exports = {
    Tenant,
}