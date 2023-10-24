"use strict"

const {program} = require('commander');
const fs = require('fs')
const Papa = require('papaparse')
const _ = require('lodash')

const title = 'Converts from CSV format to JSON'

function converter(object) {

   if(object.errors&&object.errors.length>0){
       console.log('>> error on parsing file! <<\n')
       console.log(object.errors)
       return
   }

   const headers = object.meta.fields

   console.log(' ')
   console.log('Header / Fields: ')
   console.log('-----------------')
   headers.forEach(header=>console.log(_.camelCase(header)))
   console.log(' ')
   console.log('Total objects: '+object.data.length)

   let json = '['

    object.data.forEach(obj=>{
        json+='{ '
        headers.forEach(header=>{
            let atributo = _.camelCase(header)
            let conteudo = [obj[header]]
            json+=(`${atributo}:'${conteudo}',`)
        })

        json+='},'
    })

   json+= ']'

    json = json.replaceAll(',}','}')
    json = json.replaceAll(',]',']')


    if(options.output){
      fs.writeFileSync(options.output, json, {encoding: 'utf-8', flag: 'w'})
      console.log(`Result saved as ${options.output}`)
    }else{
      console.log(json)

    }


}


program
    .description(title)
    .option('-f, --file <file>', 'runs that chosen file')
    .option('-o, --output <file>', 'sends result to file. To default output if omitted')


program.parse();

const options = program.opts();

if (options.file) {
    console.log('...Processing: ' + options.file)
    const file = fs.readFileSync(options.file, {})
    if (file) {
        converter(Papa.parse(file.toString(), {skipEmptyLines: true, header: true}))
    } else {
        console.error('The file format is not valid: ' + options.file)
    }
} else {
    console.log(`
    
    ${title}
    
    --help to know more.
    
    `)
}
