import express, { Router, Request, Response } from 'express';
import util, { format } from 'util';
import Multer from 'multer';
import GeneralError, { BadRequest } from '../model/error';
import Web from '../model/web';
import { Storage } from '@google-cloud/storage';
// Instantiate a storage client with credentials
const storage = new Storage({ keyFilename: 'rebage-fc8b497d0af5.json' });
const bucket = storage.bucket('rebage-cloud-storage');

const MAX_SIZE = 1 * 1024 * 1024;
let processFile = Multer({
    storage: Multer.memoryStorage(),
    limits: { fieldSize: MAX_SIZE },
}).single('image');
let processFileMiddleware = util.promisify(processFile);

class DetectionController {
    router: Router;

    constructor(router?: Router) {
        const r = router ?? express.Router();
        this.router = r;

        r.post('/detection', this.detect);
        r.post('/api/detection', this.upload);
    }

    upload = async (req: Request, res: Response<Web<any>>) => {
        try {
            await processFileMiddleware(req, res);
            const file = req.file;
            if (!file) throw new BadRequest('Please upload file');
            console.log('mulai');

            const blob = bucket.file(`user-images/${file.originalname}`);
            const blobStream = blob.createWriteStream({
                resumable: false,
            });
            blobStream.on('error', (err) => {
                res.status(500).send({ success: false, data: err.message });
            });

            blobStream.on('finish', async (data: any) => {
                console.log();
                // Create URL for directly file access via HTTP.
                const publicUrl = format(`https://storage.googleapis.com/${bucket.name}/${blob.name}`);
                try {
                    // Make the file public
                    await bucket.file(`user-images/${file.originalname}`).makePublic();
                } catch {
                    res.status(500).send({
                        success: false,
                        data: `Uploaded the file successfully: ${file.originalname}, but public access is denied! ${publicUrl}`,
                    });
                    return;
                }

                res.json({
                    success: true,
                    data: {
                        image: publicUrl,
                        result: await this.detect(file.buffer.toString('base64')),
                    },
                });
            });

            blobStream.end(file.buffer);

            console.log('hasil');
        } catch (error) {
            GeneralError.handle(error, res);
        }
    };

    private detect = async (imageBase64: string) => {
        // TODO(developer): Uncomment these variables before running the sample.
        const endpointId = '7528074640405561344';
        const project = 'rebage';
        const location = 'us-central1';
        const aiplatform = require('@google-cloud/aiplatform');
        const threshold = 0.5;
        const labels = ['', 'botolkaca', 'botolplastik', 'kaleng', 'kardus', 'karet', 'kertas', 'plastik', 'sedotan'];
        const { params } = aiplatform.protos.google.cloud.aiplatform.v1.schema.predict;

        // Imports the Google Cloud Prediction Service Client library
        const { PredictionServiceClient } = aiplatform.v1;

        // Specifies the location of the api endpoint
        const clientOptions = {
            apiEndpoint: 'us-central1-aiplatform.googleapis.com',
        };

        // Instantiates a client
        const predictionServiceClient = new PredictionServiceClient(clientOptions);

        async function predictImageObjectDetection() {
            // Configure the endpoint resource
            const endpoint = `projects/${project}/locations/${location}/endpoints/${endpointId}`;

            const parametersObj = new params.ImageObjectDetectionPredictionParams({});
            const parameters = parametersObj.toValue();

            const instance = {
                structValue: {
                    fields: {
                        b64: {
                            stringValue: imageBase64,
                        },
                    },
                },
            };

            const instances = [instance];

            const request = {
                endpoint,
                instances,
                parameters,
            };

            // Predict request
            const [response] = await predictionServiceClient.predict(request);

            // console.log('Predict custom trained model response');
            // console.log(`\tDeployed model id : ${response.deployedModelId}`);
            const predictions = response.predictions;
            console.log('Predictions :');

            // melihat hasil prediksinya
            const result = [];
            for (const prediction of predictions) {
                // console.log(`\tPrediction : ${JSON.stringify(prediction)}`);
                let num_detections = prediction['structValue']['fields']['num_detections'];
                let detection_scores = prediction['structValue']['fields']['detection_scores'];
                let detection_boxes = prediction['structValue']['fields']['detection_boxes'];
                let detection_classes = prediction['structValue']['fields']['detection_classes'];

                console.log(detection_scores);
                console.log(detection_classes);

                // Todo: ambil index deteksi yang lebih dari threshold nya boi
                let index_lolos_threshold = [];
                let scores = [];
                for (let i = 0; i < num_detections['numberValue']; i++) {
                    // console.log(i);
                    let data_score = detection_scores['listValue']['values'][i]['numberValue'];
                    if (data_score >= threshold) {
                        scores.push(data_score);
                        index_lolos_threshold.push(i);
                    }
                }

                // Todo: ambil detection box
                let bbox = [];

                for (let i = 0; i < index_lolos_threshold.length; i++) {
                    let tmp_bbox = [];
                    let index_bbox =
                        detection_boxes['listValue']['values'][index_lolos_threshold[i]]['listValue']['values'];

                    for (const i_bbox of index_bbox) {
                        tmp_bbox.push(i_bbox['numberValue']);
                    }

                    bbox.push(tmp_bbox);
                }

                // ambil detection class dari labels
                let detection = [];

                for (const idx of index_lolos_threshold) {
                    let label_dalam_angka = detection_classes['listValue']['values'][idx]['numberValue'];
                    detection.push(labels[label_dalam_angka]);
                    // detection.push(labels[idx + 1])
                }
                // output = bbox, detection

                const op = {
                    bounding_boxes: bbox,
                    label_detections: detection,
                    scores: scores,
                };
                result.push(op);
            }

            return result;
        }

        return (await predictImageObjectDetection())[0];
    };
}

export default DetectionController;
