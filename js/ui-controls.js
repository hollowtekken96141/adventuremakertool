// Set up event listeners
function setupEventListeners() {
    // Scene selector change
    const sceneSelector = document.getElementById('scene-selector');
    sceneSelector.addEventListener('change', function() {
        currentScene = this.value;
        displayScene(currentScene);
    });
    
    // Background mode change
    document.getElementById('background-mode').addEventListener('change', function() {
        if (scenes[currentScene]) {
            scenes[currentScene].backgroundMode = this.value;
            displayScene(currentScene);
            saveScenesToStorage();
        }
    });
    
    // Add scene button
    document.getElementById('add-scene-button').addEventListener('click', addScene);
    
    // Delete scene button
    document.getElementById('delete-scene-button').addEventListener('click', deleteScene);
    
    // Rename scene button
    document.getElementById('rename-scene-button').addEventListener('click', renameScene);
    
    // Upload GIF
    document.getElementById('upload-gif').addEventListener('change', uploadGif);
    
    // Add clickable area
    document.getElementById('add-clickable-area').addEventListener('click', addClickableArea);
    
    // Export game
    document.getElementById('export-game-button').addEventListener('click', exportGame);
    
    // Clear storage
    document.getElementById('clear-storage-button').addEventListener('click', clearStorage);
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('edit-area-modal');
        if (modal && event.target === modal) {
            modal.style.display = 'none';
        }
    });
}
