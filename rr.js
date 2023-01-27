const path = require('path')
const fs = require('fs')
const {green} = require('colors')
const YAML = require('yaml')
const shelljs = require('shelljs')









function createProjectFolder(folder) {

  let wf = path.join('.', folder);
  if (!fs.existsSync(wf)) {
    fs.mkdirSync(wf)
  }
  console.log(`Created application folder: ${green(wf)}`)

  let dependencies = {
    "react": "^5.1.1"
  }
  let packageContent = {
    name: folder,
    version: `1.0.0`,
    description: '',
    dependencies: dependencies,
  }
  fs.writeFileSync(path.join(wf, 'package.json'), JSON.stringify(packageContent, null, 2), "utf-8")

  // // install Docusaurus in `{{folder}}\\website`
  // if (!fs.existsSync(path.join(wf, 'website')))
  //   fs.mkdirSync(path.join(wf, 'website'))
  if (!shelljs.exec(`npx create-docusaurus@latest ${wf}/website classic`)) {
    shelljs.echo("Did not work");
    shelljs.exit(1)
  }
  if (!shelljs.cp("-r", `${wf}/website/docs`, `${wf}/website/docs-backup`)) {}
  if (!shelljs.cp("-r", `${wf}/website/docusaurus.config.js`, `${wf}/website/docusaurus.config-backup.js`)) {}
  if (!shelljs.cp("-r", `${wf}/website/sidebars.js`, `${wf}/website/sidebars-backup.js`)) {}

  const outline = {
    sidebars: [
      {
        type: 'sidebar',
        label: 'docs',
        items: [
          {
            label: "Welcome",
            type: "category",
            items: [
              {
                label: "Welcome",
                type: "doc",
                slug: "intro",
                title: "Welcome to Your Project",
                brief: "Brief description about this project",
                headings: [
                  "Introduction",
                  "Installation",
                  "Quick Demo",
                  "API"
                ]
              }
            ]
          }
        ]
      }
    ]
  }
  // create documentation outline
  let outlineYamlContent = YAML.stringify(outline, null, 2)
  fs.writeFileSync(path.join(wf, "project.outline.yaml"), outlineYamlContent, "utf-8")

  if (!shelljs.exec(`sk2 ${wf}/project.outline.yaml -s ${wf}/website/sidebars.js -d ${wf}/website/docs`)) {

  }

  
}

createProjectFolder('my-designated-application')