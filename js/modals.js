// Create modal for editing clickable area
function createEditModal() {
    // Check if modal already exists
    if (document.getElementById('edit-area-modal')) return;
    
    const modal = document.createElement('div');
    modal.id = 'edit-area-modal';
    modal.className = 'modal';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    const heading = document.createElement('h3');
    heading.textContent = 'Edit Clickable Area';
    modalContent.appendChild(heading);
    
    // Target type selection
    const typeGroup = document.createElement('div');
    typeGroup.className = 'form-group';
    
    const typeLabel = document.createElement('label');
    typeLabel.setAttribute('for', 'target-type');
    typeLabel.textContent = 'Target Type:';
    typeGroup.appendChild(typeLabel);
    
    const typeSelect = document.createElement('select');
    typeSelect.id = 'target-type';
    
    const sceneOption = document.createElement('option');
    sceneOption.value = 'scene';
    sceneOption.textContent = 'Scene';
    typeSelect.appendChild(sceneOption);
    
    const externalOption = document.createElement('option');
    externalOption.value = 'external';
    externalOption.textContent = 'External Link';
    typeSelect.appendChild(externalOption);
    
    // Add change event to toggle between scene select and URL input
    typeSelect.addEventListener('change', function() {
        toggleTargetInputs(this.value);
    });
    
    typeGroup.appendChild(typeSelect);
    modalContent.appendChild(typeGroup);
    
    // Target inputs container
    const targetGroup = document.createElement('div');
    targetGroup.className = 'form-group';
    
    const targetLabel = document.createElement('label');
    targetLabel.id = 'target-label';
    targetLabel.textContent = 'Target Scene:';
    targetGroup.appendChild(targetLabel);
    
    // Scene select dropdown
    const sceneSelect = document.createElement('select');
    sceneSelect.id = 'scene-target-select';
    sceneSelect.className = 'target-input';
    targetGroup.appendChild(sceneSelect);
    
    // External URL input
    const urlInput = document.createElement('input');
    urlInput.id = 'external-target-input';
    urlInput.className = 'target-input';
    urlInput.type = 'text';
    urlInput.placeholder = 'Enter URL (e.g., https://example.com)';
    urlInput.style.display = 'none';
    targetGroup.appendChild(urlInput);
    
    // New tab option (only visible when external link is selected)
    const newTabGroup = document.createElement('div');
    newTabGroup.className = 'form-group';
    newTabGroup.id = 'new-tab-group';
    newTabGroup.style.display = 'none';
    
    const newTabCheckboxContainer = document.createElement('div');
    newTabCheckboxContainer.style.display = 'flex';
    newTabCheckboxContainer.style.alignItems = 'center';
    
    const newTabCheckbox = document.createElement('input');
    newTabCheckbox.type = 'checkbox';
    newTabCheckbox.id = 'new-tab-checkbox';
    newTabCheckbox.style.width = 'auto';
    newTabCheckbox.style.marginRight = '10px';
    newTabCheckboxContainer.appendChild(newTabCheckbox);
    
    const newTabLabel = document.createElement('label');
    newTabLabel.setAttribute('for', 'new-tab-checkbox');
    newTabLabel.textContent = 'Open in new tab';
    newTabLabel.style.display = 'inline';
    newTabLabel.style.marginBottom = '0';
    newTabCheckboxContainer.appendChild(newTabLabel);
    
    newTabGroup.appendChild(newTabCheckboxContainer);
    targetGroup.appendChild(newTabGroup);
    
    modalContent.appendChild(targetGroup);
    
    // Buttons
    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'modal-buttons';
    
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.style.backgroundColor = '#f44336';
    cancelButton.onclick = function() {
        modal.style.display = 'none';
    };
    
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.onclick = function() {
        const areaIndex = parseInt(modal.dataset.areaIndex);
        
        if (areaIndex === -1) {
            modal.style.display = 'none';
            return;
        }
        
        const targetType = typeSelect.value;
        let target = '';
        let openInNewTab = false;
        
        if (targetType === 'scene') {
            target = sceneSelect.value;
        } else {
            target = urlInput.value;
            openInNewTab = document.getElementById('new-tab-checkbox').checked;
        }
        
        // Update the area data
        scenes[currentScene].areas[areaIndex].targetType = targetType;
        scenes[currentScene].areas[areaIndex].target = target;
        scenes[currentScene].areas[areaIndex].openInNewTab = openInNewTab;
        
        // Update the element's dataset
        document.querySelectorAll('.clickable-area')[areaIndex].dataset.targetType = targetType;
        document.querySelectorAll('.clickable-area')[areaIndex].dataset.target = target;
        
        saveScenesToStorage();
        modal.style.display = 'none';
    };
    
    buttonsDiv.appendChild(cancelButton);
    buttonsDiv.appendChild(saveButton);
    modalContent.appendChild(buttonsDiv);
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}

// Populate scene select dropdown
function populateSceneSelect(selectElement, currentValue) {
    selectElement.innerHTML = '';
    
    // Add an empty option
    const emptyOption = document.createElement('option');
    emptyOption.value = '';
    emptyOption.textContent = '-- Select a scene --';
    selectElement.appendChild(emptyOption);
    
    // Add all available scenes
    for (const sceneName in scenes) {
        const option = document.createElement('option');
        option.value = sceneName;
        option.textContent = sceneName;
        selectElement.appendChild(option);
    }
    
    // Set current value if provided
    if (currentValue) {
        selectElement.value = currentValue;
    }
}
