import { HttpService, Injectable } from '@nestjs/common';

@Injectable()
export class coreApiService {
  private baseUrl: string;
  private authToken: string;
  constructor(private httpService: HttpService) {
    this.baseUrl = 'http://159.89.51.65:8080';
    this.authToken = 'Basic dXV1OmdnZzEyMw==';
  }

  _getPath(file: File){
    return this.httpService
    .post(
      `${this.baseUrl}/upload_xls_file`, {
        data: file
      }, {
        headers: {
          Authorization: this.authToken,
          'Content-type': 'application/octet-stream',
        }
      }).toPromise().then(res => res.data)
  }

  async addNewJob(nameWorker: string, file: File){
    const path = await this._getPath(file);

    return  this.httpService
    .post(`${this.baseUrl}/workers/${nameWorker}/createJob_importXLS?forceRun=true`, {
        filePath: path,
        searchTextColumnIndex: 0,
        productUrlColumnIndex: 1,
      },
      {
        headers: {
          Authorization: 'Basic dXV1OmdnZzEyMw==',
          'Content-type': 'application/json',
        }
      }).toPromise().then(res => res.data.jobUUID)
  }


  getStatus(jobUUID) {
    return this.httpService.get(
      `${this.baseUrl}/workers/old_defaultWorker/jobs/${jobUUID}`,
      {
        headers: {
          Authorization: this.authToken,
        },
      },
    );
  }

  getResult(jobUUID) {
    return this.httpService.get(
      `${this.baseUrl}/workers/old_defaultWorker/jobs/${jobUUID}/output`,
      {
        headers: {
          Authorization: this.authToken,
        },
      },
    );
  }

  getAll(user, jobUUID) {
    return this.httpService.get(
      `${this.baseUrl}/workers/old_defaultWorker/jobs/${jobUUID}`,
      {
        headers: {
          Authorization: this.authToken,
        },
      },
    );
  }
}
