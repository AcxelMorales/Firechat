import { Component, OnInit } from '@angular/core';

import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styles: []
})
export class ChatComponent implements OnInit {

  // Mensaje del input
  mensaje: string;

  // Elemento en el HTML
  elemento: HTMLElement;;

  // Inyectamos el servicio
  constructor(public _serviceChat: ChatService) {
    // Obtenemos los mensajes y nos subscribimos para obtener respuesta
    // y ponemos el scroll en el último mensaje
    this._serviceChat.getMesagges()
      .subscribe(() => {
        setTimeout(() => {
          this.elemento.scrollTop = this.elemento.scrollHeight;
        }, 20)
      })
  }

  ngOnInit(): void {
    this.elemento = document.getElementById('app-mensajes');
  }

  // Enviamos el mensaje y validamos
  sendMessage(message: string): any {
    if (this.mensaje === undefined || null) return alert('LLena el campo')
    if (message.length === 0 || undefined || null) return alert();
    this.mensaje = null;
    this._serviceChat.addMessage(message)
      .then(() => console.log('Mensaje enviado'))
      .catch(err => console.error('Error al enviar', err))
  }

}
