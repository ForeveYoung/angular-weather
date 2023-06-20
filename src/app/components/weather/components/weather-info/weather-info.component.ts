import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  catchError,
  EMPTY,
  of,
  Subscriber,
  Subscription,
  switchMap,
  tap,
} from 'rxjs';
import { WeatherService } from 'src/app/services/weather.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IWeather } from 'src/app/interfaces/IWeather.interface';
import { TEMPERATURE_NAME } from 'src/app/enums/temperature-name.enum';
import { ITemperatureName } from 'src/app/interfaces/ITemperatureName.interface';
import { ERROR_MESSAGES } from 'src/app/constants/error-messages.constant';

@Component({
  selector: 'app-weather-info',
  templateUrl: './weather-info.component.html',
  styleUrls: ['./weather-info.component.scss'],
})
export class WeatherInfoComponent implements OnInit, OnDestroy {
  @Input()
  public weatherForm: FormGroup;

  public tempForm: FormGroup;

  public weatherInfo: IWeather | null;

  public city: string;

  public temperatureName: TEMPERATURE_NAME = TEMPERATURE_NAME.CELSIUS;

  public temperatureNames = TEMPERATURE_NAME;

  public weatherFormSubscription: Subscription | undefined;

  public temperatureFormSubscription: Subscription;

  constructor(
    private _weatherService: WeatherService,
    private _snackBar: MatSnackBar,
    private _fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this._getWeather();
    this.tempForm = this._createForm();
    this._setTemperatureName();
  }

  private _getWeather() {
    this.weatherFormSubscription = this.weatherForm
      .get('city')
      ?.valueChanges.pipe(
        switchMap((city: string) => {
          this.city = city;

          return this._weatherService.getWeather(city).pipe(
            catchError(() => {
              this._snackBar.open(ERROR_MESSAGES.defaultError, 'Close', {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                duration: 5000,
              });

              this.weatherInfo = null;

              return EMPTY;
            })
          );
        })
      )
      .subscribe((info: IWeather) => {
        this.weatherInfo = info;
      });
  }

  private _setTemperatureName() {
    this.temperatureFormSubscription = this.tempForm.valueChanges.subscribe(
      (tempName: ITemperatureName) => {
        this.temperatureName = tempName.temperature;
      }
    );
  }

  private _createForm() {
    return this._fb.group({
      temperature: [this.temperatureNames.CELSIUS],
    });
  }

  ngOnDestroy(): void {
    this.weatherFormSubscription?.unsubscribe();
    this.temperatureFormSubscription?.unsubscribe();
  }
}
