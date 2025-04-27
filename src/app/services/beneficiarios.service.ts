// service/person.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BeneficiarioDTO } from '../interfaces/beneficiariosDTO';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})

export class BeneficiariosService {
  private apiUrl = `${environment.ms_beneficiario}/api/persons`;

  constructor(private http: HttpClient) {}

  //LISTADO DE TODOS LOS BENEFICIARIOS Y APADRINADOS ACTIVOS Y INACTIVOS
  getPersonsByTypeKinshipAndState(typeKinship: string, state: string): Observable<BeneficiarioDTO[]> {
    return this.http.get<BeneficiarioDTO[]>(`${this.apiUrl}/filter?typeKinship=${typeKinship}&state=${state}`);
  }

  //LISTADO DE SOLO LOS APRADRINADOS ACTIVOS Y INACTIVOS
  getPersonsBySponsoredAndState(sponsored: string, state: string): Observable<BeneficiarioDTO[]> {
    return this.http.get<BeneficiarioDTO[]>(`${this.apiUrl}/filter-sponsored?sponsored=${sponsored}&state=${state}`);
  }

  //LISTA TODOS LOS BENEFICIARIOS Y SUS DETALLES
  getPersonByIdWithDetails(id: number): Observable<BeneficiarioDTO> {
    return this.http.get<BeneficiarioDTO>(`${this.apiUrl}/${id}/details`);
  }

  //ELIMINADO LOGICO
  deletePerson(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/delete`);
  }

  //RESTAURADO LOGICO
  restorePerson(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/restore`, {});
  }

  //MODIFICACION DE DATOS DE BENEFICIARIOS Y APADRINADOS SIN GENERAR UN NUEVO ID
  updatePersonData(id: number, person: BeneficiarioDTO): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/update-person`, person);
  }

  //MODIFICACION DE DATOS DE EDUCATION Y HEALTH SIN GENERAR UN NUEVO ID
  correctEducationAndHealth(id: number, educationData: any): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/correct-education-health`, educationData);
  }

  updatePerson(id: number, person: BeneficiarioDTO): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/update`, person);
  }

  registerPerson(person: BeneficiarioDTO): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/register`, person);
  }
}
