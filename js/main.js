// Global variables
let scenes = { "1": { gif: '', areas: [], backgroundMode: 'cover' } };
let currentScene = "1";

// LocalStorage key
const STORAGE_KEY = 'adventure_maker_scenes';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadScenesFromStorage();
    updateSceneSelector();
    displayScene(currentScene);
    setupEventListeners();
});
