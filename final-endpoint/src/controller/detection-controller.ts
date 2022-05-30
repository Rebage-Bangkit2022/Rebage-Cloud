import aiplatform, { protos } from '@google-cloud/aiplatform';
import express, { Router, Request, Response } from 'express';

class DetectionController {
    router: Router;

    constructor(router?: Router) {
        const r = router ?? express.Router();
        this.router = r;

        r.post('/detection', this.detect);
    }

    detect = async (req: Request<{}, {}, { image: string }>, res: Response) => {
        const base64Image = req.body.image;

        const { instance, params, prediction } = protos.google.cloud.aiplatform.v1.schema.predict;

        const { PredictionServiceClient } = aiplatform.v1;

        const clientOptions = {
            apiEndpoint: 'us-central1-aiplatform.googleapis.com',
        };

        // Instantiates a client
        const predictionServiceClient = new PredictionServiceClient(clientOptions);

        const endpointId = '7528074640405561344';
        const project = 'rebage';
        const location = 'us-central1';

        async function predictImageObjectDetection() {
            // Configure the endpoint resource
            const endpoint = `projects/${project}/locations/${location}/endpoints/${endpointId}`;

            const parametersObj: any = new params.ImageObjectDetectionPredictionParams({});
            const parameters = parametersObj.toValue();

            const instance = {
                structValue: {
                    fields: {
                        b64: { stringValue: base64Image },
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

            console.log('Predict custom trained model response');
            console.log(`\tDeployed model id : ${response.deployedModelId}`);
            const predictions = response.predictions;

            console.log('\tPredictions :');
            const result: Array<string> = [];
            for (const prediction of predictions!!) {
                result.push(JSON.stringify(prediction));
            }
            return result;
        }

        res.json(await predictImageObjectDetection());
    };
}

export default DetectionController;
