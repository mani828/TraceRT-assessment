import { Component } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridReadyEvent, GridApi, RowSelectedEvent } from 'ag-grid-community';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AgGridAngular, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  
  title = 'Patient Management Dashboard';
  private gridApi!: GridApi;
  private showGenderColumn = true; 

  columnDefs: ColDef[] = [
    { headerName: 'ID', field: 'id', sortable: true, filter: true, checkboxSelection: true },
    { headerName: 'Rule Name', field: 'ruleName', sortable: true, filter: true },
    { headerName: 'Active', field: 'active', sortable: true, filter: true },
    { headerName: 'Type', field: 'type', sortable: true, filter: true },
    { headerName: 'Sub Type', field: 'subType', sortable: true, filter: true },
    { headerName: 'Impacted', field: 'impacted', sortable: true, filter: true },
    { headerName: 'Scheduled', field: 'scheduled', sortable: true, filter: true },
    { headerName: 'Last Scheduled Date', field: 'lastScheduledDate', sortable: true, filter: true },
    { headerName: 'Alert', field: 'alert', sortable: true, filter: true }
  ];


  rowData = [
    { id: 997, ruleName: '2DS - Trace Changes', active: 'Y', type: 'Match', subType: '2DS - Trace Changes', impacted: 0, scheduled: 'Y', lastScheduledDate: '01-May-2024 01:15 PM', alert: 'Y' },
    { id: 996, ruleName: 'Trace Changes', active: 'Y', type: 'Match', subType: '2DS - Trace Changes', impacted: 0, scheduled: 'N', lastScheduledDate: '01-May-2024 01:15 PM', alert: 'N' },
    { id: 986, ruleName: 'File Monitor', active: 'Y', type: 'Match', subType: '1DS - File Monitor', impacted: 57994, scheduled: 'Y', lastScheduledDate: '01-May-2024 01:15 PM', alert: 'Y' },
    { id: 985, ruleName: 'testreve1', active: 'Y', type: 'Match', subType: '1DS - File Monitor', impacted: 13773, scheduled: 'N', lastScheduledDate: '01-May-2024 01:15 PM', alert: 'N' }
  ];

  

  selectedPatient: any = this.getEmptyPatient();
  isEditing = false;

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onQuickFilterInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (this.gridApi) {
      this.gridApi.setGridOption('quickFilterText', inputElement.value);
    }
  }

  getSelectedRows() {
    if (this.gridApi) {
      const selectedNodes = this.gridApi.getSelectedNodes();
      const selectedData = selectedNodes.map(node => node.data);
      console.log('📌 Selected Rows:', selectedData);
    }
  }

  toggleColumns() {
    this.showGenderColumn = !this.showGenderColumn;
    if (this.gridApi) {
      this.gridApi.applyColumnState({
        state: [{ colId: 'active', hide: !this.showGenderColumn }],
        applyOrder: true
      });
    }
  }
  onRowSelected(event: RowSelectedEvent) {
    if (event.node.isSelected()) { // ✅ Corrected from event.node.selected
      this.selectedPatient = { ...event.data };
      this.isEditing = true;
    }
  }

  savePatient() {
    if (this.isEditing) {
      this.rowData = this.rowData.map(patient =>
        patient.id === this.selectedPatient.id ? { ...this.selectedPatient } : patient
      );
      console.log('✅ Updated Patient:', this.selectedPatient);
    } else {
      this.rowData = [...this.rowData, { ...this.selectedPatient }];
      console.log('✅ New Patient Added:', this.selectedPatient);
    }
    
    this.selectedPatient = this.getEmptyPatient();
    this.isEditing = false;

    if (this.gridApi) {
      this.gridApi.setGridOption('rowData', this.rowData);
    }
  }
  
  getEmptyPatient() {
    return { patientId: '', name: '', age: '', gender: 'Male', diagnosis: '', admissionDate: '', dischargeDate: '', doctor: '', medicalHistory: '' };
  }

  resetForm() {
  this.selectedPatient = this.getEmptyPatient();
  this.isEditing = false;
}

}
