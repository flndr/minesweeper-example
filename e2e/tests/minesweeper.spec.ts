import { expect, test } from '@playwright/test';

const projects : Array<{
    name : string;
    baseUrl : string;
}> = [
    { name : 'Vanilla', baseUrl : 'http://localhost:3001/' },
    { name : 'React', baseUrl : 'http://localhost:3002/' },
    { name : 'Angular', baseUrl : 'http://localhost:3003/' },
];

for ( const project of projects ) {
    test.describe( project.name, () => {
        
        test.beforeEach( async ( { page } ) => {
            await page.goto( project.baseUrl );
        } );
        
        test( `Title must contain "Minesweeper"`, async ( { page } ) => {
            await expect( page ).toHaveTitle( /Minesweeper/ );
        } );
    } )
    
}
