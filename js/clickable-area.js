// Create a clickable area in the editor
function createClickableArea(areaData) {
    const editor = document.getElementById('editor');
    const area = document.createElement('div');
    area.classList.add('clickable-area');
    area.style.top = areaData.top || '10%';
    area.style.left = areaData.left || '10%';
    area.style.width = areaData.width || '100px';
    area.style.height = areaData.height || '100px';
    area.dataset.target = areaData.target || '';
    area.dataset.targetType = areaData.targetType || 'scene';
    
    // Add edit button
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.classList.add('edit-button');
    area.appendChild(editButton);
    
    // Add delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'X';
    deleteButton.classList.add('delete-button');
    area.appendChild(deleteButton);
    
    // Add resize handle
    const resizeHandle = document.createElement('div');
    resizeHandle.classList.add('resize-handle');
    area.appendChild(resizeHandle);
    
    // Add drag functionality
    area.addEventListener('mousedown', startDrag);
    
    // Add resize functionality
    resizeHandle.addEventListener('mousedown', startResize);
    
    // Add button event listeners
    editButton.addEventListener('click', function(e) {
        e.stopPropagation();
        editClickableArea(area);
    });
    
    deleteButton.addEventListener('click', function(e) {
        e.stopPropagation();
        deleteClickableArea(area);
    });
    
    editor.appendChild(area);
    return area;
}

// Add a new clickable area to the current scene
function addClickableArea() {
    const areaData = {
        top: '10%',
        left: '10%',
        width: '100px',
        height: '100px',
        target: '',
        targetType: 'scene'
    };
    
    const area = createClickableArea(areaData);
    scenes[currentScene].areas.push(areaData);
    saveScenesToStorage();
}

// Edit clickable area
function editClickableArea(areaElement) {
    const areaIndex = findAreaIndex(areaElement);
    if (areaIndex === -1) return;
    
    const areaData = scenes[currentScene].areas[areaIndex];
    
    // Create modal if it doesn't exist
    createEditModal();
    
    const modal = document.getElementById('edit-area-modal');
    const typeSelect = document.getElementById('target-type');
    const sceneSelect = document.getElementById('scene-target-select');
    const urlInput = document.getElementById('external-target-input');
    
    // Populate scene select dropdown
    populateSceneSelect(sceneSelect, areaData.targetType === 'scene' ? areaData.target : '');
    
    // Set current values
    typeSelect.value = areaData.targetType || 'scene';
    
    if (areaData.targetType === 'external') {
        urlInput.value = areaData.target || '';
        document.getElementById('new-tab-checkbox').checked = areaData.openInNewTab || false;
    }
    
    // Toggle input display based on target type
    toggleTargetInputs(areaData.targetType || 'scene');
    
    // Store reference to area
    modal.dataset.areaIndex = areaIndex;
    
    // Show modal
    modal.style.display = 'block';
    
    // Function to toggle between scene select and URL input
    function toggleTargetInputs(targetType) {
        if (targetType === 'scene') {
            sceneSelect.style.display = 'block';
            urlInput.style.display = 'none';
            document.getElementById('new-tab-group').style.display = 'none';
            document.getElementById('target-label').textContent = 'Target Scene:';
        } else {
            sceneSelect.style.display = 'none';
            urlInput.style.display = 'block';
            document.getElementById('new-tab-group').style.display = 'block';
            document.getElementById('target-label').textContent = 'Target URL:';
        }
    }
}

// Delete clickable area
function deleteClickableArea(areaElement) {
    const areaIndex = findAreaIndex(areaElement);
    if (areaIndex === -1) return;
    
    if (confirm("Are you sure you want to delete this clickable area?")) {
        // Remove from DOM
        areaElement.remove();
        
        // Remove from data
        scenes[currentScene].areas.splice(areaIndex, 1);
        saveScenesToStorage();
    }
}

// Find the index of a clickable area in the current scene
function findAreaIndex(areaElement) {
    const areas = document.querySelectorAll('.clickable-area');
    for (let i = 0; i < areas.length; i++) {
        if (areas[i] === areaElement) {
            return i;
        }
    }
    return -1;
}

// Update area data in the scenes object
function updateAreaPosition(areaElement) {
    const areaIndex = findAreaIndex(areaElement);
    if (areaIndex !== -1) {
        scenes[currentScene].areas[areaIndex].left = areaElement.style.left;
        scenes[currentScene].areas[areaIndex].top = areaElement.style.top;
    }
}

function updateAreaDimensions(areaElement) {
    const areaIndex = findAreaIndex(areaElement);
    if (areaIndex !== -1) {
        scenes[currentScene].areas[areaIndex].width = areaElement.style.width;
        scenes[currentScene].areas[areaIndex].height = areaElement.style.height;
    }
}
