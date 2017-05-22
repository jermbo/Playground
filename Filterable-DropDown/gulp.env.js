const yargs = require('yargs').argv;

module.exports = () => {
    return {
        basePath: '.',
        deployPath: '.',
        devURL: (yargs.url) ? yargs.url : './'
    }
}
