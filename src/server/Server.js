import fs from "fs";
import express from "express";
import path from "path";
import {JSDOM} from "jsdom";

const BUILD_INDEX = path.resolve(__dirname, '../../build');
const BUILD_FILES = path.resolve(__dirname, '../../files');
// const BUILD_FILES = path.resolve(BUILD_INDEX, 'files');


export default class Server {
    constructor() {
        const app = express();
        this.app = app;

        app.use(function(req, res, next) {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            res.header('Access-Control-Allow-Headers', 'Content-Type');

            next();
        });

        app.use(express.static(BUILD_INDEX));
        app.use(express.static(BUILD_FILES));

        const fileRootHTMLPath = path.resolve(BUILD_INDEX, 'index.html');
        app.use((req, res) => {
            let indexHTML = fs.readFileSync(fileRootHTMLPath, 'utf8');

            const pathStats = path.resolve(BUILD_FILES + req.path, 'stats.json');
            const pathIndexMD = path.resolve(BUILD_FILES + req.path, 'index.md');
            if(fs.existsSync(pathStats)) {
                const statsJSON = JSON.parse(fs.readFileSync(pathStats, 'utf8'));
                indexHTML = updateMetaTagsJSON(req, indexHTML, statsJSON)
                // console.log('Directory stats found: ', req.path, pathStats);
            } else if(fs.existsSync(pathIndexMD)) {
                const markdownHTML = fs.readFileSync(pathIndexMD, 'utf8');
                indexHTML = updateMetaTagsMD(req, indexHTML, markdownHTML)
                // console.log('Directory index found: ', req.path, pathIndexMD);
            } else {
                // console.log('File stats not found: ', req.path, fileStats);
            }
            // console.log('404', req.path, fileStats, statsJSON);

            res.send(indexHTML);
            // res.sendFile('index.html', {root: BUILD_FILES })
        })

    }

    listen(httpPort = 8070) {
        this.app.listen(httpPort, function() {
            console.log('Paradigm Threat Server listening on port: ' + httpPort);
        });

    }
}


function updateMetaTagsJSON(req, indexHTML, statsJSON) {
    const DOM = new JSDOM(indexHTML);
    const document = DOM.window.document;

    if(statsJSON && statsJSON.meta) {
        for (const [key, content] of Object.entries(statsJSON.meta)) {
            let paramName = 'name';
            if(key.startsWith('og:'))
                paramName = 'property';
            updateMetaTags(document, paramName, key, content);

        }
    }

    return DOM.serialize();

}

function updateMetaTagsMD(req, indexHTML, markdownHTML) {
    const DOM = new JSDOM(indexHTML);
    const document = DOM.window.document;
    const MDDOM = new JSDOM(markdownHTML);
    const documentMD = MDDOM.window.document;

    const metaList = documentMD.querySelectorAll('meta');
    console.log(metaList);

    for(const metaTag of metaList) {
        let paramName = metaTag.hasAttribute('property') ? 'property' : 'name';
        const key = metaTag.getAttribute(paramName);
        const content = metaTag.content;
        updateMetaTags(document, paramName, key, content);
    }


    return DOM.serialize();

}

function updateMetaTags(document, paramName, key, content) {

    // TODO: fix meta tags on navigation
    switch(key) {
        case 'title':
            document.title = content;
            break;
        default:
            let elm = document.head.querySelector(`meta[${paramName}="${key}"]`)
            if(!elm) {
                elm = document.createElement('meta');
                elm[paramName] = key;
                document.head.appendChild(elm);
            }
            elm.content = content;
            break;
    }
}