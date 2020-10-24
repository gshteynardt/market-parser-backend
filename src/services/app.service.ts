import { HttpService, Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class AppService {
  constructor(private httpService: HttpService) {}


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
