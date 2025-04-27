import { AuthService } from './../services/auth.service';
import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import Swal from 'sweetalert2';

export interface Profile {
  profileImage?: string;
  name: string;
  lastName: string;
  documentType: string;
  documentNumber: string;
  cellPhone: string;
  email: string;
  role: 'admin' | 'user';
}

@Component({
  selector: "app-profile",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"],
})
export class ProfileComponent implements OnInit {
  profile: Profile = {} as Profile;
  editableProfile: Profile = {} as Profile;
  documentTypes = ["DNI", "Pasaporte", "Cédula", "Otro"];
  editMode = false;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.cargarPerfil();
  }

  cargarPerfil(): void {
    this.authService.getLoggedUserInfo().subscribe({
      next: (data) => {
        this.profile = data;
        this.editableProfile = { ...data };
      },
      error: (err) => {
        Swal.fire("Error", "❌ Ocurrió un error al obtener tu perfil", "error");
      }
    });
  }

  volverAlDashboard(): void {
    this.router.navigate(["/dashboard"]);
  }

  toggleEditMode(): void {
    if (this.editMode) {
      const payload = {
        name: this.editableProfile.name,
        lastName: this.editableProfile.lastName,
        documentType: this.editableProfile.documentType,
        documentNumber: this.editableProfile.documentNumber,
        cellPhone: this.editableProfile.cellPhone,
        profileImage: this.editableProfile.profileImage
      };

      this.authService.updateMyProfile(payload).subscribe({
        next: (res) => {
          this.profile = { ...this.editableProfile };
          this.editMode = false;
          Swal.fire("Perfil actualizado", "✅ Tus datos se guardaron correctamente", "success");
        },
        error: (err) => {
          Swal.fire("Error", "❌ Ocurrió un error al guardar los cambios", "error");
        }
      });
    } else {
      this.editableProfile = { ...this.profile };
      this.editMode = true;
    }
  }

  cancelEdit(): void {
    this.editableProfile = { ...this.profile };
    this.editMode = false;
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.editableProfile.profileImage = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
}
