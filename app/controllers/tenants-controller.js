const { Controller } = require('../apps');
const { Tenant } = require('../models/tenant');

class TenantsController extends Controller {
    constructor() {
        super(new Tenant())
    }

    browse() {
        return {
            records: this.Tenant.findRange(),
        }
    }
}


module.exports = {
    TenantsController,
}