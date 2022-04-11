export interface BpaService {
    bpaServiceId: string
    inputTypes: string[]
    outputTypes: string[]
    process: (BpaServiceObject) => Promise<BpaServiceObject>
    name: string
    serviceSpecificConfig: any
    serviceSpecificConfigDefaults: any
}

export interface BpaStage {
    service: BpaService
    serviceSpecificConfig ?: any
}

export interface BpaConfiguration {
    stages: BpaStage[]
}

export interface BpaServiceObject {
    data : any,
    type : string,
    label : string,
    projectName : string,
    bpaId : string
    serviceSpecificConfig ?: any
}