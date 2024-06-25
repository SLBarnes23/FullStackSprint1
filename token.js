const fs = require('fs');
const path = require('path');
const crc32 = require('crc/crc32');
const { format } = require('date-fns');

const myArgs = process.argv.slice(2);

const DEBUG = true; // Ensure DEBUG is set to true
const tokensFilePath = path.join(__dirname, 'json', 'tokens.json');

// Initial debug statement to verify the script is running
if (DEBUG) console.log('Debug mode is ON');
if (DEBUG) console.log('Command-line arguments:', myArgs);

// Ensure the tokens.json file exists and is initialized with an empty array if it doesn't exist
if (!fs.existsSync(tokensFilePath)) {
    fs.writeFileSync(tokensFilePath, '[]', 'utf-8');
    if (DEBUG) console.log('tokens.json file created.');
} else {
    if (DEBUG) console.log('tokens.json file exists.');
}

function listTokens() {
  if (DEBUG) console.log('token.listTokens()');

  fs.readFile(tokensFilePath, 'utf-8', (error, data) => {
      if (error) {
          console.log('Error reading tokens.json:', error);
          throw error;
      }
      let tokens = JSON.parse(data);
      console.log(tokens);
  });
}


function searchUser(query) {
    if (DEBUG) console.log('token.searchUser()');

    fs.readFile(tokensFilePath, 'utf-8', (error, data) => {
        if (error) throw error;
        let tokens = JSON.parse(data);
        let results = tokens.filter(u => u.username.includes(query) || u.email.includes(query) || u.phone.includes(query));
        console.log(results);
    });
}

function updateUser(username, email, phone) {
    if (DEBUG) console.log('token.updateUser()');
    fs.readFile(tokensFilePath, 'utf-8', (error, data) => {
        if (error) {
            console.log('Error reading tokens.json:', error);
            throw error;
        }
        if (DEBUG) console.log('tokens.json read successfully.');

        let tokens = JSON.parse(data);
        if (DEBUG) console.log(`Current tokens: ${JSON.stringify(tokens)}`);

        let user = tokens.find(u => u.username === username);
        if (user) {
            if (DEBUG) console.log(`User found: ${JSON.stringify(user)}`);
            if (email) user.email = email;
            if (phone) user.phone = phone;

            let updatedTokens = JSON.stringify(tokens, null, 2); // Pretty-print with 2-space indentation
            if (DEBUG) console.log(`Updated tokens: ${updatedTokens}`);

            fs.writeFile(tokensFilePath, updatedTokens, (err) => {
                if (err) {
                    console.log('Error writing to tokens.json:', err);
                } else {
                    console.log(`User ${username}'s details updated.`);
                    if (DEBUG) console.log(`Updated user: ${JSON.stringify(user)}`);
                }
            });
        } else {
            console.log(`User ${username} not found.`);
        }
    });
}

function newToken(username) {
    if (DEBUG) console.log('token.newToken()');
    let newToken = {
        "created": "1969-01-31 12:30:00",
        "username": "username",
        "email": "user@example.com",
        "phone": "5556597890",
        "token": "token",
        "expires": "1969-02-03 12:30:00",
        "confirmed": "tbd"
    };

    let now = new Date();
    let expires = addDays(now, 3);

    newToken.created = `${format(now, 'yyyy-MM-dd HH:mm:ss')}`;
    newToken.username = username;
    newToken.token = crc32(username).toString(16);
    newToken.expires = `${format(expires, 'yyyy-MM-dd HH:mm:ss')}`;

    fs.readFile(tokensFilePath, 'utf-8', (error, data) => {
        if (error) throw error;
        let tokens = JSON.parse(data);
        tokens.push(newToken);
        let userTokens = JSON.stringify(tokens, null, 2); // Pretty-print with 2-space indentation

        fs.writeFile(tokensFilePath, userTokens, (err) => {
            if (err) console.log(err);
            else {
                console.log(`New token ${newToken.token} was created for ${username}.`);
            }
        });
    });
    return newToken.token;
}

var tokenCount = function() {
    if (DEBUG) console.log('token.tokenCount()');
    return new Promise(function (resolve, reject) {
        fs.readFile(tokensFilePath, 'utf-8', (error, data) => {
            if (error)
                reject(error);
            else {
                let tokens = JSON.parse(data);
                let count = Object.keys(tokens).length;
                console.log(`Current token count is ${count}.`);
                resolve(count);
            };
        });
    });
};

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function tokenApplication() {
    if (DEBUG) console.log('tokenApplication()');

    if (myArgs.length < 2) {
        console.log('invalid syntax. node myapp <command> <options>');
        return;
    }

    switch (myArgs[0]) {
        case 'token':
            switch (myArgs[1]) {
                case '--count':
                    if (DEBUG) console.log('--count');
                    tokenCount();
                    break;
                case '--list':
                    if (DEBUG) console.log('--list');
                    listTokens();
                    break;
                case '--new':
                    if (myArgs.length < 3) {
                        console.log('invalid syntax. node myapp token --new [username]');
                    } else {
                        if (DEBUG) console.log('--new');
                        newToken(myArgs[2]);
                    }
                    break;
                case '--update-user':
                    if (myArgs.length < 4) {
                        console.log('invalid syntax. node myapp token --update-user [username] [email] [phone]');
                    } else {
                        if (DEBUG) console.log('--update-user');
                        updateUser(myArgs[2], myArgs[3], myArgs[4]);
                    }
                    break;
                case '--search-user':
                    if (myArgs.length < 3) {
                        console.log('invalid syntax. node myapp token --search-user [query]');
                    } else {
                        if (DEBUG) console.log('--search-user');
                        searchUser(myArgs[2]);
                    }
                    break;
                default:
                    console.log('Invalid command for token. Use --help for more information.');
            }
            break;
        case '--help':
        case '--h':
        default:
            fs.readFile(path.join(__dirname, 'usage.txt'), 'utf-8', (error, data) => {
                if (error) throw error;
                console.log(data.toString());
            });
    }
}

module.exports = {
    tokenApplication,
    newToken,
    tokenCount,
    updateUser,
    searchUser,
    listTokens,
}

// Ensure tokenApplication is called if script is executed directly
if (require.main === module) {
    tokenApplication();
}
