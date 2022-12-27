import { expect }       from '@playwright/test';
import { test as base } from '@playwright/test';
import { Locator }      from 'playwright-core';
import { Page }         from 'playwright-core';
import * as queryString from 'querystring';

import { TestElement } from '../TestElement';
import { TestOptions } from '../playwright.config';

export const test = base.extend<TestOptions>( {
    projectBaseUrl : [ 'http://localhost:1234/', { option : true } ],
    projectTitle   : [ 'Minesweeper Something', { option : true } ],
} );

//      TEST-BOARD
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

// console.log( 'settingsQueryString: ' + settingsQueryString )

test.describe( 'Minesweeper', () => {
    
    test.beforeEach( async ( { page, projectBaseUrl } ) => {
        await page.goto( projectBaseUrl + settingsQueryString );
    } );
    
    test( 'Non-functional', async ( { page, projectTitle } ) => {
        const title = projectTitle + ' Minesweeper';
        
        await expect( page ).toHaveTitle( title );
        await expect( page.getByTestId( TestElement.HEADLINE ) ).toHaveText( title );
    } );
    
    test.describe( 'Board generation', () => {
        
        test( 'Board size', async ( { page } ) => {
            await expect( page.getByTestId( TestElement.FIELD ) ).toHaveCount( settings.size * settings.size );
        } );
        
        test( 'First and last fields', async ( { page } ) => {
            await expect( getField( page, 0 ) ).not.toBeVisible();
            await expect( getField( page, 1 ) ).toBeVisible();
            await expect( getField( page, 25 ) ).toBeVisible();
            await expect( getField( page, 26 ) ).not.toBeVisible();
        } );
        
        test( 'Field ids', async ( { page } ) => {
            await page.getByTestId( TestElement.BTN_TOGGLE_FIELD_ID ).click();
            await expect( page.getByTestId( TestElement.FIELD_ID ) ).toHaveCount( settings.size * settings.size );
            for ( const fieldId of await page.getByTestId( TestElement.FIELD_ID ).all() ) {
                await expect( fieldId ).toBeVisible();
            }
            await expect( getField( page, 25 ).getByTestId( TestElement.FIELD_ID ) ).toHaveText( '25' );
            await expect( getField( page, 18 ).getByTestId( TestElement.FIELD_ID ) ).toHaveText( '18' );
            await expect( getField( page, 5 ).getByTestId( TestElement.FIELD_ID ) ).toHaveText( '5' );
            await expect( getField( page, 1 ).getByTestId( TestElement.FIELD_ID ) ).toHaveText( '1' );
        } );
        
        test( 'Adjacent Mines', async ( { page } ) => {
            await getField( page, 1 ).click();
            await getField( page, 5 ).click();
            await getField( page, 13 ).click();
            await getField( page, 20 ).click();
            await getField( page, 25 ).click();
            await getField( page, 24 ).click();
            await getField( page, 23 ).click();
            
            await expect( getField( page, 2 ).getByTestId( TestElement.FIELD_ADJACENT_MINES ) ).toHaveText( '2' );
            await expect( getField( page, 7 ).getByTestId( TestElement.FIELD_ADJACENT_MINES ) ).toHaveText( '2' );
            await expect( getField( page, 12 ).getByTestId( TestElement.FIELD_ADJACENT_MINES ) ).toHaveText( '2' );
            await expect( getField( page, 17 ).getByTestId( TestElement.FIELD_ADJACENT_MINES ) ).toHaveText( '1' );
            await expect( getField( page, 22 ).getByTestId( TestElement.FIELD_ADJACENT_MINES ) ).toHaveText( '1' );
            await expect( getField( page, 13 ).getByTestId( TestElement.FIELD_ADJACENT_MINES ) ).toHaveText( '3' );
            await expect( getField( page, 23 ).getByTestId( TestElement.FIELD_ADJACENT_MINES ) ).toHaveText( '2' );
            await expect( getField( page, 4 ).getByTestId( TestElement.FIELD_ADJACENT_MINES ) ).toHaveText( '2' );
            await expect( getField( page, 9 ).getByTestId( TestElement.FIELD_ADJACENT_MINES ) ).toHaveText( '2' );
            await expect( getField( page, 14 ).getByTestId( TestElement.FIELD_ADJACENT_MINES ) ).toHaveText( '3' );
            await expect( getField( page, 24 ).getByTestId( TestElement.FIELD_ADJACENT_MINES ) ).toHaveText( '2' );
            await expect( getField( page, 15 ).getByTestId( TestElement.FIELD_ADJACENT_MINES ) ).toHaveText( '1' );
            await expect( getField( page, 20 ).getByTestId( TestElement.FIELD_ADJACENT_MINES ) ).toHaveText( '1' );
            await expect( getField( page, 25 ).getByTestId( TestElement.FIELD_ADJACENT_MINES ) ).toHaveText( '1' );
        } );
        
    } );
    
    test( 'Loosing', async ( { page } ) => {
        await getField( page, 3 ).click();
        await expect( page.getByTestId( TestElement.HEADLINE ) ).toHaveText( 'GAME OVER' );
    } );
    
    test( 'Winning', async ( { page } ) => {
        await getField( page, 3 ).click( { button : 'right' } );
        await getField( page, 8 ).click( { button : 'right' } );
        await getField( page, 18 ).click( { button : 'right' } );
        await getField( page, 19 ).click( { button : 'right' } );
        await expect( page.getByTestId( TestElement.HEADLINE ) ).toHaveText( 'YOU WON' );
    } );
    
} )

function getField( page : Page, id : number ) : Locator {
    return page.locator( `[data-test-field-id="${ id }"]` );
}

