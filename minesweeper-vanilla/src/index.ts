import { MinesweeperController } from './controller/MinesweeperController';
import { MinesweeperView }       from './view/MinesweeperView';
import './style.css';

const rootElement = document.querySelector<HTMLDivElement>( '[data-board]' )!;

const controller = new MinesweeperController();
controller.setSettings( { size : 10, mines : 4, mineFields : [] } );
controller.initNewGame();

const view = new MinesweeperView( rootElement, controller );
view.render();

