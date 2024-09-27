import { ClientService } from './../../../client/services/client.service';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Client } from '../../../client/components/interfaces/Client';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './order-form.component.html',
  styleUrl: './order-form.component.scss'
})
export class OrderFormComponent {

  @Output() submitForm = new EventEmitter<any>();

  private clientService = inject(ClientService);
  private formBuilder = inject(FormBuilder);

  public clients: Client[] = [];

  public orderForm = this.formBuilder.group({
    expectedDeliveryDate: [''],
    client: ['']
  });

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    this.clientService.getClients(1, 0).subscribe((response) => {
      this.clients = response.items;
    })
  }

  Submit() {
    // Émettre l'événement avec les valeurs du formulaire
    this.submitForm.emit(this.orderForm.value);
  }
}
