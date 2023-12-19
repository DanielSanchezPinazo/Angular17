import { HttpClient } from '@angular/common/http';
import { Injectable, signal, inject, computed } from '@angular/core';
import { State } from '@interfaces/state.interface';
import type { UserResponse, UsersResponse } from '@interfaces/request-response.interface';
import { delay, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private http = inject( HttpClient );

  #state = signal<State>({
// la almohadilla indica que siempre es privado (en ES6) a diferencia de "private" que desaparece al compilar

    loading: true,
    users: []
  });

  public users = computed( () => this.#state().users );
  public loading = computed( () => this.#state().loading );

  constructor() {

    this.http.get<UsersResponse>("https://reqres.in/api/users")
      .pipe( delay(1500) )
      .subscribe( res => {

        this.#state.set( {
          loading: false,
          users: res.data
        })
      });
  }

  getUserById( id: string ) {

    return this.http.get<UserResponse>(`https://reqres.in/api/users/${ id }`)
      .pipe(
        delay(1500),
        map( resp => resp.data )
      );
  }

}
