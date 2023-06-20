import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CITIES } from 'src/app/constants/cities.constant';
import { ICity } from 'src/app/interfaces/ICity.interface';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
})
export class WeatherComponent implements OnInit {
  public weatherForm: FormGroup;

  public date: string;

  public cities: ICity[] = CITIES;

  constructor(private _fb: FormBuilder) {}

  ngOnInit(): void {
    this.weatherForm = this._createForm();
    this.date = this._getDate();
  }

  private _getDate(): string {
    const date = new Date();

    const weekDay = date.toLocaleDateString('default', { weekday: 'long' });
    const month = date.toLocaleDateString('default', { month: 'long' });
    const day = date.getDate();
    const year = date.getFullYear();

    return `${weekDay}, ${month} ${day}, ${year} `;
  }

  private _createForm() {
    return this._fb.group({
      city: [''],
    });
  }
}
