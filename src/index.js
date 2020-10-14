import React from 'react';
import {
    Switch,
    Route,
    useHistory,
    BrowserRouter
} from "react-router-dom";
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import AssetBrowserPage from "./browser/page/AssetBrowserPage";

const refRouter = React.createRef();
ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter
            ref={refRouter}
        >
            <Switch>
                <Route path={'/'} >
                    {props => <AssetBrowserPage fullscreen {...props}/>}
                </Route>
            </Switch>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
);

document.addEventListener('click', function(e) {
    if(e.target && e.target.nodeName.toLowerCase() === 'a') {
        e.preventDefault();
        const url = new URL(e.target.href);
        console.log('click', e.target, url);
        // let history = useHistory();
        refRouter.current.history.push(url.pathname);
    }
})



// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
