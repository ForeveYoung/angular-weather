import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IWeather } from '../interfaces/IWeather.interface';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private _key = '65474f92301447e6857184530231906';

  constructor(private _http: HttpClient) {}

  public getWeather(city: string): Observable<IWeather> {
    const url = `http://api.weatherapi.com/v1/current.json?key=${this._key}&q=${city}&aqi=no`;

    return this._http.get<IWeather>(url);
  }
}
