import { Component, Inject, PLATFORM_ID } from "@angular/core";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { AuthService } from "../services/auth.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent {
  loginForm: FormGroup;
  forgotForm: FormGroup;
  showPassword = false;
  isLoading = false;
  isSending = false;
  private isBrowser: boolean;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    // Limpiar token si ya estaba
    if (this.isBrowser && localStorage.getItem("authToken")) {
      localStorage.removeItem("authToken");
    }

    // Login form
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    });

    // Forgot password form
    this.forgotForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: (token) => {
          this.router.navigate(["/dashboard"]);
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Correo o contraseña incorrectos",
          });
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
  sendResetLink() {
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }

    this.isSending = true;
    const email = this.forgotForm.get('email')?.value;

    this.authService.sendResetPasswordEmail(email).subscribe({
      next: () => {
        this.isSending = false;
        Swal.fire({
          icon: 'success',
          title: 'Correo enviado',
          text: 'Revisa tu bandeja de entrada.',
          confirmButtonColor: '#096dad',
        });
        document.getElementById('closeModalBtn')?.click();
      },
      error: (err) => {
        this.isSending = false;
        Swal.fire({
          icon: 'warning',
          title: 'Correo no encontrado',
          text: err.error?.error || 'El correo ingresado no está registrado.',
          confirmButtonColor: '#096dad',
        });
      }
    });
  }

}
