import parseEuroCase from '../src/parser';

describe('diffusion unit tests', () => {
    it('correct cities', () => {
        return parseEuroCase('./data/1').then(res => {
            expect(res).toEqual([
                {
                    Spain: 382,
                    Portugal: 416,
                    France: 1325 
                }, {
                    Luxembourg: 0
                }, {
                    Belgium: 2, 
                    Netherlands: 2
                }
            ])
        })
    })
    it('invalid format', () => {
        return parseEuroCase('./data/2').then(res => {
            expect(res).toEqual([
               new Error('Wrong params for France: 5,7,4,6')
            ])
        })
    })
    it('empty list', () => {
        return parseEuroCase('./data/3').then(res => {
            expect(res).toEqual([])
        })
    })
})