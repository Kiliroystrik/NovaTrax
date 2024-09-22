import { LoginCredentials } from './../../interfaces/LoginCredentials';
import { RegisterService } from './../../services/register.service';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Registration } from '../../interfaces/Registration';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm: FormGroup;
  step: number = 1;

  constructor(private fb: FormBuilder, private registerService: RegisterService, private router: Router, private authService: AuthService) {
    this.registerForm = this.fb.group({
      companyName: ['', [Validators.required, Validators.maxLength(100)]],
      contactEmail: ['', [Validators.required, Validators.email, Validators.maxLength(180)]],
      contactPhone: ['', [Validators.required, Validators.maxLength(50)]],
      userFirstName: ['', [Validators.required, Validators.maxLength(50)]],
      userLastName: ['', [Validators.required, Validators.maxLength(50)]],
      userEmail: ['', [Validators.required, Validators.email, Validators.maxLength(180)]],
      userPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(255)]]
    });
  }

  nextStep() {
    if (this.step < 3) {
      this.step++;
    }
  }

  previousStep() {
    if (this.step > 1) {
      this.step--;
    }
  }

  goToStep(step: number) {
    this.step = step;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      // Soumission du formulaire avec le service d'authentification
      this.registerService.register(this.registerForm.value as Registration).subscribe({
        next: () => {
          const loginInfo: LoginCredentials = {
            username: this.registerForm.value.userEmail,
            password: this.registerForm.value.userPassword
          };
          this.authService.login(loginInfo).subscribe({
            next: () => {
              this.router.navigate(['/dashboard']);
            },
            error: (err) => {
              console.error(err);
            }
          })
        },
        error: (err) => {
          console.error(err);
        }
      });
    }
  }
}