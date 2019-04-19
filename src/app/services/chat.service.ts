import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

import Chat from '../models/Chat';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  // Doc firebase
  private chatsCollection: AngularFirestoreCollection<Chat>;

  // Arreglo de chats
  public chats: Chat[] = [];

  // 
  public usuario: any = {};

  // Intección de servicio
  constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe(
      user => {
        if (!user) return;
        this.usuario.nombre = user.displayName;
        this.usuario.uid = user.uid;
      }
    );
  }

  // Método para obtener todos los mensajes
  public getMesagges(): Observable<void> {
    // Doc firebase                            Tipo   cll              Query
    this.chatsCollection = this.afs.collection<Chat>('chats', ref => ref.orderBy('fecha', 'desc')
      .limit(8)); // Limite

    return this.chatsCollection.valueChanges().pipe(
      map((messages: Chat[]) => {
        // Ordenamos los elementos de primero a último
        this.chats = [];
        for (const i of messages) {
          this.chats.unshift(i);
        }
      })
    );
  }

  // Método para Agregar un mensaje
  public addMessage(text: string): Promise<any> {
    // Objeto
    let message: Chat = {
      nombre: this.usuario.nombre,
      mensaje: text,
      fecha: new Date().getTime(),
      uid: this.usuario.uid
    };

    // Agregamos el mensaje
    return this.chatsCollection.add(message);
  }

  login(proveedor: string) {
    if (proveedor === 'google') this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }
  logout() {
    this.usuario = {};
    this.afAuth.auth.signOut();
  }

}
