import { DataLakeServiceClient, StorageSharedKeyCredential, DataLakeFileSystemClient, DataLakeFileClient } from "@azure/storage-file-datalake";

export class DataLake {

    private _client : DataLakeServiceClient
    private _fileSystemClient : DataLakeFileSystemClient

    constructor(account : string, accountKey : string, fileSystemName) {
        const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);
        this._client = new DataLakeServiceClient(
          `https://${account}.dfs.core.windows.net`,
          sharedKeyCredential
        );
        this._fileSystemClient = this._client.getFileSystemClient(fileSystemName);
    }


    public writeFile = async(filepath : string, content : string) => {

        const fileClient : DataLakeFileClient = this._fileSystemClient.getFileClient(filepath);
        await fileClient.create();
        await fileClient.append(content, 0, content.length);
        await fileClient.flush(content.length);
        console.log(`Create and upload file ${filepath} successfully`);
    }

}