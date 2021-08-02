/* 
message : 로그 기록 메세지
mode : 로그레벨 - info, warn, error

날짜/시간 : 날짜 >> 파일명, 시간 >> 메세지 앞에 시간
*/
const winston = require('winston');
const path = require('path');
const fs = require('fs').promises;
const constants = require('fs').constants;

module.exports = async (message, mode) => {
    const logDir = path.join(__dirname, "../logs");

    try {
        mode = mode || 'info';

        await fs.access(logDir, constants.F_OK); // 폴더 존재여부 체크 >> 없으면 catch의 err로 유입

        const date = new Date();

        // 파일명 : 날짜 형식으로 생성
        const year = date.getFullYear();
        let month = date.getMonth() + 1;
        month = (month < 10) ? `0${month}` : month;
        let day = date.getDate();
        day = (day < 10) ? `0${day}` : day;

        const filename = logDir + "/" + `${year}${month}${day}.log`;

        // 메세지에 시간을 추가
        let hours = date.getHours();
        hours = (hours < 10) ? `0${hours}` : hours;
        let mins = date.getMinutes();
        mins = (mins < 10) ? `0${mins}` : mins;
        let secs = date.getSeconds();
        secs = (secs < 10) ? `0${secs}` : secs;

        message = `[${hours}:${mins}:${secs}]${message}`;

        const logger = winston.createLogger({
            level: 'info',
            format: winston.format.json(),
            defaultMeta: { service: 'general' },
            transports: [
                new winston.transports.File({ filename }),
            ],
        });

        if (process.env.NODE_ENV !== 'production') {
            logger.add(new winston.transports.Console({
                format: winston.format.simple(),
            }));
        };

        logger.log({
            level: mode,
            message,
        });
    } catch (err) {
        if (err.code == 'ENOENT') { //폴더가 없는 경우..
            await fs.mkdir(logDir);
        }
    }
};

