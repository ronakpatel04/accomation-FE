import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InvoiceService } from '../../services/invoice.service';
import { ToastrServices } from '../../services/toastr.service';

interface Invoice {
  id: number;
  fromName: string;
  fromAddress: string;
  toName: string;
  toAddress: string;
  invoiceDate: string;
  invoiceNumber: string;
  createdAt: string;
  totalAmount?: number;  // Optional field, if you have it
}
@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.css'
})
export class InvoiceComponent implements OnInit {
  invoices: any;
  newProduct: any = { name: '', composition: '' };
  displayDialog: boolean = false;
  invoiceForm: FormGroup;
  displayInvoiceDetailsDialog :boolean = false;
  selectedInvoice:any;
  totalAmountOfItems : number =0 ;

  showDialogToAdd() {
    this.displayDialog = true;
  }

  constructor(private fb: FormBuilder, private invoiceService:InvoiceService,private toastrService:ToastrServices) {
    this.invoiceForm = this.fb.group({
      fromName: ['', Validators.required],
      fromAddress: ['', Validators.required], 
      toName: ['', Validators.required],
      toAddress: ['', Validators.required],  
      invoiceDate: [null, Validators.required],
      items: this.fb.array([])  
    });
  
  }
  ngOnInit(): void {
    this.getAllInvoices();
  }

  get items() {
    return this.invoiceForm.get('items') as FormArray;
  }

  createItem(): FormGroup {
    return this.fb.group({
      itemName: ['', Validators.required],
      quantity: [0, [Validators.required, Validators.min(1)]],
      rate: [0, [Validators.required, Validators.min(0)]],
    });
  }

  addItem() {
    this.items.push(this.createItem());
  }

  removeItem(index: number) {
    this.items.removeAt(index);
  }

  getItemTotal(item: any) {
    return item.value.quantity * item.value.rate;
  }

  submitInvoice() {
    console.log(this.invoiceForm.value);
    this.invoiceService.addInvoice(this.invoiceForm.value).subscribe(data =>{
      if(data){
        this.toastrService.showSuccess();
        this.displayDialog = false;
        this.getAllInvoices();
      }
    })
  }

  getAllInvoices(){
    this.invoiceService.getInvoices().subscribe(data=>{
      this.invoices = data;
    })
  }
  calculateTotal(data: any) {
    this.totalAmountOfItems =  data.items.reduce((sum:any, item:any) => sum + item.total, 0);
    console.log("this.totalAmountOfItems =>" , this.totalAmountOfItems)
  }

  viewInvoiceDetails(invoice:Invoice){
    this.displayInvoiceDetailsDialog = true;
    this.invoiceService.getInvoiceDetailsById(invoice.id).subscribe(data=>{
      this.selectedInvoice = data;
      this.calculateTotal(data)
    })
    }
}
  

  


