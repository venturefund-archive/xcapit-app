import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EnvService } from 'src/app/shared/services/env/env.service';

@Injectable({
  providedIn: 'root',
})
export class GraphqlService {
  private query: string;
  constructor(private http: HttpClient, private env: EnvService) {}

  getInvestedBalance(walletAddress: string, pid: number): Observable<any> {
    this.query = `
      query{
        flows(first: 1 orderBy: timestamp orderDirection: desc
          where: {holder: "${walletAddress}", pid: ${pid}}
        ) {balance balanceUSD}
      }`;
    return this.http.post(this.env.byKey('twoPiGraphqlUrl'), JSON.stringify({ query: this.query }));
  }
}
