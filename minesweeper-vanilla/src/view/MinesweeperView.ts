import { MinesweeperController } from '../controller/MinesweeperController';
import { Field }                 from '../models/Field';

import { TestElement } from '../../../e2e/TestElement';

export class MinesweeperView {
    
    private showFieldIds = false;
    
    readonly statusTextStart : string;
    readonly statusTextGameWon : string;
    readonly statusTextGameOver : string;
    
    constructor(
        private rootElement : HTMLElement,
        private controller : MinesweeperController,
    ) {
        this.statusTextStart = this.getRandomItem( [
            'What are you waitin\' for? Christmas?!',
            'Do, or do not. There is no try.',
            'Hmm, I\'m going in!',
            'You wanna dance?',
            'Let\'s rock!',
        ] );
        
        this.statusTextGameWon = this.getRandomItem( [
            'Hail to the King, Baby!',
            'Lucky son of a bitch.',
            'Aahhh... much better.',
            'Yeah, piece of cake!',
            'Shake it, baby!',
        ] );
        
        this.statusTextGameOver = this.getRandomItem( [
            'Are you crazy? Is that your problem?',
            'Heh, heh, heh... What a mess!',
            'Damn, that was annoying!',
            'Ugh, this sucks.',
            'Holy cow!',
        ] );
        
    }
    
    render() {
        this.replaceHtml();
        this.addInteractivity();
    }
    
    private replaceHtml() {
        
        const { fields, gameOver, gameWon } = this.controller.getBoard();
        const { size }                      = this.controller.getSettings();
        
        const htmlFields = fields.map( ( field : Field ) => {
            return `
            <div class="field"
                 data-test-field-id="${ field.id }"
                 data-test-element="${ TestElement.FIELD }"
                 data-field
                 data-field-id="${ field.id }"
                 data-status="${ field.status }" ${ field.hasMine ? 'data-has-mine' : '' }>
                <div class="field_inner">
                    <div class="field_content" data-test-element="${ TestElement.FIELD_ADJACENT_MINES }">
                        ${ field.adjacentMines > 0
                           ? field.adjacentMines
                           : '' }
                    </div>
                    <div class="field_bg"></div>
                    <div class="field_id"
                         data-js-field-id
                         data-test-element="${ TestElement.FIELD_ID }"
                         data-show="${ this.showFieldIds }">
                        ${ field.id }
                    </div>
                </div>
              
            </div>
        `
        } ).join( '' );
        
        let textHeadline = 'Vanilla Minesweeper';
        let textSubline  = this.statusTextStart;
        
        if ( gameWon ) {
            textHeadline = 'YOU WON';
            textSubline  = this.statusTextGameWon;
        }
        if ( gameOver ) {
            textHeadline = 'GAME OVER';
            textSubline  = this.statusTextGameOver;
        }
        
        this.rootElement.innerHTML = `
            <div style="text-align: center">
                <h1 data-test-element="${ TestElement.HEADLINE }">${ textHeadline }</h1>
                <p>${ textSubline }</p>
            </div>
            <div class="fields" style="width: ${ ( size * 4 ) + 'rem' }">
                ${ htmlFields }
            </div>
            <div style="text-align: center">
                <a data-js-toggle-field-id
                   data-test-element="${ TestElement.BTN_TOGGLE_FIELD_ID }">
                    toggle field ids
                </a>
            </div>
        `;
    }
    
    private addInteractivity() {
        
        const { gameOver, gameWon } = this.controller.getBoard();
        
        if ( !gameOver && !gameWon ) {
            Array.from( document.querySelectorAll<HTMLDivElement>( '[data-field]' ) ).forEach( el => {
                el.addEventListener( 'click', this.handleFieldClick.bind( this ) )
            } );
            
            Array.from( document.querySelectorAll<HTMLDivElement>( '[data-field]' ) ).forEach( el => {
                el.addEventListener( 'contextmenu', this.handleLeftClick.bind( this ) )
            } );
        }
        
        document.querySelector<HTMLAnchorElement>( '[data-js-toggle-field-id]' )!
        .addEventListener( 'click', this.toggleFieldIds.bind( this ) )
    }
    
    private toggleFieldIds( e : MouseEvent ) {
        e.preventDefault();
        
        this.showFieldIds = !this.showFieldIds;
        
        Array.from( document.querySelectorAll<HTMLDivElement>( '[data-js-field-id]' ) ).forEach( el => {
            el.setAttribute( 'data-show', this.showFieldIds.toString() )
        } );
    }
    
    private handleFieldClick( e : MouseEvent ) {
        e.preventDefault();
        if ( e.currentTarget instanceof Element ) {
            const fieldId : number = parseInt( e.currentTarget.getAttribute( 'data-field-id' ) || '' );
            this.controller.revealField( fieldId );
            this.render();
        } else {
            throw new Error( 'Element not found.' );
        }
    }
    
    private handleLeftClick( e : MouseEvent ) {
        e.preventDefault();
        if ( e.currentTarget instanceof Element ) {
            const fieldId : number = parseInt( e.currentTarget.getAttribute( 'data-field-id' ) || '' );
            this.controller.markField( fieldId );
            this.render();
        } else {
            throw new Error( 'Element not found.' );
        }
    }
    
    private getRandomItem<T>( arr : T[] ) : T {
        return arr[ Array.from( MinesweeperController.generateRandomSetOfNumbers( 1, arr.length ) )[ 0 ] - 1 ];
    }
    
}
