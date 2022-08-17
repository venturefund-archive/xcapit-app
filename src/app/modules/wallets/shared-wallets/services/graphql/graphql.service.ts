import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'variables.env';

@Injectable({
  providedIn: 'root',
})
export class GraphqlService {
  env = environment;
  private query: string;
  constructor(private http: HttpClient) {}

  getInvestedBalance(walletAddress: string, pid: number): Observable<any> {
    this.query = `
      query{
        flows(first: 1 orderBy: timestamp orderDirection: desc
          where: {holder: "${walletAddress}", pid: ${pid}}
        ) {balance balanceUSD}
      }`;
    return this.http.post(this.env.twoPiGraphqlUrl, JSON.stringify({ query: this.query }));
  }
}
