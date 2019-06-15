const { FuseBox, WebIndexPlugin, CSSPlugin } = require("fuse-box");
const workboxBuild = require('workbox-build');
const fs = require("fs");
const pwaManifest = require('@pwa/manifest');

const isProd = process.argv.slice(2)[0] === 'build';

const targDir= (isProd)?'build':'dev';

const fuse = FuseBox.init({
    homeDir : "src",
    target : 'browser@es6',
    output : `${targDir}/$name.js`,
    allowSyntheticDefaultImports: true,
    plugins : [
        WebIndexPlugin({
            template:'src/index.html',
            useTypescriptCompiler: true
        }),
        [
            CSSPlugin({
                group:'bundle.css',
                outFile:`${targDir}/bundle.css`,
            }),
        ]
    ]
});

if(!isProd){
    fuse.dev(); // launch http server
    fuse.bundle("app").instructions(" > index.js").hmr({reload:true}).watch();
}
else {
    fuse.bundle("app").instructions(" > index.js");
}

let fc = fuse.run();



fc.then(()=>{
    workboxBuild.injectManifest({
        swSrc: 'src/sw.js',
        swDest: `${targDir}/sw.js`,
        globDirectory: targDir,
        globPatterns: [
            '**\/*.{js,css,html,png}',
        ]
    }).then(({count, size, warnings}) => {
        console.log(`${count} files will be precached, totaling ${size} bytes.`);
    });
});

pwaManifest({
    name: 'Agora Video Call',
    short_name: 'Agora PWA',
    start_url: '/index.html',
    display: 'standalone',
    icons: [{
        "src": "https://i.ibb.co/pJ2MWmd/pwa-192x192.png",
        "sizes": "192x192",
        "type": "image/png"
    }, {
        "src": "https://i.ibb.co/6WPTq6Z/pwa-512x512.png",
        "sizes": "512x512",
        "type": "image/png"
    }],
    // background_color: '#0400ef',
    theme_color: '#317EFB'
}).then(manifest=>{
    pwaManifest.write(targDir, manifest)
});