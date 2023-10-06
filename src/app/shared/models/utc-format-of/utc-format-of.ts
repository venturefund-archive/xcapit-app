import { format, utcToZonedTime } from 'date-fns-tz';

export class UtcFormatOf {
  private _timeZone = 'UTC';

  constructor(private _aDate: Date) {}

  value(): string {
    return format(utcToZonedTime(this._aDate, this._timeZone), "yyyy-MM-dd'T'HH:mm:ssXXX", {
      timeZone: this._timeZone,
    });
  }
}
