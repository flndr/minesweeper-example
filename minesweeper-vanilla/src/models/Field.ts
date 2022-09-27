import { FieldId }     from './FieldId';
import { FieldStatus } from './FieldStatus';

export interface Field {
    id : FieldId;
    x : number;
    y : number;
    hasMine : boolean;
    adjacentMines : number;
    status : FieldStatus;
}
