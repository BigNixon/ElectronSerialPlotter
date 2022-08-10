//to reload static files whenever they are updated
const reload = require('electron-reload')

function run_dev_tools() {
    reload(__dirname)
}

exports.run_dev_tools = run_dev_tools