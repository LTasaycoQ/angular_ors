import { WorkshopRequestDto, WorkshopResponseDto } from '../../../../../interfaces/workshop.interface';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { WorkshopService } from '../../../../../services/workshop.service';

@Component({
  selector: 'app-workshop-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './workshop-modal.component.html',
  styleUrls: ['./workshop-modal.component.css']
})
export class WorkshopModalComponent implements OnInit {
  @Input() workshop: WorkshopResponseDto | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();

  formData: WorkshopRequestDto = {
    name: '',
    description: '',
    dateStart: new Date(), // Inicializar como Date
    dateEnd: new Date()     // Inicializar como Date
  };

  showStartDateCalendar = false;
  showEndDateCalendar = false;
  currentMonth = new Date();
  months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  weekdays = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

  constructor(private workshopService: WorkshopService) { }

  ngOnInit(): void {
    if (this.workshop) {
      this.formData = {
        name: this.workshop.name,
        description: this.workshop.description || '',
        dateStart: new Date(this.workshop.dateStart),
        dateEnd: new Date(this.workshop.dateEnd)
      };
    }
  }


  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = this.months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} / ${month} / ${year}`;
  }

  toggleCalendar(type: 'start' | 'end') {
    this.showStartDateCalendar = type === 'start' ? !this.showStartDateCalendar : false;
    this.showEndDateCalendar = type === 'end' ? !this.showEndDateCalendar : false;
  }

  selectDate(day: number, type: 'start' | 'end') {
    const selected = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), day);
    if (type === 'start') {
      this.formData.dateStart = selected; // Asignar como Date
      this.showStartDateCalendar = false;
    } else {
      this.formData.dateEnd = selected; // Asignar como Date
      this.showEndDateCalendar = false;
    }
  }

  previousMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1);
  }

  nextMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
  }

  generateCalendarDays(month: Date): number[] {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    const firstDay = new Date(year, monthIndex, 1).getDay();
    const startIndex = (firstDay + 6) % 7;
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    return Array.from({ length: startIndex + daysInMonth }, (_, i) =>
      i < startIndex ? 0 : i - startIndex + 1
    );
  }

  isDateDisabled(day: number, type: 'end' | 'start'): boolean {
    if (type === 'end' && this.formData.dateStart) {
      const start = this.formData.dateStart;
      const end = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), day);
      return end < start;
    }
    return false;
  }

  isFormValid(): boolean {
    return !!(this.formData.name && this.formData.dateStart && this.formData.dateEnd);
  }

  onSubmit(): void {
    const dto: WorkshopRequestDto = {
      name: this.formData.name,
      description: this.formData.description,
      dateStart: this.formData.dateStart,
      dateEnd: this.formData.dateEnd
    };

    if (this.workshop) {
      // Editar
      this.workshopService.update(this.workshop.id, dto).subscribe({
        next: () => {
          Swal.fire('Actualizado', 'El taller fue actualizado correctamente.', 'success');
          this.save.emit();
          this.close.emit();
        },
        error: () => {
          Swal.fire('Error', 'No se pudo actualizar el taller.', 'error');
        }
      });
    } else {
      // Crear
      this.workshopService.create(dto).subscribe({
        next: () => {
          Swal.fire('Creado', 'El taller fue creado correctamente.', 'success');
          this.save.emit();
          this.close.emit();
        },
        error: () => {
          Swal.fire('Error', 'No se pudo crear el taller.', 'error');
        }
      });
    }
  }

  onCancel(): void {
    this.close.emit();
  }
}
