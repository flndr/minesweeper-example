import { Injectable } from '@angular/core';

import { MinesweeperController as VanillaController } from '../../../../minesweeper-vanilla/src/controller/MinesweeperController'

@Injectable( {
    providedIn : 'root'
} )
export class ControllerService extends VanillaController {
    
    constructor() {
        super();
    }
}
