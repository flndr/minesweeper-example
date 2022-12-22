import { action }         from 'mobx';
import { computed }       from 'mobx';
import { observable }     from 'mobx';
import { makeObservable } from 'mobx';
import React              from 'react';
import { FC }             from 'react';
import { createContext }  from 'react';
import { useContext }     from 'react';

import { MinesweeperController as VanillaController } from '../../minesweeper-vanilla/src/controller/MinesweeperController'

export class Controller extends VanillaController {
    
    constructor() {
        super();
        makeObservable( this, {
            _board      : observable,
            _settings   : observable,
            board       : computed,
            settings    : computed,
            initNewGame : action,
            setSettings : action,
            revealField : action,
            markField   : action,
        } );
    }
}

export function getRandomItem<T>( arr : T[] ) : T {
    return arr[ Array.from( Controller.generateRandomSetOfNumbers( 1, arr.length ) )[ 0 ] - 1 ];
}

export const ControllerContext = createContext<Controller>( new Controller() );

export const ControllerProvider : FC<{
    store : Controller,
    children : React.ReactNode
}> = ( { store, children } ) => (
    <ControllerContext.Provider value={ store }>
        { children }
    </ControllerContext.Provider>
);

export const useController = () => {
    return useContext( ControllerContext );
}
