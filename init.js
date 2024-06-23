const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const myArgs = process.argv.slice(2);

const folders = ['models', 'views', 'routes', 'logs', 'json'];

const configjson = {
    name: 'AppConfigCLI',
    version: '1.0.0',
    description: 'The Command Line Interface (CLI) for the MyApp.',
    main: 'myapp.js',
    superuser: 'admin',
    database: 'exampledb'
};

async function createFiles() {
    if (DEBUG) console.log('init.createFiles()');
    try {
        let configdata = JSON.stringify(configjson, null, 2);
        const configPath = path.join(__dirname, './json/config.json');
        if (!fs.existsSync(configPath)) {
            await fsPromises.writeFile(configPath, configdata);
            console.log('Data written to config file.');
        } else {
            console.log('Config file already exists');
        }
    } catch (err) {
        if (err.code === 'ENOENT') {
            console.log('No file or directory');
        } else {
            console.log(err);
        }
    }
}

async function createFolders() {
    if (DEBUG) console.log('init.createFolders()');
    let mkcount = 0;
    for (const folder of folders) {
        if (DEBUG) console.log(folder);
        try {
            const folderPath = path.join(__dirname, folder);
            if (!fs.existsSync(folderPath)) {
                await fsPromises.mkdir(folderPath);
                mkcount++;
            }
        } catch (err) {
            console.log(err);
        }
    }
    if (mkcount === 0) {
        console.log('All folders already exist.');
    } else if (mkcount <= folders.length) {
        console.log(mkcount + ' of ' + folders.length + ' folders were created.');
    } else {
        console.log('All folders successfully created.');
    }
}

function initializeApplication() {
    if (DEBUG) console.log('initializeApplication()');

    switch (myArgs[1]) {
        case '--all':
            if (DEBUG) console.log('--all createFolders() & createFiles()');
            createFolders().then(createFiles);
            break;
        case '--cat':
            if (DEBUG) console.log('--cat createFiles()');
            createFiles();
            break;
        case '--mk':
            if (DEBUG) console.log('--mk createFolders()');
            createFolders();
            break;
        case '--help':
        case '--h':
        default:
            fs.readFile(path.join(__dirname, 'usage.txt'), (error, data) => {
                if (error) throw error;
                console.log(data.toString());
            });
    }
}

module.exports = { initializeApplication };
