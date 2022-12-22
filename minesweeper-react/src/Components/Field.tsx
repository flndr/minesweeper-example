import React        from 'react';
import { observer } from 'mobx-react';
import styled       from '@emotion/styled';

import { Field as FieldModel } from '../../../minesweeper-vanilla/src/models/Field';
import { FieldStatus }         from '../../../minesweeper-vanilla/src/models/FieldStatus';
import { useController }       from '../Controller';

const ColorByStatus : Record<FieldStatus, string> = {
    [ FieldStatus.UNKNOWN ]  : '#646464',
    [ FieldStatus.REVEALED ] : '#333333',
    [ FieldStatus.MINE ]     : '#931212',
    [ FieldStatus.MARKED ]   : '#AF8D0A',
};

const OpacityByStatus : Record<FieldStatus, number> = {
    [ FieldStatus.UNKNOWN ]  : 0.6,
    [ FieldStatus.REVEALED ] : 0.9,
    [ FieldStatus.MINE ]     : 0.9,
    [ FieldStatus.MARKED ]   : 0.9,
};

const CursorByStatus : Record<FieldStatus, string> = {
    [ FieldStatus.UNKNOWN ]  : 'pointer',
    [ FieldStatus.REVEALED ] : 'default',
    [ FieldStatus.MINE ]     : 'default',
    [ FieldStatus.MARKED ]   : 'pointer',
};

const Inner = styled.div`
  position        : relative;
  width           : 100%;
  height          : 100%;
  display         : flex;
  justify-content : center;
  align-items     : center;
`;

const Adjacent = styled.div`
  position : relative;
  z-index  : 1;
`;

const Background = styled.div<{ status : FieldStatus, showGreen : boolean }>`
  width            : 100%;
  height           : 100%;
  position         : absolute;
  z-index          : 0;

  background-color : ${ p => p.showGreen ? '#169600' : ColorByStatus[ p.status ] };
  opacity          : ${ p => OpacityByStatus[ p.status ] };
`;

const FieldId = styled.div`
  position    : absolute;
  left        : 4px;
  top         : 4px;
  color       : var(--text-color);
  z-index     : 0;
  font-size   : 13px;
  line-height : 13px;
  opacity     : 0.25;
`;

const Container = styled.div<{ status : FieldStatus }>`
  width   : 4rem;
  height  : 4rem;
  padding : 3px;
  cursor  : ${ p => CursorByStatus[ p.status ] };

  :hover {
    ${ Background } {
      opacity : 0.8;
    }
  }
`;

interface Props {
    field : FieldModel;
    showId? : boolean;
}

function Field( props : Props ) {
    
    const controller = useController();
    
    const { gameOver, gameWon } = controller.getBoard();
    
    const field  = props.field;
    const showId = !!props.showId;
    
    const adjacentMines = field.adjacentMines > 0 ? field.adjacentMines : '';
    const status        = field.status;
    const id            = field.id;
    const hasMine       = field.hasMine;
    
    const canInteract  = !gameOver && !gameWon;
    const showGreen    = gameWon && hasMine;
    const showAdjacent = status === FieldStatus.REVEALED;
    
    const handleClick = ( e : React.MouseEvent<HTMLDivElement, MouseEvent> ) => {
        e.preventDefault();
        e.stopPropagation();
        if ( canInteract ) {
            controller.revealField( id )
        }
    };
    
    const handleContextMenu = ( e : React.MouseEvent<HTMLDivElement, MouseEvent> ) => {
        e.preventDefault();
        e.stopPropagation();
        if ( canInteract ) {
            controller.markField( id )
        }
    };
    
    return <Container status={ status }
                      onContextMenu={ handleContextMenu }
                      onClick={ handleClick }>
        <Inner>
            { showAdjacent && <Adjacent>{ adjacentMines }</Adjacent> }
            <Background { ...{ status, showGreen } }/>
            { showId && <FieldId>{ id }</FieldId> }
        </Inner>
    </Container>;
}

export default observer( Field );
