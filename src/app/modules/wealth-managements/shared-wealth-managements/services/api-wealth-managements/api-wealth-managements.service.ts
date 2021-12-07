import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiWealthManagementsService {
  constructor() {}

  getQuestions(): Observable<any> {
    return new Observable((o) => {
      o.next({
        Pregunta1: {
          text: 'Que tan arriesgado sos?',
          options: {
            opcion1: { text: 'Me asustan las cachorros', points: 1 },
            opcion2: { text: 'Mas o menos', points: 2 },
            opcion3: { text: 'Me tiro a la pileta sin agua', points: 3 },
          },
        },
        Pregunta2: {
          text: 'blablabla',
          options: {
            opcion1: { text: 'blablabla', points: 1 },
            opcion2: { text: 'blablabla', points: 2 },
            opcion3: { text: 'blablabla', points: 3 },
          },
        },
      });
    });
  }
}
