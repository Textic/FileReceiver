const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');
const path = require('path');
const prompts = require('prompts');

var port;

async function main() {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(fileUpload());
    
    await prompts({
        type: 'number',
        name: 'value',
        message: 'What port do you want to use?',
    }).then((response) => {
        port = response.value;
    });
    
    app.post('/', (req, res) => {
        try {
            if (!req.files) {
                res.send('No file uploaded/detected!');
                console.log('No file uploaded/detected!');
                return;
            }

            const dir = './uploads'
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            //app name: FileReceiver

            const file = req.files.file;
            file.mv(path.join(process.cwd(), 'uploads', file.name)); // used process.cwd() instead of __dirname because trow error "Error: Cannot write to packaged file"
            
            res.send('File uploaded!');
            console.log('File uploaded!');
            
        } catch (err) {
            res.send('Error while uploading file!');
            console.log('Error while uploading file!');
        }
    });
    
    app.listen(port, () => console.log('Server listening on port ' + port));
};

main();