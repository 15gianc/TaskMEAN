import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  nuevoMensaje: string = '';
  mensajes: any = [
    {
      emisor: 'bot',
      texto: 'Hola, ¿que tal?',
    },
  ];

  possibleAnswers = [
    '¡Hola! Soy Enco. Tu asistente en <Encode>, ¿En qué te puedo ayudar?',
    'Eso es sencillo. Para crear una tarea, debes acceder al botón de "+" que se encuentra a tu izquierda. 😊',
    'Puedes verla accediendo al boton con la imagen de una pequeña lista, se encuentra arriba de el boton de crear una tarea.',
    'Gracias a ti por usar <Encode> 💜'
  ];

  isClosed: boolean = true;

  constructor() {}

  ngOnInit(): void {}
  enviarMensaje() {
    this.mensajes.push({
      emisor: 'id',
      texto: this.nuevoMensaje,
    });

    if (this.mensajes.length < 3) {
      setTimeout(() => {
        this.mensajes.push({
          emisor: 'bot',
          texto: this.possibleAnswers[0],
        });
      }, 450);
    } else if (this.mensajes.length < 5) {
      setTimeout(() => {
        this.mensajes.push({
          emisor: 'bot',
          texto: this.possibleAnswers[1],
        });
      }, 450);
    } else if (this.mensajes.length < 7) {
      setTimeout(() => {
        this.mensajes.push({
          emisor: 'bot',
          texto: this.possibleAnswers[2],
        });
      }, 450);
    } else {
      setTimeout(() => {
        this.mensajes.push({
          emisor: 'bot',
          texto: this.possibleAnswers[3],
        });
      }, 450);
    }

    this.nuevoMensaje = '';
  }
  open() {
    this.isClosed = false;
  }

  close() {
    this.isClosed = true;
  }
}