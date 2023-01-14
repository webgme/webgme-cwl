/*
This version of hello world expects that in its own directory
the 'input.txt' file exists.
It is going to write an output.txt with either the words
'Hello World!' or returns with a non-zero exit code and 
logs that it was missing files...
*/

const fs = require('fs');

try {
    if(fs.existsSync('input.txt')) {
        fs.writeFileSync('output.txt','Hello World!', 'utf8');
        process.exit(0);
    } else {
        throw new Error('There is no input.txt in the active directory!');
    }
} catch (e) {
    console.error(e);
    process.exit(1);
}