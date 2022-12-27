import styled       from '@emotion/styled';
import { observer } from 'mobx-react';

import { TestElement } from '../../../e2e/TestElement';

import { getRandomItem } from '../Controller';
import { useController } from '../Controller';

const Container = styled.div`
  text-align : center;
`;

function StatusText() {
    
    const controller            = useController();
    const { gameOver, gameWon } = controller.getBoard();
    
    let statusTextStart = getRandomItem( [
        'What are you waitin\' for? Christmas?!',
        'Do, or do not. There is no try.',
        'Hmm, I\'m going in!',
        'You wanna dance?',
        'Let\'s rock!',
    ] );
    
    let statusTextGameWon = getRandomItem( [
        'Hail to the King, Baby!',
        'Lucky son of a bitch.',
        'Aahhh... much better.',
        'Yeah, piece of cake!',
        'Shake it, baby!',
    ] );
    
    let statusTextGameOver = getRandomItem( [
        'Are you crazy? Is that your problem?',
        'Heh, heh, heh... What a mess!',
        'Damn, that was annoying!',
        'Ugh, this sucks.',
        'Holy cow!',
    ] );
    
    let headline = 'React Minesweeper';
    let subline  = statusTextStart;
    
    if ( gameWon ) {
        headline = 'YOU WON';
        subline  = statusTextGameWon;
    }
    if ( gameOver ) {
        headline = 'GAME OVER';
        subline  = statusTextGameOver;
    }
    
    return <Container>
        <h1 data-test-element={ TestElement.HEADLINE }>{ headline }</h1>
        <p>{ subline }</p>
    </Container>;
    
}

export default observer( StatusText );
