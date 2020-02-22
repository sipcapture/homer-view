import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MappingService {

    private url = `${environment.apiUrl}/mapping`;

    constructor(private http: HttpClient) { }

    // Mapping protokols
    getProtokols(): Observable<any> {
        return this.http.get<any>(`${this.url}/protocols`);
    }

    // Mapping fields
    getFields(): Observable<any> {
        return this.http.get<any>(`${this.url}/fields`);
    }

}
