import Map from '../core/Map';
import * as fs from 'fs';
import Country from '../core/Country';
import City from '../core/City';
import { isInBounds } from '../utils';

type CaseResult = Error | { [key: string]: number };

function compareChunkToString(chunk: Uint8Array, string: string) {
    return Buffer.compare(chunk, Buffer.from(string)) === 0 ? true : false
}

function getCountryParams (stream: fs.ReadStream) {
    const params: number[] = []
    let chunk:Uint8Array;
    while (null !== (chunk = stream.read(1))) {
        if (compareChunkToString(chunk, ' '))
            continue
        if (compareChunkToString(chunk, '\r'))
            continue
        if (compareChunkToString(chunk, '\n'))
            break
        if (compareChunkToString(chunk, '-'))
            throw new Error('Values cannot be negative')
        if(Number.isInteger(+chunk))
            params.push(+chunk)
      }
    return params;
}

function getCountryName (stream: fs.ReadStream) {
    let name = ''
    let chunk: Uint8Array;
    while (null !== (chunk = stream.read(1))) {
        if (compareChunkToString(chunk, '\r'))
            continue
        if (compareChunkToString(chunk, '\n'))
            continue
        if (compareChunkToString(chunk, ' '))
            break
        name = name.concat(chunk.toString())
      }
    return name
}

function areParamsValid (params: number[]) {
    if (!(Array.isArray(params) && params.length === 4)) return false
    if (!params.reduce((acc, param) => acc && isInBounds(param), true)) return false
    if (!(params[0] <= params[2])) return false
    if (!(params[1] <= params[3])) return false
    return true
}

function processSingleCase(stream: fs.ReadStream, countriesNumber: number) {
    const map = new Map()
    if(countriesNumber === 0) return {}
    for(let i = 0; i < countriesNumber; i++) {
        const name = getCountryName(stream)
        const params = getCountryParams(stream)
        if(!areParamsValid(params)) {
            return new Error(`Wrong params for ${name}: ${params}`)
        }
        const city1 = new City(params[0], params[1]);
        const city2 = new City(params[2], params[3]);
        map.addCountry(new Country(name, city1, city2))      
      }
    return map.performDiffusion()
}

function processStream (stream: fs.ReadStream) { 
    return new Promise(resolve => {
        const tests: CaseResult[] = [];
        stream.on('readable', () => {
            let chunk: Uint8Array;
            while (null !== (chunk = stream.read(1))) {
                const res = processSingleCase(stream, Number(chunk))
                if (!(Object.keys(res).length === 0 && res.constructor === Object))
                    tests.push(res);
                else break
            }
            resolve(tests)
          })
    });
}

export default async function getOutput (inputPath: string) {
    const readStream = fs.createReadStream(inputPath)
    return await processStream(readStream);
}
