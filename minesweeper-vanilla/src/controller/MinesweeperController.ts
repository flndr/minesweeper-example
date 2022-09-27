import { Board }       from '../models/Board';
import { Field }       from '../models/Field';
import { FieldId }     from '../models/FieldId';
import { FieldStatus } from '../models/FieldStatus';
import { Settings }    from '../models/Settings';

export class MinesweeperController {
    
    private settings : Settings = {
        size       : 10,
        mines      : 10,
        mineFields : []
    }
    
    private board : Board = {
        fields     : [],
        minesFound : 0,
        minesLeft  : 0,
        gameOver   : false,
        gameWon    : false
    };
    
    getBoard() : Board {
        return this.board;
    }
    
    getSettings() : Settings {
        return this.settings;
    }
    
    setSettings( partialSettings : Partial<Settings> ) {
        this.settings = {
            ...this.settings,
            ...partialSettings
        };
    }
    
    initNewGame() {
        let fields = this.generateFields();
        fields     = this.calcAdjacentMines( fields );
        
        this.board = {
            fields,
            minesFound : 0,
            minesLeft  : this.settings.mines,
            gameOver   : false,
            gameWon    : false
        };
    }
    
    private calcAdjacentMines( fields : Field[] ) : Field[] {
        return fields.map( f => {
            f.adjacentMines = this.getAdjacentMineCount( fields, f );
            return f;
        } );
    }
    
    private generateFields() : Field[] {
        
        const fields : Field[] = [];
        
        const fieldDefaults : Field = {
            id            : 0,
            x             : 0,
            y             : 0,
            adjacentMines : 0,
            hasMine       : false,
            status        : FieldStatus.UNKNOWN
        };
        
        let id = 1;
        
        const mines = MinesweeperController.generateRandomSetOfNumbers(
            this.settings.mines,
            this.settings.size * this.settings.size,
            new Set<number>( this.settings.mineFields )
        );
        
        for ( let x = 0; x < this.settings.size; x++ ) {
            for ( let y = 0; y < this.settings.size; y++ ) {
                fields.push( {
                    ...fieldDefaults,
                    hasMine : mines.has( id ),
                    id,
                    x,
                    y
                } );
                id++;
            }
        }
        
        return fields;
    }
    
    static generateRandomSetOfNumbers(
        size : number,
        max : number,
        set : Set<number> = new Set<number>()
    ) : Set<number> {
        if ( set.size === size ) {
            return set;
        }
        if ( size >= max ) {
            throw new Error( `Will not finish with size=${ size } and max=${ max }` );
        }
        let i = 0;
        while ( set.size !== size ) {
            set.add( Math.floor( Math.random() * max ) + 1 );
            i++;
            if ( i > size * 10 ) {
                throw new Error( `Quitting after ${ size * 10 } runs with size=${ size } and max=${ max }` );
            }
        }
        return set;
    }
    
    private getAdjacentFields( fields : Field[], field : Field ) : Field[] {
        let adjacentFields : Field[] = [];
        
        for ( let xOffset = -1; xOffset <= 1; xOffset++ ) {
            for ( let yOffset = -1; yOffset <= 1; yOffset++ ) {
                
                const fieldsFiltered = fields.filter( f =>
                    f.x === field.x + xOffset &&
                    f.y === field.y + yOffset
                );
                if ( fieldsFiltered.length > 1 ) {
                    throw new Error( 'Can not happen. Something went wrong' );
                }
                if ( fieldsFiltered.length === 1 ) {
                    const adjacentField = fieldsFiltered[ 0 ];
                    adjacentFields.push( adjacentField )
                }
            }
        }
        
        adjacentFields = adjacentFields.filter( f => f.id !== field.id );
        
        if ( adjacentFields.length < 3 ) {
            throw new Error( 'getAdjacentFields must find at least 3 fields on edge' );
        }
        
        if ( adjacentFields.length > 8 ) {
            throw new Error( 'getAdjacentFields can not find more than 8 surrounding fields' );
        }
        
        return adjacentFields;
    }
    
    private getAdjacentMineCount( fields : Field[], field : Field ) : number {
        return this.getAdjacentFields( fields, field ).filter( f => f.hasMine ).length
    }
    
    public revealField( id : FieldId ) : void {
        if ( !this.board.gameOver || !this.board.gameWon ) {
            this.revealFieldsRecursively( id );
        }
    }
    
    public markField( id : FieldId ) : void {
        if ( this.board.gameOver || this.board.gameWon ) {
            return
        }
        const field = this.getFieldById( id );
        if ( field.status === FieldStatus.UNKNOWN ) {
            this.updateField( {
                ...field,
                status : FieldStatus.MARKED
            } );
            this.checkWinCondition();
        }
        if ( field.status === FieldStatus.MARKED ) {
            this.updateField( {
                ...field,
                status : FieldStatus.UNKNOWN
            } );
        }
        
    }
    
    private revealFieldsRecursively( id : FieldId ) : void {
        const field = this.getFieldById( id );
        
        if ( field.status !== FieldStatus.UNKNOWN ) {
            return;
        }
        
        if ( field.hasMine ) {
            this.updateField( {
                ...field,
                status : FieldStatus.MINE
            } );
            this.board.gameOver = true;
            return;
        }
        
        this.updateField( {
            ...field,
            status : FieldStatus.REVEALED
        } );
        
        if ( field.adjacentMines === 0 ) {
            this.getAdjacentFields( this.board.fields, field ).filter( f => !f.hasMine )
                .forEach( f => this.revealFieldsRecursively( f.id ) )
        }
    }
    
    private checkWinCondition() {
        const markedFields = this.board.fields.filter( f => f.hasMine && f.status === FieldStatus.MARKED ).length;
        const mineFields   = this.board.fields.filter( f => f.hasMine ).length;
        this.board.gameWon = markedFields === mineFields;
    }
    
    private getFieldById( id : FieldId ) : Field {
        const found = this.board.fields.filter( f => f.id === id );
        if ( found.length === 1 ) {
            return JSON.parse( JSON.stringify( found[ 0 ] ) ); // safety parse, so we dont get a ref
        }
        throw new Error( 'Could not find field with id=' + id );
    }
    
    private updateField( field : Field ) : void {
        const found = this.getFieldById( field.id );
        if ( found ) {
            this.board.fields = this.board.fields.filter( f => f.id !== field.id );
            this.board.fields.push( field );
            this.board.fields.sort( ( a : Field, b : Field ) => a.id - b.id );
        } else {
            throw new Error( 'Could not update field with id=' + field.id );
        }
        
    }
}
