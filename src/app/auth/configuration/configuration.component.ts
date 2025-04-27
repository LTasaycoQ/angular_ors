import { AuthService } from './../services/auth.service';
import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import firebase from "firebase/compat/app";
import Swal from "sweetalert2";

@Component({
  selector: "app-configuration",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: "./configuration.component.html",
  styleUrls: ["./configuration.component.css"],
})
export class ConfigurationComponent implements OnInit {
  emailForm: FormGroup;
  passwordForm: FormGroup;

  emailSuccess = false;
  passwordSuccess = false;

  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private afAuth: AngularFireAuth,
    private authService: AuthService
  ) {
    this.emailForm = this.fb.group(
      {
        currentEmail: [{ value: "", disabled: true }],
        newEmail: ["", [Validators.required, Validators.email]],
        confirmEmail: ["", [Validators.required, Validators.email]],
      },
      { validators: this.emailsMatchValidator }
    );

    this.passwordForm = this.fb.group(
      {
        newPassword: [
          "",
          [
            Validators.required,
            Validators.minLength(6),
          ],
        ],
        confirmPassword: ["", [Validators.required]],
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  ngOnInit(): void {
    this.afAuth.currentUser.then((user) => {
      if (user?.email) {
        this.emailForm.patchValue({ currentEmail: user.email });
      }
    });
  }

  emailsMatchValidator(group: FormGroup) {
    const newEmail = group.get("newEmail")?.value;
    const confirmEmail = group.get("confirmEmail")?.value;
    return newEmail === confirmEmail ? null : { emailsNotMatch: true };
  }

  passwordsMatchValidator(group: FormGroup) {
    const newPassword = group.get("newPassword")?.value;
    const confirmPassword = group.get("confirmPassword")?.value;
    return newPassword === confirmPassword ? null : { passwordsNotMatch: true };
  }

  onSubmitEmail() {
    if (this.emailForm.valid) {
      const newEmail = this.emailForm.get("newEmail")?.value;

      this.afAuth.currentUser.then((user) => {
        if (user && user.email) {
          Swal.fire({
            title: "Confirma tu contraseña actual",
            input: "password",
            inputPlaceholder: "Contraseña actual",
            inputAttributes: {
              autocapitalize: "off",
              autocorrect: "off",
            },
            showCancelButton: true,
            confirmButtonText: "Continuar",
            showLoaderOnConfirm: true,
            preConfirm: (password) => {
              const credential = firebase.auth.EmailAuthProvider.credential(
                user.email!,
                password
              );
              return user
                .reauthenticateWithCredential(credential)
                .then(() => true)
                .catch(() => {
                  Swal.showValidationMessage("❌ Contraseña incorrecta");
                  return false;
                });
            },
          }).then((result) => {
            if (result.isConfirmed) {
              this.authService.changeEmail(newEmail).subscribe({
                next: async () => {
                  this.emailSuccess = true;

                  await Swal.fire({
                    title: "Correo actualizado",
                    text: "Por seguridad debes volver a iniciar sesión con tu nuevo correo.",
                    icon: "success",
                    confirmButtonText: "Ir al login"
                  });

                  this.authService.logout(); // te redirige al login
                },
                error: (err) => {
                  Swal.fire("Error", err.message || "Error al actualizar en backend", "error");
                },
              });
            }
          });
        }
      });
    } else {
      Object.keys(this.emailForm.controls).forEach((key) => {
        this.emailForm.get(key)?.markAsTouched();
      });
    }
  }
  onSubmitPassword() {
    if (this.passwordForm.valid) {
      const newPassword = this.passwordForm.get("newPassword")?.value;

      this.afAuth.currentUser.then((user) => {
        if (user && user.email) {
          Swal.fire({
            title: "Confirma tu contraseña actual",
            input: "password",
            inputPlaceholder: "Contraseña actual",
            inputAttributes: {
              autocapitalize: "off",
              autocorrect: "off",
            },
            inputValidator: (value) => {
              if (!value) {
                return "⚠️ Debes ingresar tu contraseña actual";
              }
              return null;
            },
            showCancelButton: true,
            confirmButtonText: "Continuar",
            showLoaderOnConfirm: true,
            preConfirm: (currentPassword) => {
              const credential = firebase.auth.EmailAuthProvider.credential(
                user.email!,
                currentPassword
              );
              return user
                .reauthenticateWithCredential(credential)
                .then(() => true)
                .catch(() => {
                  Swal.showValidationMessage("❌ Contraseña incorrecta");
                  return false;
                });
            },
          }).then((result) => {
            if (result.isConfirmed) {
              this.authService.changePassword(newPassword).subscribe({
                next: async () => {
                  this.passwordSuccess = true;

                  await Swal.fire({
                    title: "Contraseña actualizada",
                    text: "Por seguridad debes volver a iniciar sesión.",
                    icon: "success",
                    confirmButtonText: "Ir al login"
                  });

                  this.authService.logout(); // cierra sesión y redirige
                },
                error: (err) => {
                  Swal.fire("Error", err.message || "Error al cambiar la contraseña", "error");
                },
              });
            }
          });
        }
      });
    } else {
      Object.keys(this.passwordForm.controls).forEach((key) => {
        this.passwordForm.get(key)?.markAsTouched();
      });
    }
  }

  togglePasswordVisibility(field: string) {
    if (field === "current") this.showCurrentPassword = !this.showCurrentPassword;
    if (field === "new") this.showNewPassword = !this.showNewPassword;
    if (field === "confirm") this.showConfirmPassword = !this.showConfirmPassword;
  }

  volverAlDashboard() {
    this.router.navigate(["/dashboard"]);
  }
}
