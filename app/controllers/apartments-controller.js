const { values } = require('lodash')
const { Controller } = require('../apps')
const { Apartment } = require('../models/apartment')
const { Tenant } = require('../models/tenant')

class ApartmentsController extends Controller {
    constructor() {
        super(new Apartment())
        this.Tenant = new Tenant()
    }

    addTenant(id) {
        this.Tenant.insert({...values, ...{apartmentId: id}})
    }
}

module.exports = {
    ApartmentsController,
}