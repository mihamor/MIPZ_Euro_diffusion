import City from "./core/City"

export const MIN_COORD = 0
export const MAX_COORD = 9

export const isInBounds = (coordinate: number) => (
    coordinate >= MIN_COORD && coordinate <= MAX_COORD
)

export const areInBounds = (x: number, y: number) => {
    return isInBounds(x) && isInBounds(y)
}

export function findCityByCoordinates (
    cities: City[],
    x: number,
    y: number,
) {
    return cities.find(({x: toFindX, y: toFindY}) => toFindX === x && toFindY === y )
}
