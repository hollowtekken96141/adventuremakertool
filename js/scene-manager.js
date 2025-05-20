// Load scenes from localStorage
function loadScenesFromStorage() {
    const storedScenes = localStorage.getItem(STORAGE_KEY);
    if (storedScenes) {
        try {
            scenes = JSON.parse(storedScenes);
            console.log('Loaded scenes from localStorage:', scenes);
        } catch (error) {
            console.error('Error parsing scenes from localStorage:', error);
        }
    }
    
    // Ensure we have at least one scene
    if (Object.keys(scenes).length === 0) {
        scenes = { "1": { gif: '', areas: [] } };
    }
}

// Save scenes to localStorage
function saveScenesToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scenes));
    console.log('Saved scenes to localStorage');
}

// Update the scene selector dropdown
function updateSceneSelector() {
    const sceneSelector = document.getElementById('scene-selector');
    sceneSelector.innerHTML = '';
    for (const sceneName in scenes) {
        const option = document.createElement('option');
        option.value = sceneName;
        option.textContent = sceneName;
        sceneSelector.appendChild(option);
    }
    sceneSelector.value = currentScene;
}

// Display the current scene
function displayScene(sceneName) {
    const scene = scenes[sceneName];
    const editor = document.getElementById('editor');
    editor.innerHTML = '';
    
    if (scene) {
        // Set background image if available
        if (scene.gif) {
            editor.style.backgroundImage = "url('" + scene.gif + "')";
            
            // Apply background mode
            const backgroundMode = scene.backgroundMode || 'cover';
            
            // Set appropriate background properties based on mode
            if (backgroundMode === 'cover') {
                editor.style.backgroundSize = 'cover';
                editor.style.backgroundPosition = 'center';
                editor.style.backgroundRepeat = 'no-repeat';
            } else if (backgroundMode === 'repeat') {
                editor.style.backgroundSize = 'auto';
                editor.style.backgroundPosition = '0 0';
                editor.style.backgroundRepeat = 'repeat';
            } else if (backgroundMode === 'auto') {
                editor.style.backgroundSize = 'auto';
                editor.style.backgroundPosition = 'center';
                editor.style.backgroundRepeat = 'no-repeat';
            }
            
            // Update background mode dropdown
            const backgroundModeSelect = document.getElementById('background-mode');
            if (backgroundModeSelect) {
                backgroundModeSelect.value = backgroundMode;
            }
        } else {
            editor.style.backgroundImage = 'none';
        }
        
        // Create clickable areas
        if (scene.areas && Array.isArray(scene.areas)) {
            scene.areas.forEach(areaData => {
                createClickableArea(areaData);
            });
        }
    }
}

// Add a new scene
function addScene() {
    const sceneName = prompt("Enter new scene name:");
    if (sceneName && !scenes[sceneName]) {
        scenes[sceneName] = { gif: '', areas: [], backgroundMode: 'cover' };
        updateSceneSelector();
        currentScene = sceneName;
        document.getElementById('scene-selector').value = sceneName;
        displayScene(sceneName);
        saveScenesToStorage();
    } else if (scenes[sceneName]) {
        alert("Scene name already exists.");
    }
}

// Delete the current scene
function deleteScene() {
    if (Object.keys(scenes).length <= 1) {
        alert("Cannot delete the only scene.");
        return;
    }
    
    if (confirm("Are you sure you want to delete scene \"" + currentScene + "\"?")) {
        delete scenes[currentScene];
        currentScene = Object.keys(scenes)[0];
        updateSceneSelector();
        displayScene(currentScene);
        saveScenesToStorage();
    }
}

// Rename the current scene
function renameScene() {
    const newName = prompt("Enter new scene name:", currentScene);
    if (newName && !scenes[newName] && newName !== currentScene) {
        scenes[newName] = scenes[currentScene];
        delete scenes[currentScene];
        currentScene = newName;
        updateSceneSelector();
        saveScenesToStorage();
    } else if (scenes[newName]) {
        alert("Scene name already exists.");
    }
}

// Upload a GIF for the current scene
function uploadGif(event) {
    const file = event.target.files[0];
    if (file) {
        // Check file size - limit to 2MB to be safe with localStorage limits
        const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
        if (file.size > maxSizeInBytes) {
            alert(`File is too large (${(file.size / (1024 * 1024)).toFixed(2)}MB). Maximum size is 2MB. Please choose a smaller GIF.`);
            // Reset the file input
            event.target.value = '';
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                scenes[currentScene].gif = e.target.result;
                displayScene(currentScene);
                saveScenesToStorage();
            } catch (error) {
                if (error.name === 'QuotaExceededError') {
                    alert('Storage quota exceeded. The GIF might still be too large or you have too many scenes stored. Try using a smaller GIF or clearing some data.');
                } else {
                    alert('Error saving the GIF: ' + error.message);
                }
                // Reset the scene's GIF to avoid partial updates
                displayScene(currentScene);
            }
        };
        reader.readAsDataURL(file);
    }
}

// Clear all data from localStorage
function clearStorage() {
    if (confirm("Are you sure you want to clear all data? This cannot be undone.")) {
        localStorage.removeItem(STORAGE_KEY);
        scenes = { "1": { gif: '', areas: [] } };
        currentScene = "1";
        updateSceneSelector();
        displayScene(currentScene);
    }
}
