const winston = require('winston');
const path = require('path');
const fs = require('fs').promises
const constants = require('fs').constants;

module.exports = async (message,mode) => {
    const logDir = path.join(__dirname, "../logs");

    try {
    mode = mode || 'info';

    await fs.access(logDir, constants.f_OK);

    const date = new Date();

    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    month = (month < 10)?`0${month}`:month;
    let day = date.getDate();
    day = (day < 10)?`0${day}`:day;

    const filename = logDir + "/" + `${year}${month}${day}.log`;

    let hours = date.getHours();
    hours = (hours < 10)?`0${hours}`:hours;
    let mins = date.getMinutes();
    mins = (mins < 10)?`0${mins}`:mins;
    let secs = date.getSeconds();
    secs= (secs < 10)?`0${secs}`:secs;

    message = `[${hours}:${mins}:${secs}]${message}`;

    const logger = winston.createLogger({
        level: 'info',
        format: winston.format.json(),
        defaultMeta: { service: 'user-service' },
        transports: [
            new winston.transports.File({ filename }),
        ],
      });
      
      if (process.env.NODE_ENV !== 'production') {
        logger.add(new winston.transports.Console({
          format: winston.format.simple(),
        }));
      }

      logger.log({
          level : mode,
          message,
      });
    } catch (err) {
        if (err.cod == 'ENOENT') {
            await fs.mkdir(logDir);
        }
    }
};