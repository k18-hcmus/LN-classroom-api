/**
 * Remove old files, copy front-end ones.
 */

import fs from 'fs-extra';
import Logger from 'jet-logger';
import childProcess from 'child_process';
import path from 'path';

// Setup logger
const logger = new Logger();
logger.timestamp = false;

function getPath(loc: string) : string {
    return path.resolve(__dirname, loc)
}


(async () => {
    try {
        // Remove current build
        await remove(getPath('./dist/'));
        // Copy front-end files
        await copy(getPath('./src/public'), getPath('./dist/public'));
        // Copy views files
        await copy(getPath('./src/views'), getPath('./dist/views'));
        // Copy production env file
        await copy(getPath('./src/pre-start/env/production.env'), getPath('./dist/pre-start/env/production.env'));
        // Copy back-end files
        await exec('tsc --build tsconfig.prod.json', getPath('./'))
    } catch (err) {
        logger.err(err);
    }
})();


function remove(loc: string): Promise<void> {
    return new Promise((res, rej) => {
        return fs.remove(loc, (err) => {
            return (!!err ? rej(err) : res());
        });
    });
}


function copy(src: string, dest: string): Promise<void> {
    return new Promise((res, rej) => {
        return fs.copy(src, dest, (err) => {
            return (!!err ? rej(err) : res());
        });
    });
}


function exec(cmd: string, loc: string): Promise<void> {
    return new Promise((res, rej) => {
        return childProcess.exec(cmd, { cwd: loc }, (err, stdout, stderr) => {
            if (!!stdout) {
                logger.info(stdout);
            }
            if (!!stderr) {
                logger.warn(stderr);
            }
            return (!!err ? rej(err) : res());
        });
    });
}
