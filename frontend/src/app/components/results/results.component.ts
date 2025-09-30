import { Component, Input } from '@angular/core';
import { NonprofitResponse } from '../../models/nonprofit.model';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent {
  @Input() searchResults!: NonprofitResponse;

  getComplianceStatusClass(isCompliant: boolean): string {
    return isCompliant ? 'compliant' : 'non-compliant';
  }

  getComplianceStatusText(isCompliant: boolean): string {
    return isCompliant ? 'Compliant' : 'Non-Compliant';
  }

  getBmfStatusClass(bmfCompliant: boolean): string {
    return bmfCompliant ? 'active' : 'inactive';
  }

  getBmfStatusText(bmfCompliant: boolean): string {
    return bmfCompliant ? 'Active' : 'Inactive';
  }

  getPub78StatusClass(pub78Compliant: boolean): string {
    return pub78Compliant ? 'active' : 'inactive';
  }

  getPub78StatusText(pub78Compliant: boolean): string {
    return pub78Compliant ? 'Active' : 'Inactive';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatConfidence(confidence: number): string {
    return `${Math.round(confidence * 100)}%`;
  }
}


