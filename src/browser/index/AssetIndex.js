import ServerConfig from "../../server/ServerConfig";

const serverConfig = new ServerConfig();

const FILE_INDEX_JSON = 'index.json';
const FILE_SITE_JSON = 'site/site.json';

export default class AssetIndex  {

    async getDirectories() {
        const indexURL = serverConfig.getURL(FILE_INDEX_JSON);
        const indexJSON = await this.fetchJSONFile(indexURL);
        const directories = [];
        for (const filePath of indexJSON) {
            const directory = filePath.split('/').slice(0, -1).join('/') //  relativeFilePath.split('/').shift();
            if (directory && directories.indexOf(directory) === -1) {
                directories.push(directory);
            }
        }
        directories.sort();
        // console.log('directories', directories);
        return directories;
    }

    async getPathFiles(currentPath='/') {
        if(currentPath[0] === '/')
            currentPath = currentPath.substr(1);
        if(currentPath && currentPath.substr(-1, 1) !== '/')
            currentPath += '/';
        const indexURL = serverConfig.getURL(FILE_INDEX_JSON);
        const indexJSON = await this.fetchJSONFile(indexURL);
        const stats = {
            files: [],
            indexFile: null,
            indexStats: null
        }
        for (const filePath of indexJSON) {
            // const directory = filePath.split('/').slice(0, -1).join('/') //  relativeFilePath.split('/').shift();
            // if (directory && stats.directories.indexOf(directory) === -1) {
            //     stats.directories.push(directory);
            // }

            if (!filePath.startsWith(currentPath))
                continue;
            let relativeFilePath = filePath;
            relativeFilePath = filePath.substr(currentPath.length);
            if(relativeFilePath === 'index.md') {
                stats.indexFile = filePath;
            } else if(relativeFilePath === 'stats.json') {
                try {
                    stats.indexStats = await this.getPathStats(filePath);
                } catch (e) {
                    console.error("Could not load index.json: ", e);
                }
            } else {
                if(relativeFilePath.indexOf('/') === -1) {
                    stats.files.push(filePath);
                }
            }
        }

        stats.files.sort();
        console.log('indexStats', stats);
        return stats;
    }

    async getPathStats(statsPath) {
        const statsURL = serverConfig.getURL(statsPath);
        const indexStats = this.fetchJSONFile(statsURL)
        if(indexStats && indexStats.meta) {
            for (const [key, value] of Object.entries(indexStats.meta)) {
                switch(key) {
                    case 'og:image':
                        indexStats.meta[key] = serverConfig.getURL(value);
                        break;
                    default:
                }
            }
        }
        return indexStats;
    }

    async getHitCounter() {
        const siteJSONURL = serverConfig.getURL(FILE_SITE_JSON);
        return (await this.fetchJSONFile(siteJSONURL)).hits;
    }

    async fetchJSONFile(fileURL) {
        let promise;
        if(recentPromises[fileURL]) {
            // console.log("Reusing promise: ", fileURL);
            promise = recentPromises[fileURL];
        } else {
            // console.log("Fetching: ", fileURL);
            promise = fetchJSON(fileURL);
            recentPromises[fileURL] = promise;
        }
        return await promise;
    }
}

let recentPromises = {}
setInterval(function() {
    recentPromises = {};
}, 1000 * 30);

async function fetchJSON(url) {
    const response = await fetch(url);
    return await response.json();
}