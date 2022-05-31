'use strict';

function predictImageObjectDetection() {
	// TODO(developer): Uncomment these variables before running the sample.

	const filename = './20220514_181114.jpg';
	const endpointId = '7528074640405561344';
	const project = 'rebage';
	const location = 'us-central1';
	const aiplatform = require('@google-cloud/aiplatform');
	const threshold = 0
	const labels = ['botolkaca', 'botolplastik', 'kaleng', 'kardus', 'karet', 'kertas', 'plastik', 'sedotan']
	const {
		instance,
		params,
		prediction
	} =
	aiplatform.protos.google.cloud.aiplatform.v1.schema.predict;

	// Imports the Google Cloud Prediction Service Client library
	const {
		PredictionServiceClient
	} = aiplatform.v1;

	// Specifies the location of the api endpoint
	const clientOptions = {
		apiEndpoint: 'us-central1-aiplatform.googleapis.com',
	};

	// Instantiates a client
	const predictionServiceClient = new PredictionServiceClient(clientOptions);

	async function predictImageObjectDetection() {
		// Configure the endpoint resource
		const endpoint = `projects/${project}/locations/${location}/endpoints/${endpointId}`;

		const parametersObj = new params.ImageObjectDetectionPredictionParams({

		});
		const parameters = parametersObj.toValue();

		const fs = require('fs');
		const image = fs.readFileSync(filename, 'base64');
		const instance = {
			structValue: {
				fields: {
					b64: {
						stringValue: image
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
		for (const prediction of predictions) {
			// console.log(`\tPrediction : ${JSON.stringify(prediction)}`);
			let num_detections = prediction['structValue']['fields']['num_detections'];
			let detection_scores = prediction['structValue']['fields']['detection_scores'];
			let detection_boxes = prediction['structValue']['fields']['detection_boxes'];
			let detection_classes = prediction['structValue']['fields']['detection_classes'];

			// Todo: ambil index deteksi yang lebih dari threshold nya boi
			let index_lolos_threshold = []
			let scores = []
			for (let i = 0; i < num_detections['numberValue']; i++) {
				// console.log(i);
				let data_score = detection_scores['listValue']['values'][i]['numberValue']
				if (data_score >= threshold) {
					scores.push(data_score)
					index_lolos_threshold.push(i)
				}
			}

			// Todo: ambil detection box
			let bbox = []

			for (let i = 0; i < index_lolos_threshold.length; i++) {
				let tmp_bbox = []
				let index_bbox = detection_boxes['listValue']['values'][index_lolos_threshold[i]]['listValue']['values']

				for (const i_bbox of index_bbox) {
					tmp_bbox.push(i_bbox['numberValue']);
				}

				bbox.push(tmp_bbox)
			}

			// ambil detection class dari labels
			let detection = []
			for (const detected of detection_classes['listValue']['values']) {
				detection.push(labels[detected['numberValue']])
			}
			// output = bbox, detection

			const op = {
				"bounding_boxes": bbox,
				"label_detections": detection,
				"scores": scores
			}
			console.log(op);

		}


	}

	predictImageObjectDetection();
	// [END aiplatform_predict_image_object_detection_sample]
}

// process.on('unhandledRejection', (err) => {
// 	console.error(err.message);
// 	process.exitCode = 1;
// });

predictImageObjectDetection(...process.argv.slice(2));