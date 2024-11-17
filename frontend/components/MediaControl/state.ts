export enum MediaControlState {
    HISTORY = 0,
    UPLOAD = 1,
    OUT_OF_QUOTA = 3,
}   


export enum InferenceState {
    PROCESSING = 0,
    FAILED = 1,
    SUCCEEDED = 2
}

export interface UploadMetaData {
    id: string,
    uploadTime: string,
    filename: string,
    state: InferenceState
}
