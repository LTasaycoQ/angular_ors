import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { AuthService } from "../../auth/services/auth.service";

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"],
})
export class NavbarComponent implements OnInit {
  isAuthenticated = false;
  userName: string = "";
  userEmail: string = "";
  userRoles: string[] = [];
  profileImage: string | null = null;
  isUserMenuOpen = false;
  isMenuOpen = false;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.isAuthenticated = this.authService.hasToken();

    if (this.isAuthenticated) {
      const userInfo = localStorage.getItem("userInfo");

      if (userInfo) {
        const user = JSON.parse(userInfo);
        this.userName = user.name;
        this.userEmail = user.email;
        this.profileImage = user.profileImage;
        this.userRoles = Array.isArray(user.role) ? user.role : [user.role];
      }

      // (opcional) actualiza en segundo plano desde el backend
      this.authService.getLoggedUserInfo().subscribe({
        next: (user) => {
          this.userName = user.name;
          this.userEmail = user.email;
          this.profileImage = user.profileImage;
          this.userRoles = Array.isArray(user.role) ? user.role : [user.role];
          localStorage.setItem("userInfo", JSON.stringify(user));
        },
        error: (err) => {
          console.error("❌ Error al obtener el usuario:", err.message);
        }
      });
    }
  }



  private getUserRoles(): void {
    this.authService.getUserRole().subscribe((roles) => {
      if (typeof roles === 'string') {
        this.userRoles = [roles];
      } else if (Array.isArray(roles)) {
        this.userRoles = roles;
      } else {
        this.userRoles = ['usuario'];
      }
    });
  }


  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    this.authService.logout();
  }

  truncateText(text: string | null | undefined, maxLength: number): string {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  }

  closeMenu() {
    this.isUserMenuOpen = false;
    this.isMenuOpen = false;
  }

}
