import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'app/model/User';
import { Observable } from 'rxjs';
import baseUrl from './helper';

// servicio conecta con los formularios loginForm y RegisterForm
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private request:HttpClient) { }

  
  //metodos conexion con servidor crear, leer, loggear, eliminar, modificar
  createUser(u: User): Observable<object>{
    const headers = this.getheader();
    return this.request.post<User>(this.url+"/add", u);
  }

  deleteUser():Observable<object>{
    const headers = this.getheader();
    return  this.request.delete(this.url+"/delete", {headers});
  }


  getUser():Observable<User>{
    const headers = this.getheader();
    return this.request.get<User>(this.url+"/data", {headers}); 
  }

  getAllUsers():Observable<User>{
    const headers = this.getheader();
    return this.request.get<User>(this.url+"/all"); 
  }

  updateUser( u:User):Observable<object>{
    const headers = this.getheader();
    return this.request.patch<User>(this.url+"/update", u, {headers});

  }
  private getheader():HttpHeaders{
  
    const token:string = localStorage['token'];
    const headers= new HttpHeaders({
      'Content-Type':  'application/json',
      Authorization: token
    })
    return headers;
  }

  // conecta con UserController en el servidor
  private url = `${baseUrl}/porfolio/user`;
  
}
