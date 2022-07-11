export interface BpaService {
    bpaServiceId: string
    inputTypes: string[]
    outputTypes: string[]
    process: (BpaServiceObject, number) => Promise<BpaServiceObject>
    name: string
    serviceSpecificConfig: any
    serviceSpecificConfigDefaults: any
}

export interface BpaStage {
    service: BpaService
    serviceSpecificConfig ?: any
}

export interface BpaConfiguration {
    stages: any[]
    name : string
}

export interface BpaPipelines {
    pipelines : BpaConfiguration[]
}

export interface ResultsIndex {
    name : string,
    index : number,
    type : string
}

export interface BpaServiceObject {
    data ?: any,
    filename : string,
    pipeline : string,
    type : string,
    label : string,
    bpaId : string
    aggregatedResults : any
    resultsIndexes ?: ResultsIndex[]
    serviceSpecificConfig ?: any
}