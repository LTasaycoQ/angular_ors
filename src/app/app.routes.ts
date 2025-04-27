import { Routes } from "@angular/router";
import { AuthGuard } from "./auth/guards/auth.guard";
import { ProfileComponent } from "./auth/profile/profile.component";
import { ConfigurationComponent } from "./auth/configuration/configuration.component";

export const routes: Routes = [
  // 🔹 Rutas de autenticación (No requieren autenticación)
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent),
    canActivate: [AuthGuard], // Usas el mismo guard
    canActivateChild: [AuthGuard], // opcional si es lazy
    data: { public: true }, // solo si quieres distinguir
  },

  // 🔹 Rutas protegidas
  {
    path: "",
    canMatch: [AuthGuard], // Protege todas las rutas hijas
    children: [
      {
        path: "dashboard",
        title: "Dashboard General",
        loadComponent: () =>
          import("./components/pages/dashboard/dashboard/dashboard.component").then(
            (m) => m.DashboardComponent
          ),
      },

      // 📌 Módulo de Personas
      {
        path: "modulo-personas",
        canMatch: [AuthGuard],
        children: [
          {
            path: "personas",
            title: "Dashboard Personas",
            loadComponent: () =>
              import("./components/pages/main/persons/dashboard/dashboard/dashboard.component").then(
                (m) => m.DashboardComponent
              ),
          },
        ],
      },

      // 📌 Módulo de Usuarios (solo para ADMIN)
      {
        path: "usuarios",
        canMatch: [AuthGuard],
        data: { role: "ADMIN" }, // 👈 Rol requerido
        title: "Gestión de Usuarios",
        loadComponent: () =>
          import("./components/pages/main/users/users.component").then(
            (m) => m.UsersComponent
          ),
      },

      // 📌 Módulo de Asistencias
      {
        path: "modulo-asistencias",
        canMatch: [AuthGuard],
        children: [
          {
            path: "dashboard",
            title: "Dashboard Asistencias",
            loadComponent: () =>
              import("./components/pages/main/assists/dashboard/dashboard/dashboard.component").then(
                (m) => m.DashboardComponent
              ),
          },
          {
            path: "talleres",
            title: "Talleres",
            loadComponent: () =>
              import("./components/pages/main/workshops/workshops.component").then(
                (m) => m.WorkshopsComponent
              ),
          }
        ],
      },

      // 📌 Módulo de Reportes
      {
        path: "modulo-reportes",
        canMatch: [AuthGuard],
        children: [
          {
            path: "reportes",
            title: "Reportes Trimestrales",
            loadComponent: () =>
              import("./components/pages/functionality/reports/reports.component").then(
                (m) => m.ReportsComponent
              ),
          },
        ],
      },

      // 📌 Módulo de Familia
      {
        path: "modulo-familia",
        canMatch: [AuthGuard],
        children: [
          {
            path: "dashboard",
            title: "Dashboard Familia",
            loadComponent: () =>
              import("./components/pages/functionality/familys/dashboard/dashboard.component").then(
                (m) => m.DashboardComponent
              ),
          },
        ],
      },

      // 📌 Módulo de Beneficiario
      {
        path: "modulo-beneficiarios",
        canMatch: [AuthGuard],
        children: [
          {
            path: "beneficiarios",
            title: "beneficiarios",
            loadComponent: () =>
              import("./components/pages/main/beneficiarios/beneficiarios.component").then(
                (m) => m.BeneficiariosComponent
              ),
          },
        ],
      },

      {
        path: 'perfil',
        component: ProfileComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'configuracion',
        component: ConfigurationComponent,
        canActivate: [AuthGuard]
      }

    ],
  },

  // 🔹 Redirecciones
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full",
  },
  {
    path: "**",
    redirectTo: "login",
  },
];
