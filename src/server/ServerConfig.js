import config from "../config.json";

const __DEV__ = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

export default class ServerConfig {
    getIndexURL() {
        let url = config.browserIndexURL;
        if(__DEV__ && config.dev)
            url = config.dev.browserIndexURL;
        url = new URL(url, document.location.origin);
        return url.toString();
    }
}
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    console.log('process.env.NODE_ENV', process.env.NODE_ENV)
    // dev code
} else {
    // production code
}