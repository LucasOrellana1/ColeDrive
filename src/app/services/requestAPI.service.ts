import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestAPIService {
  private apiUrl = 'http://localhost:3000'; // Assuming your server is running locally on port 3000

  constructor(private http: HttpClient) { }

  buscarPatente(patente: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${patente}`);
  }
}
