import React        from 'react';
import { observer } from 'mobx-react';
import { useMount } from 'react-use';

import Board                  from './Board';
import { useController }      from '../Controller';
import { ControllerProvider } from '../Controller';

function App() {
    const controller = useController();
    
    useMount( () => {
        controller.setSettings( { size : 10, mines : 4, mineFields : [] } );
        controller.initNewGame();
    } );
    
    return (
        <ControllerProvider store={ controller }>
            <Board/>
        </ControllerProvider>
    )
}

export default observer( App );
