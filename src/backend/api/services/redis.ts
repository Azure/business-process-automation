import { createClient, SchemaFieldTypes, VectorAlgorithms } from 'redis';

export class RedisSimilarity {

    private _client

    constructor(connectionString: string, password: string) {
        this._client = createClient({
            url: connectionString,
            password: password
        });
    }

    public connect = async () => {
        await this._client.connect()
    }

    public disconnect = async () => {
        await this._client.disconnect()
    }

    public createIndex = async (indexName: string, dimension: number) => {
        //await this._client.sendCommand(['FT.CREATE',indexName,'ON',' JSON ','SCHEMA','$.embeddings','as','embeddings','VECTOR','FLAT','6',' TYPE','FLOAT32',' DIM',dimension,'DISTANCE_METRIC','L2']);
        let out
        try {
            out = await this._client.ft.create(indexName, {
                v: {
                    type: SchemaFieldTypes.VECTOR,
                    ALGORITHM: VectorAlgorithms.HNSW,
                    TYPE: 'FLOAT32',
                    DIM: dimension,
                    DISTANCE_METRIC: 'COSINE'
                },
                pipeline : SchemaFieldTypes.TEXT
            }, {
                ON: 'HASH'
            });
        } catch (e) {
            if (e.message === 'Index already exists') {
                console.log('Index exists already, skipped creation.');
            }
        }
        return out
    }

    public set = async (id: string, document: any, embeddings: any) => {
        await this._client.hSet(id, {v : this._float32Buffer(embeddings), pipeline: document.pipeline})
    }

    public query = async (indexName: string, embeddings: any, numResults: string, pipeline: string) => {
        return await this._client.ft.search(indexName, `(@pipeline:${pipeline} )=>[KNN ${numResults} @v $BLOB AS dist]`, {
            PARAMS: {
                BLOB: this._float32Buffer(embeddings)
            },
            SORTBY: 'dist',
            DIALECT: 2,
            RETURN: ['dist']
        });
    }

    public flushall = async () => {
        return await this._client.sendCommand(['FLUSHALL']);;
    }

    public getKeys = async () => {
        return await this._client.sendCommand(['KEYS','*']);;
    }

    private _float32Buffer = (arr) => {
        return Buffer.from(new Float32Array(arr).buffer);
    }
}