import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastrServices {

  constructor(private toastr: ToastrService) {}

  showSuccess() {
    this.toastr.success('Invoice Created successfully!', 'Success');
  }

  showError() {
    this.toastr.error('Something went wrong.', 'Error');
  }

  showInfo() {
    this.toastr.info('Here is some information.', 'Info');
  }

  showWarning() {
    this.toastr.warning('This is a warning.', 'Warning');
  }
}
