import { MinesweeperController } from './controller/MinesweeperController';
import './style.css'
import { MinesweeperView } from './view/MinesweeperView';

const rootElement = document.querySelector<HTMLDivElement>( '[data-board]' )!;

const controller = new MinesweeperController();
controller.setSettings( { size : 10, mines : 4, mineFields : [] } );
controller.initNewGame();

const view = new MinesweeperView( rootElement, controller );
view.render();

window.history.replaceState( { foo : 'bar' }, '', window.location.href );

const newurl = window.location.origin + window.location.pathname + '?myNewUrlQuery=1';
window.history.pushState( { path : newurl }, '', newurl );
