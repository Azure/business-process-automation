import { createClient } from 'redis';

export class RedisSimilarity  {

    private _client

    constructor(connectionString : string) {
        this._client = createClient({
            url: connectionString
          }); 
    }

    public connect = async () => {
        await this._client.connect()
    }

    public createIndex = async (indexName : string, dimension : string) => {
        await this._client.sendCommand(['FT.CREATE',indexName,'ON',' JSON ','SCHEMA','$.embeddings','as','embeddings','VECTOR','FLAT','6',' TYPE','FLOAT32',' DIM',dimension,'DISTANCE_METRIC','L2']);
    }

    public set = async (id: string, document: any, embeddings : any) => {
        const data = {
            id : id,
            document : document,
            embeddings : embeddings
        }
        await this._client.sendCommand(['JSON.SET', id ,'$',JSON.stringify(data)]);
    }

    public query = async (indexName : string, embeddings : any, numResults : string) => {
        await this._client.sendCommand(['FT.SEARCH', indexName,`"*=>[KNN ${numResults} @embeddings $BLOB]"`,'PARAMS','2','BLOB',  'DIALECT', '2']);
    }
}