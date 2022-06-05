export interface GetDetectionResponse {
    id: number;
    image: string;
    label: string;
    boundingBoxes: number[][];
    scores: number[];
    total: number;
    createdAt: Date;
}

export interface UpdateDetectionRequest {
    id: number;
    total: number;
}

export interface GetStatisticResponse {
    
}