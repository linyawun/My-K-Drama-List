import {localLoginChecker} from './helpers/util.js'; //載入通用js
import {renderUserMenu} from './helpers/renderUserMenu.js'; //載入通用js
function init(){
    if(localLoginChecker()){
        renderUserMenu();
      }
}
init();