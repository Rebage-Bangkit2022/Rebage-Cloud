import express, { Router, Request, Response } from 'express';
import util, { format } from 'util';
import Multer from 'multer';
import GeneralError, { BadRequest, Forbidden, Unathorized } from '../model/error';
import Web from '../model/web';
import { Storage } from '@google-cloud/storage';
import { GetDetectionResponse, GetStatisticResponse, UpdateDetectionRequest } from '../model/detection';
import DetectionService from '../service/detection-service';
import { auth } from './middleware';
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
    detectionService: DetectionService;
    router: Router;

    constructor(detectionService: DetectionService, router?: Router) {
        this.detectionService = detectionService;
        const r = router ?? express.Router();
        this.router = r;

        r.post('/api/detection', auth, this.detect);
        r.get('/api/detections', auth, this.getDetections);
        r.get('/api/detections/stats', auth, this.getStatistic);
        r.get('/api/detection/:id', auth, this.getDetection);
        r.put('/api/detection/:id', auth, this.update);
        r.delete('/api/detection/:id', auth, this.delete);
    }

    detect = async (req: Request, res: Response<Web<GetDetectionResponse[]>>) => {
        if (!req.userId) {
            GeneralError.handle(new Unathorized('Not allowed'), res);
            return;
        }
        await processFileMiddleware(req, res);
        const file = req.file;
        if (!file) throw new BadRequest('Please upload file');
        console.log('mulai');
        const detectedResult = this.detectImage(file.buffer.toString('base64'));

        try {
            const blob = bucket.file(`user-images/${file.originalname}`);
            const blobStream = blob.createWriteStream({
                resumable: false,
            });
            blobStream.on('error', (err) => {
                GeneralError.handle(err, res);
            });

            blobStream.on('finish', async (_data: any) => {
                // Create URL for directly file access via HTTP.
                const publicUrl = format(`https://storage.googleapis.com/${bucket.name}/${blob.name}`);
                try {
                    // Make the file public
                    await bucket.file(`user-images/${file.originalname}`).makePublic();
                } catch (error) {
                    GeneralError.handle(error, res);
                    return;
                }

                const rawResult = await detectedResult;
                const bb = rawResult.boundingBoxes;
                const labels = rawResult.labels;
                const scores = rawResult.scores;
                if (bb.length != labels.length || bb.length != scores.length || labels.length != scores.length) {
                    GeneralError.handle(new GeneralError('Error while detecting image'), res);
                    return;
                }
                const size = labels.length;
                if (!size) {
                    res.json({
                        success: true,
                        data: [],
                    });
                    return;
                }
                const result: {
                    image: string;
                    label: string;
                    boundingBoxes: number[][];
                    scores: number[];
                    total: number;
                }[] = [];
                if (size) {
                    const combined = rawResult.boundingBoxes.map((boundingBox, i) => ({
                        boundingBox: boundingBox,
                        label: labels[i],
                        score: scores[i],
                    }));
                    let grouped = groupBy(combined, (v) => v.label);
                    for (let label in grouped) {
                        result.push({
                            label: label,
                            boundingBoxes: grouped[label].map((v) => v.boundingBox),
                            image: publicUrl,
                            total: grouped[label].length,
                            scores: grouped[label].map((v) => v.score),
                        });
                    }
                }

                if (!req.userId) {
                    GeneralError.handle(new Unathorized('Not allowed'), res);
                    return;
                }

                res.json({
                    success: true,
                    data: await this.detectionService.save(result, req.userId),
                });
            });

            blobStream.end(file.buffer);

            console.log('hasil');
        } catch (error) {
            GeneralError.handle(error, res);
        }
    };

    private detectImage = async (imageBase64: string) => {
        // TODO(developer): Uncomment these variables before running the sample.
        const endpointId = process.env.ENDPOINT_ID_VERTEX_AI;
        const project = process.env.PROJECT_ID_VERTEX_AI;
        const location = process.env.LOCATION_VERTEX_AI;
        const aiplatform = require('@google-cloud/aiplatform');
        const threshold = 0.5;
        const labels = ['', 'Botol Kaca', 'Botol Plastik', 'Kaleng', 'Kardus', 'Karet', 'Kertas', 'Plastik', 'Sedotan'];
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
            const prediction = predictions[0];
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

            console.log(index_lolos_threshold);

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

            const op: {
                boundingBoxes: number[][];
                labels: string[];
                scores: number[];
            } = {
                boundingBoxes: bbox,
                labels: detection,
                scores: scores,
            };

            return op;
        }

        return await predictImageObjectDetection();
    };

    getDetections = async (req: Request, res: Response<Web<GetDetectionResponse[]>>) => {
        try {
            const userId = req.userId;
            if (!userId) throw new Forbidden('Not allowed');
            const detections = await this.detectionService.getDetections(userId);
            res.json({
                success: true,
                data: detections,
            });
        } catch (error) {
            console.error(error);
            GeneralError.handle(error, res);
        }
    };

    getDetection = async (req: Request<{ id: string }>, res: Response<Web<GetDetectionResponse>>) => {
        try {
            const detectionId = parseInt(req.params.id);
            const userId = req.userId;
            if (!userId) throw new Forbidden('Not allowed');

            const detection = await this.detectionService.getDetection(detectionId, userId);
            res.json({
                success: true,
                data: detection,
            });
        } catch (error) {
            console.log(error);
            GeneralError.handle(error, res);
        }
    };

    getStatistic = async (req: Request<{ id: string }>, res: Response<Web<GetStatisticResponse>>) => {
        try {
            const userId = req.userId;
            if (!userId) throw new Forbidden('Not allowed');
            
            const stats = await this.detectionService.getStatistic(userId);
            res.json({
                success: true,
                data: stats,
            });
        } catch (error) {
            console.error(error);
            GeneralError.handle(error, res);
        }
    };

    update = async (
        req: Request<{ id: string }, {}, UpdateDetectionRequest>,
        res: Response<Web<GetDetectionResponse>>
    ) => {
        try {
            const detectionId = parseInt(req.params.id);
            const userId = req.userId;
            if (!userId) throw new Forbidden('Not allowed');

            const detection = await this.detectionService.update({ id: detectionId, total: req.body.total }, userId);
            res.json({
                success: true,
                data: detection,
            });
        } catch (error) {
            console.log(error);
            GeneralError.handle(error, res);
        }
    };

    delete = async (req: Request<{ id: string }>, res: Response<Web<GetDetectionResponse>>) => {
        try {
            const detectionId = parseInt(req.params.id);
            const userId = req.userId;
            if (!userId) throw new Forbidden('Not allowed');

            const detection = await this.detectionService.delete(detectionId, userId);
            res.json({
                success: true,
                data: detection,
            });
        } catch (error) {
            console.log(error);
            GeneralError.handle(error, res);
        }
    };
}

export default DetectionController;

const groupBy = <T, K extends keyof any>(arr: T[], key: (i: T) => K) =>
    arr.reduce((groups, item) => {
        (groups[key(item)] ||= []).push(item);
        return groups;
    }, {} as Record<K, T[]>);
