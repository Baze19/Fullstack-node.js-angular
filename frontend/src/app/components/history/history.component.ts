import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HistoryService, HistoryResponse, HistoryStats } from '../../services/history.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  searchHistory: any[] = [];
  historyStats: HistoryStats | null = null;
  isLoading = false;
  currentPage = 1;
  totalPages = 1;
  itemsPerPage = 20;
  totalItems = 0;
  displayedColumns: string[] = ['timestamp', 'searchType', 'searchValue', 'organizationName', 'ein', 'compliance', 'user'];

  constructor(
    private historyService: HistoryService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadSearchHistory();
    this.loadHistoryStats();
  }

  loadSearchHistory(page: number = 1): void {
    this.isLoading = true;
    this.currentPage = page;

    this.historyService.getSearchHistory(page, this.itemsPerPage).subscribe({
      next: (response: HistoryResponse) => {
        this.isLoading = false;
        if (response.success) {
          this.searchHistory = response.data.history;
          this.totalPages = response.data.pagination.totalPages;
          this.totalItems = response.data.pagination.totalItems;
        } else {
          this.snackBar.open('Failed to load search history', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open('Error loading search history', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        console.error('History error:', error);
      }
    });
  }

  loadHistoryStats(): void {
    this.historyService.getSearchStats().subscribe({
      next: (response) => {
        if (response.success) {
          this.historyStats = response.data;
        }
      },
      error: (error) => {
        console.error('Stats error:', error);
      }
    });
  }

  onPageChange(page: number): void {
    this.loadSearchHistory(page);
  }

  clearHistory(): void {
    if (confirm('Are you sure you want to clear all search history?')) {
      this.historyService.clearSearchHistory().subscribe({
        next: (response) => {
          this.snackBar.open('Search history cleared successfully', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.loadSearchHistory(1);
          this.loadHistoryStats();
        },
        error: (error) => {
          this.snackBar.open('Failed to clear search history', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
          console.error('Clear history error:', error);
        }
      });
    }
  }

  exportHistory(): void {
    this.historyService.exportSearchHistory().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'search-history.csv';
        link.click();
        window.URL.revokeObjectURL(url);
        
        this.snackBar.open('Search history exported successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      },
      error: (error) => {
        this.snackBar.open('Failed to export search history', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        console.error('Export error:', error);
      }
    });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getComplianceStatusClass(isCompliant: boolean): string {
    return isCompliant ? 'compliant' : 'non-compliant';
  }

  getComplianceStatusText(isCompliant: boolean): string {
    return isCompliant ? 'Compliant' : 'Non-Compliant';
  }
}
