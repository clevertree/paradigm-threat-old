import ServerConfig from "../../server/ServerConfig";

const serverConfig = new ServerConfig();
const browserIndexURL = serverConfig.getIndexURL();
const siteJSONURL = serverConfig.getIndexURL('site.json');

export default class AssetIndex  {

    async getDirectories() {
        const indexJSON = await indexJSONPromise;
        const directories = [];
        for (const filePath of indexJSON) {
            const directory = filePath.split('/').slice(0, -1).join('/') //  relativeFilePath.split('/').shift();
            if (directory && directories.indexOf(directory) === -1) {
                directories.push(directory);
            }
        }
        directories.sort();
        return directories;
    }

    async getPathFiles(currentPath='/') {
        if(currentPath.substr(-1, 1) !== '/')
            currentPath += '/';
        const indexJSON = await indexJSONPromise;
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
        console.log('stats', stats.files, stats.indexStats, stats.indexFile);
        return stats;
    }

    async getPathStats(statsPath) {

        const url = new URL('.' + statsPath, browserIndexURL).toString();
        const response = await fetch(url);
        const indexStats = await response.json();
        if(indexStats && indexStats.meta) {
            for (const [key, value] of Object.entries(indexStats.meta)) {
                switch(key) {
                    case 'og:image':
                        indexStats.meta[key] = new URL('.' + value, browserIndexURL).toString();
                        break;
                    default:
                }
            }
        }
        return indexStats;
    }

    async getHitCounter() {
        return (await indexSiteJSONPromise).hits;
    }
    
}

const indexJSONPromise = (async function() {
    const response = await fetch(browserIndexURL);
    return await response.json();
})();

const indexSiteJSONPromise = (async function() {
    const response = await fetch(siteJSONURL);
    return await response.json();
})();