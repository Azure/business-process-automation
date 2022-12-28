import { readFileSync } from "fs"
import { Blob } from "./blob"

export abstract class BpaStorage {
    constructor(){

    }

    public abstract getBuffer(filename : string) : Promise<Buffer>;
}


export class BlobStorage extends BpaStorage{

    private _blob : Blob

    constructor(){
        super()
        this._blob = new Blob(process.env.AzureWebJobsStorage, process.env.BLOB_STORAGE_CONTAINER)
    }

    public getBuffer = async (filename : string) : Promise<Buffer> => {
        return this._blob.getBuffer(filename)
    }
}

export class LocalStorage extends BpaStorage{

    private _localPath

    constructor(){
        super()
        this._localPath = process.env.LOCAL_STORAGE_PATH
    }

    public getBuffer = async (filename : string) : Promise<Buffer> => {
        return readFileSync(filename)
    }
}