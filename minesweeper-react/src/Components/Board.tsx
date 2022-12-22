import styled       from '@emotion/styled';
import { observer } from 'mobx-react';
import { useState } from 'react';

import { useController } from '../Controller';
import Field             from './Field';
import StatusText        from './StatusText';

const Fields = styled.div<{ size : number }>`
  display   : flex;
  flex-wrap : wrap;
  width     : ${ p => ( p.size * 4 ) + 'rem' };
`;

const Actions = styled.div`
  text-align : center;
`;

const Action = styled.a`
  cursor : pointer;
`;

function Board() {
    
    const [ showFieldIds, setShowFieldIds ] = useState( false );
    
    const controller = useController();
    const { fields } = controller.getBoard();
    const { size }   = controller.getSettings();
    
    return <>
        <StatusText/>
        <Fields size={ size }>
            { fields.map( field =>
                <Field field={ field } showId={ showFieldIds } key={ field.id }/>
            ) }
        </Fields>
        <Actions>
            <Action onClick={ () => setShowFieldIds( !showFieldIds ) }>
                toggle field ids
            </Action>
        </Actions>
    </>;
    
}

export default observer( Board );
