import React from 'react';
import ReactDOM from 'react-dom';
import ReactRouter from './router/Router';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<ReactRouter />, document.getElementById('root'));
registerServiceWorker();


if (!window.location.host.startsWith("www")){
        // Don't blindly prefix IP addresses or 'localhost' with 'www.' — that produces invalid URLs
        // Use hostname (no port) and only redirect when hostname is a DNS name we can safely prefix.
        const hostname = window.location.hostname; // excludes port
        const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0';
        const isIPv4 = /^\d{1,3}(?:\.\d{1,3}){3}$/.test(hostname);
        if (!hostname.startsWith('www') && !isLocalhost && !isIPv4) {
            const port = window.location.port ? ':' + window.location.port : '';
            window.location.href = `${window.location.protocol}//www.${hostname}${port}${window.location.pathname}${window.location.search}${window.location.hash}`;
        }
}