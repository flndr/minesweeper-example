import { Field } from './Field';

export interface Board {
    fields : Field[];
    gameOver: boolean;
    gameWon: boolean;
}
