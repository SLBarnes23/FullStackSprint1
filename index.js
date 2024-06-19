global.DEBUG = true;

const fs = require('fs');

const myArgs = process.argv.slice(2); // Skip the first two arguments

if (DEBUG) {
    if (myArgs.length >= 1) console.log('myArgs: ', myArgs);
}

switch (myArgs[0]) {
    case 'init':
    case 'i':
        if (DEBUG) console.log(myArgs[0], '- init the app.');
        break;
    case 'config':
    case 'c':
        if (DEBUG) console.log(myArgs[0], '- create the config folders and files.');
        break;
    case 'token':
    case 't':
        if (DEBUG) console.log(myArgs[0], '- manage the tokens.');
        break;
    case '--help':
    case '--h':
    default:
        if (DEBUG) console.log(myArgs[0], '- display help');
        // Read the help file
        fs.readFile('help.txt', 'utf8', (err, data) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    console.error('Help file not found. Please create a help.txt file.');
                } else {
                    console.error('Error reading help file:', err);
                }
                return;
            }
            console.log(data);
        });
        break;
}
