import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class coreApiService {
  private baseUrl: string;
  private authToken: string;
  constructor(private httpService: HttpService, private configService: ConfigService) {
    this.baseUrl = configService.get('CORE_URL');
    this.authToken = configService.get('CORE_TOKEN');
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
    .post(`${this.baseUrl}/workers/${nameWorker}/createJob_importXLS?forceRun=true`, JSON.stringify({
        filePath: path,
        searchTextColumnIndex: 0,
        productUrlColumnIndex: 1,
      }),
      {
        headers: {
          Authorization: 'Basic dXV1OmdnZzEyMw==',
          'Content-type': 'application/json',
        }
      }).toPromise().then(res => res.data.jobUUID)
  }

  stopJob(jobUUID: string){
    return this.httpService.get(
      `${this.baseUrl}/workers/preview_worker/stop`,
      {
        headers: {
          Authorization: this.authToken,
        },
      },
    );
  }

  startJob(jobUUID: string){
    return this.httpService.get(
      `${this.baseUrl}/workers/preview_worker/run`,
      {
        headers: {
          Authorization: this.authToken,
        },
      },
    );
  }

  getStatus(jobUUID) {
    return this.httpService.get(
      `${this.baseUrl}/workers/preview_worker/jobs/${jobUUID}`,
      {
        headers: {
          Authorization: this.authToken,
        },
      },
    );
  }

  getResult(jobUUID) {
    return this.httpService.get(
      `${this.baseUrl}/workers/preview_worker/jobs/${jobUUID}/output`,
      {
        headers: {
          Authorization: this.authToken,
        },
      },
    );
  }

  getAll(user, jobUUID) {
    return this.httpService.get(
      `${this.baseUrl}/workers/preview_worker/jobs/${jobUUID}`,
      {
        headers: {
          Authorization: this.authToken,
        },
      },
    );
  }
}
