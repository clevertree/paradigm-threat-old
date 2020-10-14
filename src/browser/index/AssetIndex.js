import {browserIndexURL} from "../../config.json";

let indexJSON = [];
export default class AssetIndex  {


    async getPathFiles(currentPath='/') {
        if(currentPath.substr(-1, 1) !== '/')
            currentPath += '/';
        const indexJSON = await indexJSONPromise;
        const stats = {
            files: [],
            directories: [],
            indexFile: null
        }
        for (const filePath of indexJSON) {
            let relativeFilePath = filePath;
            if (!filePath.startsWith(currentPath))
                continue;
            relativeFilePath = filePath.replace(currentPath, '');
            if(relativeFilePath.indexOf('/') === -1) {
                if(relativeFilePath === 'index.md') {
                    stats.indexFile = relativeFilePath;
                } else {
                    stats.files.push(filePath);
                }
            } else {
                const directory = filePath.split('/').slice(0, -1).join('/') //  relativeFilePath.split('/').shift();
                if (stats.directories.indexOf(directory) === -1)
                    stats.directories.push(directory);
            }
        }
        stats.directories.sort();
        stats.files.sort();
        console.log('stats', stats);
        return stats;
    }

    async getDirectories(currentPath='/') {
        const {directories} = await this.getPathFiles(currentPath);
        // console.log('directories', directories);
        return directories;
    }

}

const indexJSONPromise = (async function() {
    const response = await fetch(browserIndexURL);
    indexJSON = await response.json();
    return indexJSON;
})();