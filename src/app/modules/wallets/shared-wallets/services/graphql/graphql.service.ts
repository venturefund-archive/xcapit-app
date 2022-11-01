import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EnvService } from 'src/app/shared/services/env/env.service';

@Injectable({
  providedIn: 'root',
})
export class GraphqlService {
  constructor(private http: HttpClient, private env: EnvService) {}

  getInvestedBalance(walletAddress: string, pid: number): Observable<any> {
    const query = `
      query{
        flows(
          first: 1 orderBy: timestamp orderDirection: desc
          where: {holder: "${this._normalizedAddress(walletAddress)}", pid: ${pid}}
        ) {balance balanceUSD}
      }`;
    return this.http.post(this.env.byKey('twoPiGraphqlUrl'), JSON.stringify({ query: query }));
  }

  getAllMovements(walletAddress: string, pid: number): Observable<any> {
    const query = `
      query{
        flows(
          first: 1000 orderBy: timestamp orderDirection: desc
          where: {holder: "${this._normalizedAddress(walletAddress)}", pid: ${pid} type_not: earnings}
        ) {amount balance balanceUSD timestamp type
        }
      }`;
    return this.http.post(this.env.byKey('twoPiGraphqlUrl'), JSON.stringify({ query: query }));
  }

  private _normalizedAddress(anAddress: string): string {
    return anAddress.toLowerCase();
  }
}
