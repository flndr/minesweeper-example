import * as queryString from 'querystring';

//        BOARD
//
//     1  2  M  4  5
//     6  7  M  9 10
//    11 12 13 14 15
//    16 17  M  M 20
//    21 22 23 24 25

export const settings = {
    size       : 5,
    mines      : 4,
    mineFields : [ 3, 8, 18, 19 ]
};

export const settingsQueryString = '?' + queryString.stringify( settings );

console.log( 'settingsQueryString: ' + settingsQueryString )
