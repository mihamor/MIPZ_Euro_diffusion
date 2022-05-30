import City from './City';
import { areInBounds, findCityByCoordinates } from '../utils';
import { Grid, MapType } from '../types';
import Country from './Country';

enum Direction {
    East,
    West,
    North,
    South,
}


export default class Map implements MapType {
    cities: City[];
    countries: Country[];
    grid: Grid;

    constructor() {
        this.cities = [];
        this.countries = [];
        this.grid = this.makeGrid();
    }
    makeGrid () {
        const grid = new Array(10).fill(new Array(10));
        return grid;
    }

    init () {
        this.buildNeighbours()
        this.setInitialBalances()
    }

    buildNeighbours () {
        this.cities.map((city) => {
            const {x, y} = city;
            if(this.neighbourCityExists(x, y, Direction.West)) 
                city.addNeighbour(findCityByCoordinates(this.cities, x - 1, y));
            if(this.neighbourCityExists(x, y, Direction.East)) 
                city.addNeighbour(findCityByCoordinates(this.cities, x + 1, y));
            if(this.neighbourCityExists(x, y, Direction.North)) 
                city.addNeighbour(findCityByCoordinates(this.cities, x, y + 1));
            if(this.neighbourCityExists(x, y, Direction.South)) 
                city.addNeighbour(findCityByCoordinates(this.cities, x, y - 1));
        })
    }


    neighbourCityExists (x: number, y: number, dir: Direction) {
        switch(dir) {
            case Direction.West:
                return areInBounds(x, y) && this.grid[x-1][y] != 0;
            case Direction.East:
                return areInBounds(x, y) && this.grid[x+1][y] != 0;
            case Direction.North:
                return areInBounds(x, y) && this.grid[x][y+1] != 0;
            case Direction.South:
                return areInBounds(x, y) && this.grid[x][y-1] != 0; 
        }
    }

    setInitialBalances () {
        this.cities.map(city => city.setBalances(this.countries))
    }

    isJudgmentDay (day: number) {
        this.countries.map(country => {
            if (country.judgmentDay < 0)
             country.judgmentDay = day
        })
        return this.cities.reduce((acc, city) => {
            if(!city.checkReadyStatus(this.countries)) {
                city.country.judgmentDay = -1
                return acc && false;
            } else {
                return acc;
            }
        }, true)
    }

    performDiffusion () {
        if (this.countries.length === 1) {
            return {
                [this.countries[0].name]: 0
            }
        }
        this.init();
        let day = 0;
        do {
            this.skipDay()
            day++;
        } while(!this.isJudgmentDay(day))
        return this.getDiffusionResult()
    }

    skipDay () {
        this.cities.map(city => city.countOutcome())
        this.performTransactions()
        this.cities.map(city => {
            city.incomeToCurrent()
            city.flushIncome()
        })
    }

    addCountry (country: Country) {
        const countryId = this.countries.length + 1
        this.countries.push(country)
        for (let y=country.yl; y <= country.yh; y++) {
            for (let x=country.xl; x <= country.xh; x++) {
                const newCity = new City(x, y)
                newCity.country = country
                this.cities.push(newCity)
                this.grid[x][y]=countryId
            }
        }
        
    }

    performTransactions() {
        this.cities.map(city => 
            city.neighbours.map(neighbour => 
                this.countries.map(country => 
                    this.performTransaction(city, neighbour, country))))
    }

    performTransaction(from: City, to: City, country: Country) {
        to.receiveIncome(country.name, from.pay(country.name))
    }

    getDiffusionResult() {
        return this.countries.reduce((acc, country) => Object.assign(acc, {[country.name]: country.judgmentDay}), {});
    }
}
