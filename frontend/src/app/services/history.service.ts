import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SearchHistoryItem } from '../models/nonprofit.model';
import { AuthService } from './auth.service';

export interface HistoryResponse {
  success: boolean;
  data: {
    history: SearchHistoryItem[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
}

export interface HistoryStats {
  totalSearches: number;
  searchesByType: {
    EIN: number;
    'Organization Name': number;
  };
  searchesByResult: {
    compliant: number;
    nonCompliant: number;
  };
  recentSearches: Array<{
    id: string;
    searchType: string;
    searchValue: string;
    timestamp: string;
    isCompliant: boolean;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private readonly API_URL = 'http://localhost:3001/api/history';

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

  getSearchHistory(page: number = 1, limit: number = 20, userId?: number): Observable<HistoryResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    if (userId) {
      params = params.set('userId', userId.toString());
    }

    return this.http.get<HistoryResponse>(
      `${this.API_URL}`,
      { 
        headers: this.getHeaders(),
        params: params
      }
    );
  }

  getSearchStats(userId?: number): Observable<{ success: boolean; data: HistoryStats }> {
    let params = new HttpParams();
    if (userId) {
      params = params.set('userId', userId.toString());
    }

    return this.http.get<{ success: boolean; data: HistoryStats }>(
      `${this.API_URL}/stats`,
      { 
        headers: this.getHeaders(),
        params: params
      }
    );
  }

  clearSearchHistory(userId?: number): Observable<any> {
    const body = userId ? { userId } : {};
    return this.http.delete(
      `${this.API_URL}`,
      { 
        headers: this.getHeaders(),
        body: body
      }
    );
  }

  exportSearchHistory(userId?: number): Observable<Blob> {
    let params = new HttpParams();
    if (userId) {
      params = params.set('userId', userId.toString());
    }

    return this.http.get(
      `${this.API_URL}/export`,
      { 
        headers: this.getHeaders(),
        params: params,
        responseType: 'blob'
      }
    );
  }
}


