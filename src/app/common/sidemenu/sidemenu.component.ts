import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MENU_ITEMS } from '../../utils/menu-items';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-sidemenu',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, RouterLinkActive],
  templateUrl: './sidemenu.component.html',
})
export class SidemenuComponent implements OnInit {
  dropdownIndex: number | null = null;
  subDropdownIndex: Map<number, number | null> = new Map();
  grandSubDropdownIndex: Map<number, Map<number, number | null>> = new Map();

  menuItems = MENU_ITEMS;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    const userRole = this.authService.getRole(); // viene desde localStorage

    // ✅ Si no es ADMIN, filtramos el ítem "Usuarios"
    if (userRole !== 'ADMIN') {
      this.menuItems = this.menuItems.filter(item => item.title !== 'Usuarios');
    }
  }

  toggleDropdown(index: number): void {
    this.dropdownIndex = this.dropdownIndex === index ? null : index;
  }

  toggleSubDropdown(parentIndex: number, childIndex: number): void {
    const current = this.subDropdownIndex.get(parentIndex);
    this.subDropdownIndex.set(parentIndex, current === childIndex ? null : childIndex);
  }

  toggleGrandSubDropdown(parentIndex: number, childIndex: number, grandChildIndex: number): void {
    if (!this.grandSubDropdownIndex.has(parentIndex)) {
      this.grandSubDropdownIndex.set(parentIndex, new Map());
    }
    const subMap = this.grandSubDropdownIndex.get(parentIndex)!;
    const current = subMap.get(childIndex);
    subMap.set(childIndex, current === grandChildIndex ? null : grandChildIndex);
  }

  logout(): void {
    this.authService.logout(); // cierre de sesión
  }
}
