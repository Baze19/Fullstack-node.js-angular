import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NonprofitService } from '../../services/nonprofit.service';
import { NonprofitResponse } from '../../models/nonprofit.model';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss']
})
export class SearchFormComponent {
  searchForm: FormGroup;
  isLoading = false;
  searchResults: NonprofitResponse | null = null;
  searchError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private nonprofitService: NonprofitService,
    private snackBar: MatSnackBar
  ) {
    this.searchForm = this.fb.group({
      searchType: ['ein', Validators.required],
      searchValue: ['', [Validators.required, Validators.minLength(3)]]
    });

    // Add EIN format validation when search type is EIN
    this.searchForm.get('searchType')?.valueChanges.subscribe(type => {
      const searchValueControl = this.searchForm.get('searchValue');
      if (type === 'ein') {
        searchValueControl?.setValidators([
          Validators.required,
          Validators.pattern(/^\d{2}-?\d{7}$/)
        ]);
      } else {
        searchValueControl?.setValidators([
          Validators.required,
          Validators.minLength(3)
        ]);
      }
      searchValueControl?.updateValueAndValidity();
    });
  }

  onSubmit(): void {
    if (this.searchForm.valid) {
      this.isLoading = true;
      this.searchResults = null;
      this.searchError = null;

      const formValue = this.searchForm.value;
      const searchRequest = formValue.searchType === 'ein' 
        ? { ein: formValue.searchValue }
        : { organizationName: formValue.searchValue };

      this.nonprofitService.searchNonprofit(searchRequest).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            this.searchResults = response;
            this.snackBar.open('Search completed successfully!', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          } else {
            this.searchError = 'Search failed. Please try again.';
            this.snackBar.open('Search failed', 'Close', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.searchError = 'An error occurred while searching. Please try again.';
          this.snackBar.open('Search failed. Please try again.', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
          console.error('Search error:', error);
        }
      });
    }
  }

  clearResults(): void {
    this.searchResults = null;
    this.searchError = null;
    this.searchForm.reset({ searchType: 'ein' });
  }

  getErrorMessage(fieldName: string): string {
    const field = this.searchForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${fieldName} is required`;
    }
    if (field?.hasError('pattern')) {
      return 'EIN must be in format XX-XXXXXXX';
    }
    if (field?.hasError('minlength')) {
      return `${fieldName} must be at least 3 characters`;
    }
    return '';
  }
}


