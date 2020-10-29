import config from "../config.json";

const __DEV__ = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

export default class ServerConfig {
    getIndexURL() {
        return this.getURL('/index.json');
    }

    getURL(filePath=null) {
        let url = config.browserIndexURL;
        if(__DEV__ && config.dev)
            url = config.dev.browserIndexURL;
        url = new URL(url, document.location.origin).toString();
        if(filePath !== null) {
            url = new URL(filePath, url).toString();
        }
        return url;
    }
}
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    console.log('process.env.NODE_ENV', process.env.NODE_ENV)
    // dev code
} else {
    // production code
}