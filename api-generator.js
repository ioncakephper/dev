const { saveDocument } = require('file-easy');
const hbsr = require('hbsr');
var parser = require('jsdoc3-parser');
const path = require('path');


parser('myfile.js', function(error, ast) {

    console.log(JSON.stringify(ast, null, 2))

    let classDefinitions = ast.filter(item => {
        return item.kind && item.kind === 'class'
    })
    classDefinitions.forEach(classDefinition => {

        let classMethods = ast.filter(item => {
            return item.kind && item.kind === 'function' && item.memberof === classDefinition.name
        })
        // create documentation page for class
        createClassDocumentationPage({classDefinition, classMethods})
    })
});

function createClassDocumentationPage({classDefinition, classMethods}) {

    let {name, classdesc} = classDefinition;

    let classDocContent = hbsr.render_template('docTopic', {
        title: name,
        description: classdesc,
        headings: classMethods.map(classMethod => {
            return {
                label: classMethod.name,
                description: classMethod.description,
                returnType: classMethod.returns[0].type.names[0]
            }
        })
    }, {template_path: './'})

    let classDocFilename = path.join(`${name}.md`)
    saveDocument(classDocFilename, classDocContent)
}