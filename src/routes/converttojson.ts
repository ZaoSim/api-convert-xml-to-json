import express from 'express';
import { Router } from 'express';
import multer from 'multer';
import { xmlToJson, isFileArray } from '../services/xmlToJson';

const router = Router();

const app = express()

router.use('/xml', express.text({type: 'application/xml'}));

const upload = multer({ storage: multer.memoryStorage() });

router.post('/json', (req, res) => {
    console.log('Json:', req.body);
    console.log(xmlToJson(req.body));
    const json = xmlToJson(req.body);
    res.json({message: 'JSON', data: json});
});

router.post('/xml', upload.array('files'), async (req, res) => {
    try {
        if (!req.files || !isFileArray(req.files) || req.files.length === 0) {
            return res.status(400).json({ message: 'No files sended.' });
        }

        const results = [];

        for (let i = 0; i < (req.files).length; i++) {
            const file = req.files[i];
            const xml = file.buffer.toString('utf-8');

            if(!xml){
                results.push({
                    filename: file.originalname,
                    error: 'XML inválido!',
                    data: null
                });
                continue;
            }

            try {
                const json = await xmlToJson(xml);
                results.push({
                    filename: file.originalname,
                    error: null,
                    data:json
                });
            } catch (error) {
                results.push({
                    filename: file.originalname,
                    error: error,
                    data: null
                })
            }
        }

        res.json({
            message: 'Finished',
            totalFiles: req.files.length,
            results: results
        });
        
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error});
    }
});

export default router;