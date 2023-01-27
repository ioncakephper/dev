const { isString, create, isUndefined } = require("lodash");
const { camelCase } = require('camel-case')
const { getLabelAndRequired } = require('./ui-field-helpers')

const { UiPrimaryField } = require('./ui-fields')
const { selectField } = require('./ui-field-helpers')

class ModelSchema {

    constructor() {
        this.entities = []
    }

    addEntity(item) {
        item = createEntityModelIfNeeded(item);
        if (!this.hasEntity(item)) {
            this.entities.push(item)
        }
        return this.getEntity(item.label)
    }

    hasEntity(item) {
        return this.getEntities().some(entity => entity.label === item.label)
    }

    getEntities() {
        return this.entities;
    }

    getEntity(label) {
        return this.getEntities().filter(entity => entity.label === label)[0]
    }
}

class EntityModel {
    constructor(label) {
    
        this.relationships = {
            parents: {},
            children: {},
            manyToMany: {},
        }

        this.label = label;
        this.fields = []
    }

    addField(field) {
        if (!this.hasField(field))
            this.fields.push(field)
    }

    hasField(field) {
        return this.getFields().some(f => f.props.name === field.props.name)
    }

    getFields() {
        return this.fields;
    }

    hasAndBelongsTo(related, association) {
        related = createEntityModelIfNeeded(related);
        association = (isUndefined(association))
                    ? [this.label, related.label].sort().join('To')
                    : association;
        let via = createEntityModelIfNeeded(association)
        if (!this.hasManyToMany(related)) {
            this.addManyToMany(related)
            related.hasAndBelongsTo(this, via)
        }
        this.hasMany(via);
        related.hasMany(via);


        return this;
    }

    belongsTo(parent) {
        parent = createEntityModelIfNeeded(parent);
        if (!this.hasParent(parent)) {
            this.addParent(parent);

            let foreignKeyField = selectField(parent.label, [], {
                name: `${camelCase(parent.label)}Id`
            })
            this.addField(foreignKeyField)
        }
        parent.hasMany(this);
        return this;
    }

    hasManyToMany(related) {
        related = createEntityModelIfNeeded(related);
        return Object.keys(this.relationships.manyToMany).includes(related.label)
    }

    addManyToMany(related) {
        related = createEntityModelIfNeeded(related);
        this.relationships.manyToMany[related.label] = related.label;       
    }

    hasMany(child) {
        child = createEntityModelIfNeeded(child);
        if (!this.hasChild(child)) {
            this.addChild(child);

            child.belongsTo(this)
        }

        return this;
    }

    addChild(child) {
        child = createEntityModelIfNeeded(child)
        this.relationships.children[child.label] = child.label;
    }

    hasChild(item) {
        item = createEntityModelIfNeeded(item);
        return Object.keys(this.relationships.children).includes(item.label)
    }

    addParent(parent) {
        parent = createEntityModelIfNeeded(parent)
        this.relationships.parents[parent.label] = parent.label
    }

    hasParent(item) {
        item = createEntityModelIfNeeded(item);
        return Object.keys(this.relationships.parents).includes(item.label)
    }
}

function primaryField(label, options = {}) {
    return new UiPrimaryField({
        ...getLabelAndRequired(label),
        ...options,
    })
}


function createEntityModelIfNeeded(item) {
    if (isString(item)) {
        let model = new EntityModel(item);
        let field = primaryField('ID', {
            name: `${camelCase(item)}Id`
        })
        model.addField(field)
        return model;
    }
    return item;
}


let s = new ModelSchema();
// "Tenant, Bill, Apartment, Payment, Billing Cycle, Balance, PaymentMethod".trim().split(/\s*\,\s*/).sort().forEach(entityName => {
//     s.addEntity(entityName)
// })
// let tenant = s.getEntity('Tenant');
// tenant.belongsTo(s.getEntity('Apartment'));
// let payment = s.getEntity('Payment').hasAndBelongsTo('PaymentMethod', s.addEntity('PaymentToPaymentMethod'))

// console.log(JSON.stringify(tenant, null, 4))
// console.log(JSON.stringify(s.getEntity('Apartment'), null, 4));
// console.log(JSON.stringify(s.getEntity('Payment'), null, 4));
// console.log(JSON.stringify(s.getEntity('PaymentToPaymentMethod'), null, 4));
// console.log(JSON.stringify(s.getEntity('PaymentMethod'), null, 4));

s = new ModelSchema();
["Apartment", "Tenant", "Bill", "Payment", "Billingcycle", "Billitem", "Expense"].sort().forEach(entityName => {
    s.addEntity(entityName);
})
let result = {}
s.getEntities().forEach(entity => {
    result[entity.label.toLowerCase()] = entity;
})
let {
    apartment, tenant, bill, payment, billingcycle, billitem, expense,
} = result;
payment.belongsTo(bill).belongsTo(apartment);
bill.belongsTo(apartment).belongsTo(billingcycle).hasMany(billitem.belongsTo(expense))

console.log(JSON.stringify(bill, null, 4))