import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CRUD } from 'src/app/shared/services/crud/crud';
import { CrudService } from 'src/app/shared/services/crud/crud.service';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';
import { environment } from 'variables.env';

export interface Answer {
  text: string;
  points: number;
}
export interface Question {
  text: string;
  order: number;
  options: Answer[];
}
@Injectable({
  providedIn: 'root',
})
export class ApiWealthManagementsService {
  crud: CRUD;

  entity = 'wealth-managements';
  env = environment.environment;
  constructor(private crudService: CrudService, private http: CustomHttpService) {
    this.crud = this.crudService.getEndpoints(this.entity);
  }

  getInvestorTestQuestions(): Observable<Question[]> {
    return new Observable((o) => {
      o.next([
        {
          text: '1. Estás en un programa de juegos de televisión y puedes elegir uno de los siguientes premios. ¿Cuál te llevarías?',
          order: 0,
          options: [
            { text: '$ 1,000 en efectivo', points: 1 },
            { text: 'Un 50% de posibilidades de ganar $ 5,000', points: 2 },
            { text: 'Un 25% de posibilidades de ganar $ 10,000', points: 3 },
            { text: 'Un 5% de posibilidades de ganar $ 100,000', points: 4 },
          ],
        },
        {
          text: '2. Cuando piensa en la palabra “riesgo”, ¿cuál de las siguientes palabras le viene a la mente primero?',
          order: 1,
          options: [
            { text: 'Pérdida', points: 1 },
            { text: 'Incertidumbre', points: 2 },
            { text: 'Oportunidad', points: 3 },
            { text: 'Emoción', points: 4 },
          ],
        },
        {
          text: '3. En general, ¿cómo te describirías como tomador de riesgos?',
          order: 2,
          options: [
            { text: 'Una persona jugada', points: 4 },
            {
              text: 'Soy una persona dispuesta a correr riesgos después de completar una investigación adecuada',
              points: 3,
            },
            { text: 'Persona cautelosa', points: 2 },
            { text: 'Verdaderamente evito los riesgos', points: 1 },
          ],
        },
        {
          text: '4. Si recibes inesperadamente 20,000 dólares para invertir, ¿qué harías?',
          order: 3,
          options: [
            { text: 'Depositarlo en una cuenta bancaria, una cuenta remunerada o un plazo fijo', points: 1 },
            { text: 'Comprar Bitcoin y otras criptomonedas estables', points: 2 },
            { text: 'Invertir en proyectos cripto iniciales con promesa de crecimiento', points: 3 },
          ],
        },
        {
          text: '5. Ahora, con estos  $ 20 000 se te presentan 3 opciones para diversificar tu inversión,¿cuál de las siguientes opciones de inversión encontrarás más atractivo?',
          order: 4,
          options: [
            {
              text: '60% en inversiones de bajo riesgo 30% en inversiones de riesgo medio 10% en inversiones de alto riesgo',
              points: 1,
            },
            {
              text: '30% en inversiones de bajo riesgo 40% en inversiones de medio riesgo 30% en inversiones de alto riesgo',
              points: 2,
            },
            {
              text: '10% en inversiones de bajo riesgo 40% en inversiones de medio riesgo 50% en inversiones de alto riesgo',
              points: 3,
            },
          ],
        },
      ]);
    });
  }

  saveInvestorTestScore(totalScore: number): Observable<any> {
    return new Observable((o) => {
      o.next();
    });
  }

  getInvestorProfile(): Observable<any> {
    return new Observable((o) => {
      o.next({ profile: 'wealth_managements.profiles.conservative' });
    });
  }
}
