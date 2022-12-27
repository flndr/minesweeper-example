import { MinesweeperController } from './controller/MinesweeperController';
import { MinesweeperView }       from './view/MinesweeperView';
import './style.css';

const rootElement = document.querySelector<HTMLDivElement>( '[data-board]' )!;

const controller = new MinesweeperController();
controller.setSettings(
    MinesweeperController.parseSettingsFromQueryString() ||
    { size : 8, mines : 20 }
);
controller.initNewGame();

const view = new MinesweeperView( rootElement, controller );
view.render();

