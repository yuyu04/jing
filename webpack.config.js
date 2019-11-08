const path = require('path');
const buildUtil = require('./build/buildUtil');
const webpack = require('webpack');
const JavaScriptObfuscator = require('webpack-obfuscator');
const OBFCONFIG = require('./build/obfuscate-config');
const SDKOBFCONFIG = require('./build/sdk-obfuscate-config');
const MinifyPlugin = require('babel-minify-webpack-plugin');

const ifaces = require('os').networkInterfaces();
let address;
Object.keys(ifaces).forEach(dev => {
    ifaces[dev].filter(details => {
        if (details.family === 'IPv4' && details.internal === false) {
            address = details.address;
        }
    });
});

const VIDEOJS_VERSION = buildUtil.get_videojs_version();

const DIST_PATH = path.resolve(__dirname, 'dist');

const PLAYER = {
    VIDEOJS: {},
    SHAKA: {}
};

PLAYER.VIDEOJS = {
    ENTRY: './src/wrapper/videojs-injector.js',
    TARGET_PATH: DIST_PATH + '/videojs',
    IMPORT_SRC: 'video.js/dist/alt/video.core',
    IMPORT_SRC_FULL: 'video.js',
    NML_FILENAME: 'video_' + VIDEOJS_VERSION,
    DBG_FILENAME: 'video' + '.debug.js',
    MIN_FILENAME: 'video_' + VIDEOJS_VERSION + '.min.js',
    OBF_FILENAME: 'video_' + VIDEOJS_VERSION + '.obf.js'
};

PLAYER.SHAKA = {
    ENTRY: './src/wrapper/shakaplayer-injector.js',
    TARGET_PATH: DIST_PATH + '/shaka',
    IMPORT_SRC: 'shaka-player/dist/shaka-player.ui',
    DBG_FILENAME: 'shaka-player.ui.debug.js'
};

SDK = {
    ENTRY: './src/SDK/index.js',
    TARGET_PATH: DIST_PATH + '/sdk',
    DBG_FILENAME: 'pallyconWatermarkSdk' + '.debug.js',
    OBF_FILENAME: 'pallyconWatermarkSdk' + '.obf.js'
};

const config = {
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            }
        ]
    },
    mode: 'production',
};

const videojsCoreDebugBundle = Object.assign({}, config, {
    mode: 'development',
    entry: PLAYER.VIDEOJS.ENTRY,
    output: {
        path: PLAYER.VIDEOJS.TARGET_PATH,
        filename: PLAYER.VIDEOJS.DBG_FILENAME
    },
    devtool: 'source-map',
    devServer: {
        port: 8282,
        hot: true,
        inline: true,
        host: address,
        open: true,
        headers: {
            "Access-Control-Allow-Origin": "*"
        }
    },
    plugins: [
        new webpack.ProvidePlugin({'videojs': PLAYER.VIDEOJS.IMPORT_SRC})
    ]
});

const videojsCoreBundle = Object.assign({}, config, {
    entry: PLAYER.VIDEOJS.ENTRY,
    output: {
        path: PLAYER.VIDEOJS.TARGET_PATH,
        filename: PLAYER.VIDEOJS.NML_FILENAME + '.js'
    },
    devServer: {
        port: 8282,
        hot: true,
        inline: true,
        host: address,
        open: true,
        headers: {
            "Access-Control-Allow-Origin": "*"
        }
    },
    plugins: [
        new webpack.ProvidePlugin({'videojs': PLAYER.VIDEOJS.IMPORT_SRC})
    ]
});

const videojsCoreMinBundle = Object.assign({}, config, {
    entry: PLAYER.VIDEOJS.ENTRY,
    output: {
        path: PLAYER.VIDEOJS.TARGET_PATH,
        filename: PLAYER.VIDEOJS.MIN_FILENAME
    },
    plugins: [
        new MinifyPlugin({
                simplify: true,
                evaluate: false,
                mangle: true
            }, {exclude: []}
        ),
        new webpack.ProvidePlugin({'videojs': PLAYER.VIDEOJS.IMPORT_SRC})
    ]
});

const videojsFullObfBundle = Object.assign({}, config, {
    entry: PLAYER.VIDEOJS.ENTRY,
    output: {
        path: PLAYER.VIDEOJS.TARGET_PATH,
        filename: PLAYER.VIDEOJS.OBF_FILENAME
    },
    plugins: [
        new webpack.ProvidePlugin({'videojs': PLAYER.VIDEOJS.IMPORT_SRC_FULL}),
        new JavaScriptObfuscator(OBFCONFIG, [])
    ]
});

const videojsCoreObfBundle = Object.assign({}, config, {
    entry: PLAYER.VIDEOJS.ENTRY,
    output: {
        path: PLAYER.VIDEOJS.TARGET_PATH,
        filename: PLAYER.VIDEOJS.OBF_FILENAME
    },
    devServer: {
        port: 8282,
        hot: true,
        inline: true,
        host: address,
        open: true,
        headers: {
            "Access-Control-Allow-Origin": "*"
        }
    },
    plugins: [
        new webpack.ProvidePlugin({'videojs': PLAYER.VIDEOJS.IMPORT_SRC}),
        new JavaScriptObfuscator(OBFCONFIG, [])
    ]
});

const shakaDebugBundle = Object.assign({}, config, {
    mode: 'development',
    devtool: 'source-map',
    entry: PLAYER.SHAKA.ENTRY,
    output: {
        path: PLAYER.SHAKA.TARGET_PATH,
        filename: PLAYER.SHAKA.DBG_FILENAME
    },
    plugins: [
        new webpack.ProvidePlugin({'shaka': PLAYER.SHAKA.IMPORT_SRC})
    ]
});

const sdkDebugBundle = Object.assign({}, config, {
    mode: 'development',
    devtool: 'source-map',
    entry: SDK.ENTRY,
    output: {
        path: SDK.TARGET_PATH,
        filename: SDK.DBG_FILENAME,
        libraryTarget: 'var',
        library: 'PallyconWatermarkSdk'
    }
});

const sdkBundle = Object.assign({}, config, {
    mode: 'development',
    devtool: 'source-map',
    entry: SDK.ENTRY,
    output: {
        path: SDK.TARGET_PATH,
        filename: SDK.OBF_FILENAME,
        libraryTarget: 'var',
        library: 'PallyconWatermarkSdk'
    },
    plugins: [
        new JavaScriptObfuscator(SDKOBFCONFIG, [])
    ]
});

module.exports = [
    videojsCoreDebugBundle,
    videojsCoreBundle,
    // videojsCoreMinBundle,
    // videojsFullObfBundle,
    videojsCoreObfBundle,

    shakaDebugBundle,

    sdkDebugBundle,
    sdkBundle
];
