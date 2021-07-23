const fs = require('fs').promises;

fs.copyFile('./readme_stream_new.txt','/readme_stream.txt')
    .then(()=>{
        console.log("파일 복사 성공!!");
    })
    .catch((err)=>{    
        console.error(err);
    });