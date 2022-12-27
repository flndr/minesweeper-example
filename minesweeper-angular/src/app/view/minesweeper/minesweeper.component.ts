import { Component, OnInit } from '@angular/core';
import { ControllerService } from '../../services/controller.service';

import { Board }    from '../../../../../minesweeper-vanilla/src/models/Board';
import { Settings } from '../../../../../minesweeper-vanilla/src/models/Settings';
import { Field }    from '../../../../../minesweeper-vanilla/src/models/Field';

@Component( {
    selector    : 'app-minesweeper',
    templateUrl : './minesweeper.component.html',
    styleUrls   : [ './minesweeper.component.scss' ]
} )
export class MinesweeperComponent implements OnInit {
    
    public showFieldIds = false;
    
    private statusTextStart : string    = '';
    private statusTextGameWon : string  = '';
    private statusTextGameOver : string = '';
    
    constructor(
        private controller : ControllerService
    ) { }
    
    ngOnInit() : void {
        this.controller.setSettings(
            ControllerService.parseSettingsFromQueryString() ||
            { size : 10, mines : 4 }
        );
        this.controller.initNewGame();
        
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
    
    get board() : Board {
        return this.controller.board;
    }
    
    get settings() : Settings {
        return this.controller.settings;
    }
    
    get textHeadline() : string {
        let text = 'Angular Minesweeper';
        
        if ( this.controller.board.gameWon ) {
            text = 'YOU WON';
        }
        if ( this.controller.board.gameOver ) {
            text = 'GAME OVER';
        }
        return text;
    }
    
    get textSubline() : string {
        let text = this.statusTextStart;
        
        if ( this.controller.board.gameWon ) {
            text = this.statusTextGameWon;
        }
        if ( this.controller.board.gameOver ) {
            text = this.statusTextGameOver;
        }
        return text;
    }
    
    private getRandomItem<T>( arr : T[] ) : T {
        return arr[ Array.from( ControllerService.generateRandomSetOfNumbers( 1, arr.length ) )[ 0 ] - 1 ];
    }
    
    public handleToggleFieldIds( e : Event ) {
        e.preventDefault();
        this.showFieldIds = !this.showFieldIds;
    }
    
    public handleRevealField( e : Event, field : Field ) {
        e.preventDefault();
        this.controller.revealField( field.id );
    }
    
    public handleMarkField( e : Event, field : Field ) {
        e.preventDefault();
        this.controller.markField( field.id );
    }
    
}
