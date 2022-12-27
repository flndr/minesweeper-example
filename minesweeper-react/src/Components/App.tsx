import React        from 'react';
import { observer } from 'mobx-react';
import { useMount } from 'react-use';

import Board                  from './Board';
import { Controller }         from '../Controller';
import { useController }      from '../Controller';
import { ControllerProvider } from '../Controller';

function App() {
    const controller = useController();
    
    useMount( () => {
        controller.setSettings(
            Controller.parseSettingsFromQueryString() ||
            { size : 10, mines : 4 }
        );
        controller.initNewGame();
    } );
    
    return (
        <ControllerProvider store={ controller }>
            <Board/>
        </ControllerProvider>
    )
}

export default observer( App );
