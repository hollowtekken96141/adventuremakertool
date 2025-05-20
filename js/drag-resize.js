// Drag functionality
let dragTarget = null;
let dragOffsetX = 0;
let dragOffsetY = 0;

function startDrag(e) {
    // Ignore if clicking on buttons or resize handle
    if (e.target !== this) return;
    
    dragTarget = this;
    dragOffsetX = e.clientX - this.getBoundingClientRect().left;
    dragOffsetY = e.clientY - this.getBoundingClientRect().top;
    
    // Add global event listeners
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
    
    // Prevent default to avoid text selection during drag
    e.preventDefault();
}

function drag(e) {
    if (!dragTarget) return;
    
    const editor = document.getElementById('editor');
    const editorRect = editor.getBoundingClientRect();
    
    // Calculate new position relative to the editor
    let newLeft = e.clientX - editorRect.left - dragOffsetX;
    let newTop = e.clientY - editorRect.top - dragOffsetY;
    
    // Constrain to editor boundaries
    newLeft = Math.max(0, Math.min(newLeft, editorRect.width - dragTarget.offsetWidth));
    newTop = Math.max(0, Math.min(newTop, editorRect.height - dragTarget.offsetHeight));
    
    // Update position
    dragTarget.style.left = newLeft + 'px';
    dragTarget.style.top = newTop + 'px';
    
    // Update the area data in the scenes object
    updateAreaPosition(dragTarget);
}

function stopDrag() {
    if (dragTarget) {
        // Save the final position
        saveScenesToStorage();
        dragTarget = null;
    }
    
    // Remove global event listeners
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', stopDrag);
}

// Resize functionality
let resizeTarget = null;

function startResize(e) {
    resizeTarget = this.parentElement;
    
    // Add global event listeners
    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResize);
    
    // Prevent default to avoid text selection during resize
    e.preventDefault();
}

function resize(e) {
    if (!resizeTarget) return;
    
    const editor = document.getElementById('editor');
    const editorRect = editor.getBoundingClientRect();
    const areaRect = resizeTarget.getBoundingClientRect();
    
    // Calculate new dimensions
    let newWidth = e.clientX - areaRect.left;
    let newHeight = e.clientY - areaRect.top;
    
    // Constrain to editor and minimum size
    newWidth = Math.max(50, Math.min(newWidth, editorRect.right - areaRect.left));
    newHeight = Math.max(50, Math.min(newHeight, editorRect.bottom - areaRect.top));
    
    // Update dimensions
    resizeTarget.style.width = newWidth + 'px';
    resizeTarget.style.height = newHeight + 'px';
    
    // Update the area data in the scenes object
    updateAreaDimensions(resizeTarget);
}

function stopResize() {
    if (resizeTarget) {
        // Save the final dimensions
        saveScenesToStorage();
        resizeTarget = null;
    }
    
    // Remove global event listeners
    document.removeEventListener('mousemove', resize);
    document.removeEventListener('mouseup', stopResize);
}
