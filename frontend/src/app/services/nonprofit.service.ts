import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NonprofitResponse, SearchRequest, SearchHistoryItem } from '../models/nonprofit.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class NonprofitService {
  private readonly API_URL = 'http://localhost:3001/api/nonprofit';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  searchNonprofit(searchRequest: SearchRequest): Observable<NonprofitResponse> {
    return this.http.post<NonprofitResponse>(
      `${this.API_URL}/search`,
      searchRequest,
      { headers: this.getHeaders() }
    );
  }

  getNonprofitByEin(ein: string): Observable<NonprofitResponse> {
    return this.http.get<NonprofitResponse>(
      `${this.API_URL}/${ein}`,
      { headers: this.getHeaders() }
    );
  }
}


