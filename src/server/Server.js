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

        const fileIndex = path.resolve(BUILD_INDEX, 'index.html');
        app.use((req, res) => {
            const fileStats = path.resolve(BUILD_FILES + req.path, 'stats.json');
            let statsJSON = {};
            let indexHTML = fs.readFileSync(fileIndex, 'utf8');
            if(fs.existsSync(fileStats)) {
                statsJSON = JSON.parse(fs.readFileSync(fileStats, 'utf8'));
                const DOM = new JSDOM(indexHTML);
                updateMetaTags(req, DOM.window.document, statsJSON)
                indexHTML = DOM.serialize();
                // console.log('File stats found: ', req.path, fileStats, statsJSON);
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


function updateMetaTags(req, document, indexStats) {
    if(indexStats && indexStats.meta) {
        for (const [key, value] of Object.entries(indexStats.meta)) {
            let paramName = 'name';
            if(key.startsWith('og:'))
                paramName = 'property';
            switch(key) {
                case 'title':
                    document.title = value;
                    break;
                default:
                    let elm = document.head.querySelector(`meta[${paramName}="${key}"]`)
                    if(!elm) {
                        elm = document.createElement('meta');
                        elm[paramName] = key;
                        document.head.appendChild(elm);
                    }
                    elm.content = value;
                    break;
            }
        }
    }
}