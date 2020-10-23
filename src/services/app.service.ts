import { HttpService, Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class AppService {
  constructor(private httpService: HttpService) {}

  csvToArray(text) {
    let p = '', row = [''], ret = [row], i = 0, r = 0, s = !0, l;
    for (l of text) {
      if ('"' === l) {
        if (s && l === p) row[i] += l;
        s = !s;
      } else if (',' === l && s) l = row[++i] = '';
      else if ('\n' === l && s) {
        if ('\r' === p) row[i] = row[i].slice(0, -1);
        row = ret[++r] = [l = '']; i = 0;
      } else row[i] += l;
      p = l;
    }
    return ret;
  };

  getWorkerJobs() {
    return this.httpService.get('http://159.89.51.65:8080/workers/defaultWorker/jobs/1603115662214_0x33946741255392743', {
        headers: {
          'Authorization': 'Basic dXV1OmdnZzEyMw=='
        }
      }).toPromise()
      .then(res=>{
        return this.httpService.get(`http://159.89.51.65:8080/${res.data.builtOutputFilePath}`, {
          headers: {
            'Authorization': 'Basic dXV1OmdnZzEyMw=='
          }
        }).pipe(map(res=>{
          return {info: this.csvToArray(res.data)}
        }))
      })
    }


    /*getCSV(path){
      return this.httpService.get(`http://159.89.51.65:8080/${path}`, {
        headers: {
          'Authorization': 'Basic dXV1OmdnZzEyMw=='
        }
      }).pipe(map(res=>{
        console.log(path)
        return {info: res.data}
      }))
    }*/

}
