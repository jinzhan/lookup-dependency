/*
 * @file: Recursive lookup dependency
 */

const find = require('find');
const yargs = require('yargs/yargs');
const {hideBin} = require('yargs/helpers');
const argv = yargs(hideBin(process.argv))
.usage('Usage: $0 <pkgName>')
.option('field', {
    alias: 'f',
    type: 'string',
    default: 'dependencies',
    description: 'Specify the dependencies of the package.json'
})
.argv;

const [pkgName] = argv._;
const field = argv.field;

if (!pkgName) {
    console.log('No <pkgName> supplied!');
    process.exit(1);
}

const findPkg = async (name, field = 'dependencies') => {
    return new Promise((resolve, reject) => {
        find.file('package.json', process.cwd(), files => {
            const results = [];
            files.forEach(path => {
                const pkg = require(path);
                if (pkg[field] && pkg[field][name]) {
                    results.push(path);
                }
            });
            resolve(results);
        })
    });
};

findPkg(pkgName, field)
    .then(console.log);
