import { environment } from '../../environments/environments';
import { AuthService } from '../auth/services/auth.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, from, switchMap } from 'rxjs';
import { WorkshopRequestDto, WorkshopResponseDto } from '../interfaces/workshop.interface';

@Injectable({ providedIn: 'root' })
export class WorkshopService {
  private workshopUrl = `${environment.ms_workshop}/api/workshops`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private withAuthHeaders(): Observable<HttpHeaders> {
    return from(this.authService.getToken()).pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        });
        return from([headers]);
      })
    );
  }

  findAll(status?: string, dateStart?: string, dateEnd?: string): Observable<WorkshopResponseDto[]> {
    return this.withAuthHeaders().pipe(
      switchMap(headers => {
        let params = new HttpParams();
        if (status) params = params.set('status', status);
        if (dateStart) params = params.set('dateStart', dateStart);
        if (dateEnd) params = params.set('dateEnd', dateEnd);

        return this.http.get<WorkshopResponseDto[]>(this.workshopUrl, { headers, params });
      })
    );
  }

  findById(id: number): Observable<WorkshopResponseDto> {
    return this.withAuthHeaders().pipe(
      switchMap(headers =>
        this.http.get<WorkshopResponseDto>(`${this.workshopUrl}/${id}`, { headers })
      )
    );
  }

  create(workshop: WorkshopRequestDto): Observable<WorkshopResponseDto> {
    return this.withAuthHeaders().pipe(
      switchMap(headers =>
        this.http.post<WorkshopResponseDto>(this.workshopUrl, workshop, { headers })
      )
    );
  }

  update(id: number, workshop: WorkshopRequestDto): Observable<WorkshopResponseDto> {
    return this.withAuthHeaders().pipe(
      switchMap(headers =>
        this.http.put<WorkshopResponseDto>(`${this.workshopUrl}/${id}`, workshop, { headers })
      )
    );
  }

  disable(id: number): Observable<void> {
    return this.withAuthHeaders().pipe(
      switchMap(headers =>
        this.http.put<void>(`${this.workshopUrl}/${id}/disable`, {}, { headers })
      )
    );
  }

  restore(id: number): Observable<void> {
    return this.withAuthHeaders().pipe(
      switchMap(headers =>
        this.http.put<void>(`${this.workshopUrl}/${id}/restore`, {}, { headers })
      )
    );
  }

  delete(id: number): Observable<void> {
    return this.withAuthHeaders().pipe(
      switchMap(headers =>
        this.http.delete<void>(`${this.workshopUrl}/${id}`, { headers })
      )
    );
  }
}
