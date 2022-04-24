import { CityType, CountryType } from '../types';
import City from './City';

export default class Country implements CountryType {
    name: string;
    xl: number;
    yl: number;
    xh: number;
    yh: number;
    cities: City[];
    judgmentDay: number;

    constructor (
        name: string,
        southWestCity: City,
        northEastCity: City,
    ) {
        this.name = name
        this.xl = southWestCity.x
        this.yl = southWestCity.y
        this.xh = northEastCity.x
        this.yh = northEastCity.y
        southWestCity.country = this
        northEastCity.country = this
        this.cities = [southWestCity, northEastCity]
        this.judgmentDay = -1
    }
}
