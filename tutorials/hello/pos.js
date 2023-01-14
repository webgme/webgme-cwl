/*
This version of hello world expects two positional arguments.
the first one should be a string that will be concatenated
to the hello world message, while the second should be a file
that will be simply checked for existence.
The result will once again be an output.tx with the leading
'Hello World!' and the input string, while in case of an issue
the exit code will be non-zero and the error will be logged
onto the screen of the user.
*/
const fs = require('fs');
const args = process.argv;
try {
    if(args.length !== 4) {
        throw new Error('The number of input arguments mismatch!');
    }
    const text = args[2];
    const path = args[3];
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

