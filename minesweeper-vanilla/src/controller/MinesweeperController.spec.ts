import { vi, beforeEach, describe, expect, it } from 'vitest'

import { MinesweeperController } from './MinesweeperController';
import { FieldStatus }           from '../models/FieldStatus';

describe( 'MinesweeperController', () => {
    
    let controller : MinesweeperController;
    const numberGeneratorSpy = vi.spyOn( MinesweeperController, 'generateRandomSetOfNumbers' );
    
    beforeEach( () => {
        controller = new MinesweeperController();
        numberGeneratorSpy.mockRestore();
    } )
    
    it( 'should construct', () => {
        expect( controller ).toBeDefined();
    } )
    
    describe( 'settings', () => {
        
        it( 'should have a method to define settings', () => {
            expect( controller.setSettings ).toBeDefined();
        } )
        
        it( 'should have a method to get settings', () => {
            expect( controller.getSettings ).toBeDefined();
        } )
        
        it( 'should set size in settings', () => {
            controller.setSettings( { size : 20 } );
            expect( controller.getSettings().size ).toEqual( 20 );
        } )
        
        it( 'should set number of mines in settings', () => {
            controller.setSettings( { mines : 20 } );
            expect( controller.getSettings().mines ).toEqual( 20 );
        } )
        
        it( 'should have a method to set individual mines', () => {
            controller.setSettings( { mineFields : [ 1, 2, 3 ] } );
            expect( controller.getSettings().mineFields ).toEqual( [ 1, 2, 3 ] );
        } )
        
        it( 'should set all settings at once', () => {
            controller.setSettings( { size : 30, mines : 15 } );
            expect( controller.getSettings().size ).toEqual( 30 );
            expect( controller.getSettings().mines ).toEqual( 15 );
        } )
    } )
    
    describe( 'generate random numbers', () => {
        
        it( 'should have a static method to generate random numbers', () => {
            const numbers = MinesweeperController.generateRandomSetOfNumbers( 5, 100 );
            expect( numbers.size ).toEqual( 5 );
            expect( Math.max( ...Array.from( numbers ) ) ).toBeLessThanOrEqual( 100 );
            expect( Math.min( ...Array.from( numbers ) ) ).toBeGreaterThan( 0 );
        } )
        
        it( 'should populate a starting set if given', () => {
            const startingSet = new Set<number>( [ 1, 2, 3 ] );
            const numbers     = MinesweeperController.generateRandomSetOfNumbers( 10, 20, startingSet );
            expect( numbers.size ).toEqual( 10 );
            expect( numbers.has( 1 ) ).toBeTruthy();
            expect( numbers.has( 2 ) ).toBeTruthy();
            expect( numbers.has( 3 ) ).toBeTruthy();
        } )
        
    } )
    
    describe( 'initialize new game', () => {
        
        it( 'should have a method to initialize a new game', () => {
            expect( controller.initNewGame ).toBeDefined();
        } )
        
        it( 'should have a method to get the board', () => {
            expect( controller.getBoard ).toBeDefined();
        } )
        
        it( 'should generate correct number of fields', () => {
            controller.setSettings( { size : 5, mines : 1 } );
            controller.initNewGame();
            expect( controller.getBoard().fields.length ).toBe( 25 );
        } )
        
        it( 'should generate correct coordinates for fields', () => {
            controller.setSettings( { size : 2, mines : 1 } );
            controller.initNewGame();
            expect( controller.getBoard().fields.length ).toBe( 4 );
            expect( controller.getBoard().fields ).toEqual( expect.arrayContaining( [
                expect.objectContaining( { x : 0, y : 0 } ),
                expect.objectContaining( { x : 1, y : 0 } ),
                expect.objectContaining( { x : 0, y : 1 } ),
                expect.objectContaining( { x : 1, y : 1 } ),
            ] ) );
            expect( controller.getBoard().fields ).not.toEqual( expect.arrayContaining( [
                expect.objectContaining( { x : 2 } ),
                expect.objectContaining( { y : 2 } ),
                expect.objectContaining( { x : 3 } ),
                expect.objectContaining( { y : 3 } ),
            ] ) );
        } )
        
        it( 'should generate correct amount of mines', () => {
            controller.setSettings( { size : 20, mines : 1 } );
            controller.initNewGame();
            expect( controller.getBoard().fields.filter( f => f.hasMine ).length ).toBe( 1 );
        } )
        
        it( 'should place mines correctly', () => {
            
            // M 2 M
            // 4 M 6
            // 7 M 9
            const mockedMines = new Set<number>();
            mockedMines.add( 1 );
            mockedMines.add( 5 );
            mockedMines.add( 3 );
            mockedMines.add( 8 );
            numberGeneratorSpy.mockReturnValue( mockedMines );
            
            controller.setSettings( { mines : 1, size : 3 } );
            controller.initNewGame();
            
            expect( controller.getBoard().fields ).toEqual( [
                expect.objectContaining( { id : 1, hasMine : true } ),
                expect.objectContaining( { id : 2, hasMine : false } ),
                expect.objectContaining( { id : 3, hasMine : true } ),
                expect.objectContaining( { id : 4, hasMine : false } ),
                expect.objectContaining( { id : 5, hasMine : true } ),
                expect.objectContaining( { id : 6, hasMine : false } ),
                expect.objectContaining( { id : 7, hasMine : false } ),
                expect.objectContaining( { id : 8, hasMine : true } ),
                expect.objectContaining( { id : 9, hasMine : false } ),
            ] );
            
        } )
        
        it( 'should determine adjacent mines for each field', () => {
            
            // 1 2 3
            // 4 M 6
            // 7 M M
            const mockedMines = new Set<number>();
            mockedMines.add( 5 );
            mockedMines.add( 8 );
            mockedMines.add( 9 );
            numberGeneratorSpy.mockReturnValue( mockedMines );
            
            controller.setSettings( { mines : 1, size : 3 } );
            controller.initNewGame();
            
            expect( controller.getBoard().fields ).toEqual( expect.arrayContaining( [
                expect.objectContaining( { id : 1, adjacentMines : 1, hasMine : false } ),
                expect.objectContaining( { id : 2, adjacentMines : 1, hasMine : false } ),
                expect.objectContaining( { id : 3, adjacentMines : 1, hasMine : false } ),
                expect.objectContaining( { id : 4, adjacentMines : 2, hasMine : false } ),
                expect.objectContaining( { id : 5, adjacentMines : 2, hasMine : true } ),
                expect.objectContaining( { id : 6, adjacentMines : 3, hasMine : false } ),
                expect.objectContaining( { id : 7, adjacentMines : 2, hasMine : false } ),
                expect.objectContaining( { id : 8, adjacentMines : 2, hasMine : true } ),
                expect.objectContaining( { id : 9, adjacentMines : 2, hasMine : true } ),
            ] ) );
            
        } )
        
        it( 'should place mineFields from settings correctly', () => {
            
            // M M M
            // 4 5 6
            // 7 M M
            controller.setSettings( { mines : 5, size : 3, mineFields : [ 1, 2, 3, 8, 9 ] } );
            controller.initNewGame();
            
            expect( controller.getBoard().fields ).toEqual( expect.arrayContaining( [
                expect.objectContaining( { id : 1, hasMine : true } ),
                expect.objectContaining( { id : 2, hasMine : true } ),
                expect.objectContaining( { id : 3, hasMine : true } ),
                expect.objectContaining( { id : 4, hasMine : false } ),
                expect.objectContaining( { id : 5, hasMine : false } ),
                expect.objectContaining( { id : 6, hasMine : false } ),
                expect.objectContaining( { id : 7, hasMine : false } ),
                expect.objectContaining( { id : 8, hasMine : true } ),
                expect.objectContaining( { id : 9, hasMine : true } ),
            ] ) );
            
        } )
        
    } )
    
    describe( 'revealing fields', function () {
        
        beforeEach( () => {
            //  1   2   3   4
            //  5   M   7   8
            //  9   M   M  12
            // 13  14  15  16
            const mockedMines = new Set<number>();
            mockedMines.add( 6 );
            mockedMines.add( 10 );
            mockedMines.add( 11 );
            numberGeneratorSpy.mockReturnValue( mockedMines );
            
            controller.setSettings( { mines : 1, size : 4 } );
            controller.initNewGame();
        } )
        
        it( 'should set status REVEALED to adjoining fields when clicking a field with no mine', () => {
            controller.revealField( 4 );
            expect( controller.getBoard().fields ).toEqual( expect.arrayContaining( [
                expect.objectContaining( { id : 4, status : FieldStatus.REVEALED } ),
                expect.objectContaining( { id : 3, status : FieldStatus.REVEALED } ),
                expect.objectContaining( { id : 7, status : FieldStatus.REVEALED } ),
                expect.objectContaining( { id : 8, status : FieldStatus.REVEALED } ),
                expect.objectContaining( { id : 2, status : FieldStatus.UNKNOWN } ),
                expect.objectContaining( { id : 6, status : FieldStatus.UNKNOWN } ),
                expect.objectContaining( { id : 5, status : FieldStatus.UNKNOWN } ),
                expect.objectContaining( { id : 9, status : FieldStatus.UNKNOWN } ),
                expect.objectContaining( { id : 12, status : FieldStatus.UNKNOWN } ),
                expect.objectContaining( { id : 13, status : FieldStatus.UNKNOWN } ),
                expect.objectContaining( { id : 14, status : FieldStatus.UNKNOWN } ),
                expect.objectContaining( { id : 15, status : FieldStatus.UNKNOWN } ),
                expect.objectContaining( { id : 16, status : FieldStatus.UNKNOWN } ),
            ] ) );
        } )
        
        it( 'should have a gameOver status (defaulting to false)', () => {
            expect( controller.getBoard().gameOver ).toBeFalsy();
        } )
        
        it( 'should set gameOver to true when clicking a mine', () => {
            controller.revealField( 10 );
            expect( controller.getBoard().gameOver ).toBeTruthy()
        } )
        
        it( 'should not set gameOver to true when clicking an empty field', () => {
            controller.revealField( 1 );
            controller.revealField( 4 );
            controller.revealField( 7 );
            controller.revealField( 9 );
            controller.revealField( 16 );
            expect( controller.getBoard().gameOver ).toBeFalsy()
        } )
        
        it( 'should set status to REVEALED when clicking a field with no mine', () => {
            controller.revealField( 2 );
            expect( controller.getBoard().fields ).toEqual( expect.arrayContaining( [
                expect.objectContaining( { id : 2, status : FieldStatus.REVEALED } ),
            ] ) );
        } )
        
        it( 'should set status to MINE when clicking a field with a mine', () => {
            controller.revealField( 6 );
            expect( controller.getBoard().fields ).toEqual( expect.arrayContaining( [
                expect.objectContaining( { id : 6, status : FieldStatus.MINE } ),
            ] ) );
        } )
        
    } );
    
    describe( 'mark fields', () => {
        
        beforeEach( () => {
            //  1   2   3   4
            //  5   M   7   8
            //  9   M   M  12
            // 13  14  15  16
            const mockedMines = new Set<number>();
            mockedMines.add( 6 );
            mockedMines.add( 10 );
            mockedMines.add( 11 );
            numberGeneratorSpy.mockReturnValue( mockedMines );
            
            controller.setSettings( { mines : 1, size : 4 } );
            controller.initNewGame();
        } )
        
        it( 'should have a markField method', () => {
            expect( controller.markField ).toBeDefined();
        } )
        
        it( 'should toggle marked status on fields', () => {
            
            expect( controller.getBoard().fields ).toEqual( expect.arrayContaining( [
                expect.objectContaining( { id : 1, status : FieldStatus.UNKNOWN } ),
            ] ) );
            
            controller.markField( 1 );
            
            expect( controller.getBoard().fields ).toEqual( expect.arrayContaining( [
                expect.objectContaining( { id : 1, status : FieldStatus.MARKED } ),
            ] ) );
            
            controller.markField( 1 );
            
            expect( controller.getBoard().fields ).toEqual( expect.arrayContaining( [
                expect.objectContaining( { id : 1, status : FieldStatus.UNKNOWN } ),
            ] ) );
            
        } )
        
        it( 'should not mark revealed fields', () => {
            
            controller.revealField( 4 );
            
            expect( controller.getBoard().fields ).toEqual( expect.arrayContaining( [
                expect.objectContaining( { id : 4, status : FieldStatus.REVEALED } ),
            ] ) );
            
            controller.markField( 4 );
            
            expect( controller.getBoard().fields ).toEqual( expect.arrayContaining( [
                expect.objectContaining( { id : 4, status : FieldStatus.REVEALED } ),
            ] ) );
            
        } )
        
    } )
    
    describe( 'win condition', () => {
        
        it( 'should have a gameWon property', () => {
            expect( controller.getBoard().gameWon ).toBeDefined();
        } )
        
        it.only( 'should set gameWin to true when all mines are marked', () => {
            controller.setSettings( { mines : 3, size : 4, mineFields : [ 6, 10, 11 ] } );
            controller.initNewGame();
            expect( controller.getBoard().gameWon ).toBeFalsy();
            controller.markField( 6 );
            controller.markField( 10 );
            expect( controller.getBoard().gameWon ).toBeFalsy();
            controller.markField( 11 );
            expect( controller.getBoard().gameWon ).toBeTruthy();
        } )
        
    } )
    
} );
