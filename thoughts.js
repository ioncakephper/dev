const { isObject, isEmpty } = require("lodash")

function getFeatures(callback) {
    return items.filter(callback)
}


return getFeatures((item) => {
    return (item && isObject(item) && !isEmpty(item.title))
})