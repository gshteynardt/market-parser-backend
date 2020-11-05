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

  getStatus(jobUUID) {
    console.log(this.baseUrl)
    return this.httpService.get(
      `${this.baseUrl}/workers/forDimaWorker/jobs/${jobUUID}`,
      {
        headers: {
          Authorization: this.authToken,
        },
      },
    );
  }

  getResult(jobUUID) {
    return this.httpService.get(
      `${this.baseUrl}/workers/forDimaWorker/jobs/${jobUUID}/output`,
      {
        headers: {
          Authorization: this.authToken,
        },
      },
    );
  }
}
