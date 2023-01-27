
/**
 * Executes a JavaScript statement and returns the result.           
 * @param {string} statement - the JavaScript statement to execute.           
 * @returns The result of the JavaScript statement.           
 */
function execute(statement) {
    // let records = [{COUNT: 5}]
    let records = []
    if (/COUNT/.test(statement)) {
        records.push({'COUNT': 1})
    }
    if (/SELECT Number, Apartmentsid/.test(statement)) {
        records = [
            {
                Number: '32',
                Apartmentsid: '1',
            },
            {
                Number: '33',
                Apartmentsid: '2',
            },
        ]
        return records;
    }
    if (/FROM entities/.test(statement)) {
        records = [
            {
                name: 'entities',
            },
            {
                name: 'applications',
            }
        ]
        return records
    }
    if (/SELECT \*/.test(statement)) {
        records = [

                {
                    applicationsid: '10001'
                }
            
        ]
    }
    if (/SELECT nextPkValue/.test(statement)) {
        return [
            {
                entityName: 'applications',
                lastValue: -5,
                increment: 5,
                nextPkValueid: '0'
            }
        ]
    }
    if (/FROM Tenants/.test(statement)) {
        return [
            {
                name: 'fullname',
                entityName: 'Tenants',
                type: 'text',
                default: '',
                extra: '',
                label: 'Full name'
            },
            {
                name: 'Apartmentsis',
                entityName: 'Tenants',
                type: 'lookup',
                parentEntityName: 'Apartments',
                default: '',
                extra: '',
                label: 'Apartment'
            },
            // {
            //     name: 'increment',
            //     entityName: 'Tenants',
            //     type: 'text',
            //     default: '',
            //     extra: ''
            // },
            // {
            //     name: 'entityName',
            //     entityName: 'Tenants',
            //     type: 'text',
            //     default: '',
            //     extra: ''
            // },
            {
                name: 'Tenantsid',
                entityName: 'Tenants',
                type: 'Pk',
                default: '',
                extra: ''
            },             
        ]
    }
    if (/SELECT /.test(statement) && /FROM attributes/.test(statement) && /nextPkValueid/.test(statement)) {
        return [
                {
                    name: 'lastValue',
                    entityName: 'nextPkValue',
                    type: 'text',
                    default: '',
                    extra: ''
                },
                {
                    name: 'increment',
                    entityName: 'nextPkValue',
                    type: 'text',
                    default: '',
                    extra: ''
                },
                {
                    name: 'entityName',
                    entityName: 'nextPkValue',
                    type: 'text',
                    default: '',
                    extra: ''
                },
                {
                    name: 'nextPkValueid',
                    entityName: 'nextPkValue',
                    type: 'Pk',
                    default: '',
                    extra: ''
                }, 
        ]
    }
    if (/SELECT /.test(statement) && /FROM attributes/.test(statement) && /Tenants/.test(statement)) {
        records = [

                {
                    name: 'Tenantsid',
                    label: 'ID',
                    type: 'Pk',
                    entityName: 'Tenants',
                    default: ``,
                    extra: ``
                },
                {
                    name: 'fullname',
                    label: 'Full name',
                    type: 'text',
                    entityName: `Tenants`,
                    default: ``,
                    extra: ``
                },
                {
                    name: 'fullname',
                    label: 'Full name',
                    type: 'lookup',
                    parentEntityName: `Apartment`,
                    entityName: `Tenants`,
                    default: ``,
                    extra: ``
                },
        ]
    }
    if (/SELECT applicationsid/.test(statement) && /FROM applications/.test(statement)) {
        records = [
                {
                    'applicationsid': '0'
                },
        ]
    }
    return records;
}

module.exports = {
    execute
}