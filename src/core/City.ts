import { BalanceMap, CityType, CountryType } from '../types';
import  { findCityByCoordinates } from '../utils';

const INITIAL_AMOUNT = 1000000;
const BILL_MULTI = 1 / 1000;

export default class City implements CityType {
    x: number;
    y: number;
    currentBalance: BalanceMap
    incomingBalance: BalanceMap;
    outcomingBalance: BalanceMap;
    neighbours: City[];
    country: CountryType | null;


    constructor (x: number, y: number) {
        this.x = x;
        this.y = y;
        this.currentBalance = {}
        this.incomingBalance = {}
        this.outcomingBalance = {}
        this.neighbours = []
        this.country = null;
    }

    receiveIncome (countryName: string, amount: number) {
        this.incomingBalance[countryName] += amount
    }

    incomeToCurrent () {
        Object.keys(this.incomingBalance).map(key => 
            this.currentBalance[key]+= this.incomingBalance[key]
        )
    }

    flushIncome () {
        Object.keys(this.incomingBalance).map(key =>
            this.incomingBalance[key] = 0
        )
    }

    setBalances (countries: CountryType[]) {
        countries.map(({ name }) => {
            if (this.country?.name === name) {
                this.currentBalance[name] = INITIAL_AMOUNT
            }
            else 
                this.currentBalance[name] = 0
            this.incomingBalance[name] = 0
            this.outcomingBalance[name] = 0
        })
    }

    countOutcome () {
        Object.keys(this.currentBalance).forEach(key => {
            this.outcomingBalance[key] = Math.floor(this.currentBalance[key] * BILL_MULTI)
        }) 
    }

    pay (countryName: string) {
        this.currentBalance[countryName]-=this.outcomingBalance[countryName]
        return this.outcomingBalance[countryName]
    }

    addNeighbour(city?: City) {
        if (city && !findCityByCoordinates(this.neighbours, city.x, city.y))
            this.neighbours.push(city)
    }

    checkReadyStatus(countries: CountryType[]) {
        return countries.reduce((acc, { name }) => acc && (this.currentBalance[name] !== 0), true)
    }
}
