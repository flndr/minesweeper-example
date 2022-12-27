import { expect }       from '@playwright/test';
import { test as base } from '@playwright/test';

import { TestOptions } from '../playwright.config';

export const test = base.extend<TestOptions>( {
    projectBaseUrl : [ 'http://localhost:1234/', { option : true } ],
    projectTitle   : [ 'Minesweeper Something', { option : true } ],
} );

test.describe( 'Minesweeper', () => {
    
    test.beforeEach( async ( { page, projectBaseUrl } ) => {
        await page.goto( projectBaseUrl );
    } );
    
    test( 'Document Title', async ( { page, projectTitle } ) => {
        await expect( page ).toHaveTitle( projectTitle + ' Minesweeper' );
    } );
} )

