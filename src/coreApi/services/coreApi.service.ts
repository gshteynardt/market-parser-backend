import { HttpService, Injectable } from '@nestjs/common';

@Injectable()
export class coreApiService{
  private baseUrl: string;
  private authToken: string
  constructor(
    private httpService: HttpService,
  ) {
      this.baseUrl = 'http://159.89.51.65:8080';
      this.authToken = 'Basic dXV1OmdnZzEyMw=='
  }

  getStatus(jobUUID){
    return this.httpService
      .get(
        `${this.baseUrl}/workers/old_defaultWorker/jobs/${jobUUID}`,
        {
          headers: {
            Authorization: this.authToken,
          },
        },
      );
  }

  getResult(jobUUID){
    return this.httpService
      .get(`${this.baseUrl}/workers/old_defaultWorker/jobs/${jobUUID}/output`, {
        headers: {
          Authorization: this.authToken,
        },
      })
  }

  getAll(user, jobUUID){
    return this.httpService
      .get(
        `${this.baseUrl}/workers/old_defaultWorker/jobs/${jobUUID}`,
        {
          headers: {
            Authorization: this.authToken,
          },
        },
      )
  }
}