import express from 'express';
import multer from 'multer';
import Papa from 'papaparse'
import fs from 'fs'
import path from 'path'
import { ChaseCreditJsonObject, getCsvOrigin, SchwabJsonObject } from './utils/getCsvOrigin';
import { formatChaseCreditCardCsv } from './utils/formatChaseCreditCardCsv';
import { formatSchwabCsv } from './utils/formatSchwabCsv';
import cors from 'cors';
import { corsOptions } from './configs/corsOptions';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.use(express.static(path.join(__dirname.split('backend')[0], 'frontend', 'build')))
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname.split('backend')[0], 'frontend', 'build', 'index.html'))
})

const upload = multer({ dest: 'uploads/' })

app.use(express.json())
app.use(cors(corsOptions));

app.post('/upload', upload.single('csvfile'), (req, res) => {
  try {
    if (!req.file) return res.status(400).send('No file was uploaded.')

    const filePath = path.join(__dirname.replace('src', ''), req.file.path);
    if (!fs.existsSync(filePath)) {
      return res.status(400).send('Uploaded file not found')
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
  
    Papa.parse(fileContent, {
      header: true,
      complete: (results) => {
        const csvOrigin = getCsvOrigin(results.meta.fields);
        const dataWithId = (results.data as object[]).map(d => ({...d, id: uuidv4()}))
        if (csvOrigin === 'chase_credit_card') {
          const formattedData = formatChaseCreditCardCsv(dataWithId as ChaseCreditJsonObject[])
          res.status(201).send(formattedData)
        } else if (csvOrigin === 'schwab') {
          const formattedData = formatSchwabCsv(dataWithId as SchwabJsonObject[]);
          res.status(201).send(formattedData)
        } else {
          res.status(200).send(dataWithId)
        }
      },
      error: (error: Error) => {
        console.error('Error parsing CSV:', error.message);
        res.status(500).send('Error parsing CSV')
      }
    })

    fs.unlinkSync(filePath)
  } catch (error) {
      console.error('Error processing file:', error);
        res.status(500).send('Internal Server Error')
  }

})

app.post('/submit', (req, res) => {
  console.log(req.headers)
  console.log(req.body)
  res.sendStatus(201)
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
