
//@ts-check
'use strict';
const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const fs = require('fs');
const { logging } = require('../config')


const {logDir, loglevel, logFile} = logging

fs.existsSync(logDir) || fs.mkdirSync(logDir);


const errorFormatter = winston.format(info => {
    if(info.error) info.error = info.error.toString()
    return info
});

const createLogger = (dirname) => {
    return winston.createLogger({
        format: winston.format.combine(
            winston.format.timestamp(),
            errorFormatter(),
            winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label', 'requestId'] }),
            //winston.format.errors({ stack: true }),
            winston.format.json(),
        ) ,
        levels: winston.config.syslog.levels,
        transports: [
            new winston.transports.Console({
                level: loglevel,
            }),
            new DailyRotateFile({
                dirname: `${logDir}/${dirname}`,
                filename: `${logFile}_%DATE%.log`,
                datePattern: 'YYYY-MM-DD',
                level: loglevel,
                zippedArchive: true,
            })
        ]
    })
}


module.exports = createLogger(`main_app`)
module.exports.createLogger = createLogger