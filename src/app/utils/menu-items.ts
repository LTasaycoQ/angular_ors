// menu.model.ts
export interface MenuItem {
  title: string;
  path?: string;
  icon?: string;
  children?: MenuItem[];
  role?: string[];
}

export const MENU_ITEMS: MenuItem[] = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: "dashboard",
  },
  {
    title: "Principal",
    icon: "grid",
    children: [
      { title: "Usuarios", path: "/usuarios", icon: "users", role: ["ADMIN"] },
      { title: "Personas", path: "/modulo-personas/personas", icon: "user" },
      { title: "Beneficiarios", path: "/modulo-beneficiarios/beneficiarios", icon: "user" },
      { title: "Talleres", path: "/modulo-asistencias/talleres", icon: "clipboard" },
    ]
  },
  {
    title: "Funcionalidades",
    icon: "layers",
    children: [
      { title: "Asistencias", path: "/modulo-asistencias/dashboard", icon: "calendar" },
      { title: "Familia", path: "/modulo-familia/dashboard", icon: "home" },
      { title: "Reportes", path: "/modulo-reportes/reportes", icon: "file-text" },
    ]
  }
];
