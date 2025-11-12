import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class WebsocketsService {
  private readonly uri: string = 'http://localhost:3000';
  private socket!: Socket;
  private isConnected: boolean = false;

  public connect(id: string, token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!token || !id) {
        const error = 'No hay token o usuario';
        console.error(error);
        reject(error);
        return;
      }
      if (this.socket && this.socket.connected) {
        this.socket.disconnect();
      }
      this.socket = io(this.uri, {
        auth: { id, token }, transports: ['websocket']});

      this.socket.on('connect', () => {
        console.log('Connected to WebSocket');
        this.isConnected = true;
        resolve();
      });

      this.socket.on('connect_error', (error) => {
        console.error('WebSocket Connection error', error);
        reject(error);
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from WebSocket');
        this.isConnected = false;
      });

      setTimeout(() => {
        if (!this.isConnected) {
          reject('Timeout when connecting to WebSocket');
        }
      }, 5000);
    });
  }
  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.isConnected = false;
    }
  }
  public emit(eventName: string, data: any): void {
    if (!this.isConnected || !this.socket) {
      console.error('WebSocket no está conectado');
      return;
    }
    this.socket.emit(eventName, data);
  }
  public on<T = any>(eventName: string): Observable<T> {
    return new Observable<T>(observer => {
      if (!this.socket) {
        observer.error('WebSocket no inicializado');
        return;
      }
      
      this.socket.on(eventName, (data: T) => {
        observer.next(data);
      });
    });
  }
}