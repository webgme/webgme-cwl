/*
This version of hello world expects two named arguments.
One argument is '-s' and the value is a string, while the
second one is '-f' where the value should be the path of
a file to be checked. The string input will be used to extend
the starting 'Hello World!' in the result file.
The result will once again be an output.tx with the leading
'Hello World!' and the input string, while in case of an issue
the exit code will be non-zero and the error will be logged
onto the screen of the user.
*/
const fs = require('fs');
const args = process.argv;
try {
    if(args.length !== 6) {
        throw new Error('The number of input arguments mismatch!');
    }
    if(args.indexOf('-s') === -1 || args.indexOf('-s') === args.length - 1) {
        throw new Error ('The string [-s] argument is missing!');
    }
    if(args.indexOf('-f') === -1 || args.indexOf('-s') === args.length - 1) {
        throw new Error ('The file [-f] argument is missing!');
    }
    const text = args[args.indexOf('-s') + 1];
    const path = args[args.indexOf('-f') + 1];
    if(fs.existsSync(path)) {
        fs.writeFileSync('output.txt', 'Hello World!\n' + text, 'utf8');
        process.exit(0);
    } else {
        throw new Error('The input file cannot be validated!');
    }
} catch (e) {
    console.error(e);
    process.exit(1);
}