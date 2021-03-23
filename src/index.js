const mdItMermaid = require('md-it-mermaid');
const mdItFootnote = require('markdown-it-footnote');
const mdItAnchor = require('markdown-it-anchor').default;
const mdItToc = require('markdown-it-table-of-contents');
const mdItAlerts = require('markdown-it-alerts');
const mdItMath = require('markdown-it-math');
const mdItBlockEmbed = require('markdown-it-block-embed');
const md = require('markdown-it')({
    html: true,
    linkify: true
})
    .use(mdItMermaid)
    .use(mdItFootnote)
    .use(mdItAnchor)
    .use(mdItToc, {
        includeLevel: [2, 3, 4]
    })
    .use(mdItAlerts)
    .use(mdItMath)
    .use(mdItBlockEmbed, {
        containerClassName: "video-embed"
    });
const mermaid = require('mermaid');

const mdCss = require('./md.css');
const tocCss = require('./toc.css');
import 'bootstrap/dist/css/bootstrap.min.css';

const queryPramMdPath = 'mdpath';

function getQueryParams() {
    let result = {};
    const search = location.search;
    const params = search.substring(1).split('&');
    for (const param of params) {
        const temp = param.split('=');
        result[temp[0]] = temp[1];
    }
    return result;
}

function hasSheme(url) {
    return url.search(/^[a-z][a-z0-9\+\-\.]*:\/\//i) !== -1;
}

function isMarkdownFile(url) {
    const end = url.search(/[\?#]/);
    if (end === -1) {
        return url.search(/\.md?/i) !== -1;
    }
    return url.substring(0, end).search(/\.md?/i) !== -1;
}

function isDirectory(url) {
    if (url === '.' || url === '..') {
        return true;
    }

    const end = url.search(/[\?#]/);
    let temp = '';
    if (end === -1) {
        temp = url;
    }
    else {
        temp = url.substring(0, end);
    }

    const result = temp.match(/\/[^\/]*$/i);
    if (result && result[0]) {
        return result[0].indexOf('.') === -1;
    }
    return temp.indexOf('.') === -1;
}

function resolvePath(path) {
    const pathes = path.split('/');
    const temp = new Array();
    if (pathes) {
        for (const str of pathes) {
            if (str === '' || str ==='.') {
                continue;
            }
            if (str === '..') {
                if (temp.length === 0) {
                    console.log("resolvePath error", path);
                    return path;
                }
                temp.pop();
            }
            else {
                temp.push(str);
            }
        }
    }

    let newPath = './';
    for (const str of temp) {
        newPath += str + '/';
    }
    return newPath.substring(0, newPath.length - 1);
}

(function () {
    const divId = 'contents';

    document.getElementById(divId).innerText = 'now loading';

    const params = getQueryParams();
    if (params[queryPramMdPath] === undefined) {
        params[queryPramMdPath] = './index.md';
    }

    const request = new XMLHttpRequest();
    request.open('GET', params[queryPramMdPath]);
    request.setRequestHeader('Content-Type', 'text/markdown');
    request.onload = function (e) {
        // render
        document.getElementById(divId).innerHTML = md.render(request.response);
        mermaid.init();

        // overwrite title
        const h1Tags = Array.from(document.getElementsByTagName('h1'));
        if (h1Tags.length > 0) {
            document.getElementsByTagName('title')[0].innerText = h1Tags[0].innerText;
        }

        // scroll to hash
        if (location.hash) {
            window.scroll(0, 0);
            const tag = document.getElementById(location.hash.substring(1));
            if (tag) {
                window.scroll(0, tag.offsetTop);
            }
        }

        // overwite a tag href
        const aTags = Array.from(document.getElementsByTagName('a'));
        for (const aTag of aTags) {
            const originalHref = aTag.getAttribute('href')
            if (hasSheme(originalHref)) {
                continue;
            }
            if (!isMarkdownFile(originalHref) && !isDirectory(originalHref)) {
                continue;
            }

            const matchResult = originalHref.match(/([^\?#]*)(\?[^#]*)?(#.*)?/i);
            if (matchResult && matchResult[1]) {
                const currentPath = params[queryPramMdPath].substring(0, params[queryPramMdPath].lastIndexOf('/') + 1);

                let newHref = location.pathname + '?' + queryPramMdPath + '=' + resolvePath(currentPath + matchResult[1]);

                if (isDirectory(originalHref)) {
                    newHref += '/index.md';
                }

                if (matchResult[2]) {
                    newHref += '&' + matchResult[2].substring(1);
                }

                if (matchResult[3]) {
                    newHref += matchResult[3];
                }

                aTag.href = newHref;
            }
        }

        // overwrite ims tag src
        const imgTags = Array.from(document.getElementsByTagName('img'));
        for (const imgTag of imgTags) {
            const originalSrc = imgTag.getAttribute('src');
            if (hasSheme(originalSrc)) {
                continue;
            }

            console.log('-----')
            console.log(originalSrc);

            const currentPath = params[queryPramMdPath].substring(0, params[queryPramMdPath].lastIndexOf('/') + 1);
            const newSrc = resolvePath(currentPath + '/' + originalSrc);
            console.log(newSrc);

            imgTag.setAttribute('src', newSrc);
        }
    };
    request.send();
})();