import { Field } from './Field';

export interface Board {
    fields : Field[];
    minesFound : number;
    minesLeft : number;
    gameOver: boolean;
    gameWon: boolean;
}
