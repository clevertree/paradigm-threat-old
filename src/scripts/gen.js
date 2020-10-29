const { resolve } = require('path');
const fs = require('fs');
const path = require('path');
const { readdir } = fs.promises;

const PATH_FILES = path.resolve(__dirname, '../../public/files');
const PATH_SRC = path.resolve(__dirname, '../../src');
const PATH_INDEX_FILE = PATH_FILES + '/index.json';
const PATH_TOUCH_FILE = PATH_SRC + '/touch.js';
const PATH_IGNORE = ['.', '..', '.git', '.idea', 'bower_components', 'node_modules', 'www', 'platforms'];
const FILE_MATCH = ['.jpg', '.jpeg', '.png', '.md', '.m4v', '.mp4', '.pdf', 'stats.json'];
let indexJSON = [];

async function start() {
    console.log("Starting file generation");
    try {
        indexJSON = JSON.parse(fs.readFileSync(PATH_INDEX_FILE, 'utf8'));

    } catch (e) {
        console.error(e);
    }

    indexJSON = [];
    await processAll();

    fs.writeFileSync(PATH_INDEX_FILE, JSON.stringify(indexJSON, null, "\t"), 'utf8');
    fs.writeFileSync(PATH_TOUCH_FILE, `
    const Touch = ${new Date().getTime()};
    export default Touch;
`);
}

let watchTimeout = null;
async function watch() {

    for await (const fileDirectory of getDirectories(PATH_FILES)) {
        console.log("Watching ", fileDirectory);

        // eslint-disable-next-line no-loop-func
        fs.watch(fileDirectory, function (event, filename) {
            // console.log(event, fileDirectory, filename);
            clearTimeout(watchTimeout);
            watchTimeout = setTimeout(start, 500);
        });
    }
}

async function processAll() {
    for await (const filePath of getFiles(PATH_FILES)) {
        const fileName = filePath.split('/').pop().toLowerCase();
        let matched = false;
        for(const match of FILE_MATCH) {
            if(fileName.endsWith(match))
                matched = true;
        }
        if(!matched)
            continue;
        let relativeFilePath = filePath.replace(PATH_FILES + '/', '');
        // relativeFilePath = relativeFilePath.substr(2);
        indexJSON.push(relativeFilePath);
        // console.log(relativeFilePath);
    }

}

start()
    .then(watch)

async function* getFiles(dir) {
    const dirents = await readdir(dir, { withFileTypes: true });
    for (const dirent of dirents) {
        const res = resolve(dir, dirent.name);
        if (dirent.isDirectory()) {
            if(PATH_IGNORE.indexOf(dirent.name) === -1) {
                yield* getFiles(res);
            }
        } else {
            yield res;
        }
    }
}
async function* getDirectories(dir) {
    const dirents = await readdir(dir, { withFileTypes: true });
    for (const dirent of dirents) {
        const res = resolve(dir, dirent.name);
        if (dirent.isDirectory()) {
            if(PATH_IGNORE.indexOf(dirent.name) === -1) {
                yield res;
                yield* getDirectories(res);
            }
        }
    }
}
// if(flc.endsWith('.jpg')
//     || flc.endsWith('.jpeg')
//     || flc.endsWith('.png')
//     || flc.endsWith('.bpm')) {
//     await processImage(category, filename);
// } else if(flc.endsWith('.mp4')
//     || flc.endsWith('.m4v')) {
//     await processVideo(category, filename);
// } else if(flc.endsWith('.pdf')) {
//     await processPDF(category, filename);
// } else if(flc.endsWith('.js')
//     || flc.endsWith('.html')
//     || flc.endsWith('.css')
//     || flc.endsWith('.json')
//     || flc.endsWith('.ico')
//     || flc.endsWith('.webp')
//     || flc.endsWith('.gitignore')) {
// } else {
//     await processFile(category, filename);
// }