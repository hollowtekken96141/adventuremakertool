// Export the game as a standalone HTML file
function exportGame() {
    const title = prompt("Enter a title for your game:", "My Adventure Game");
    if (!title) return;
    
    // Create a simple HTML file with the game content
    const gameData = JSON.stringify(scenes);
    
    // Create the HTML content
    const doc = document.implementation.createHTMLDocument(title);
    
    // Set up the head
    const meta = document.createElement('meta');
    meta.setAttribute('charset', 'UTF-8');
    doc.head.appendChild(meta);
    
    const viewport = document.createElement('meta');
    viewport.setAttribute('name', 'viewport');
    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
    doc.head.appendChild(viewport);
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #000;
        }
        
        .game-container {
            width: 375px;
            height: 667px;
            position: relative;
            background-color: white;
            overflow: hidden;
        }
        
        .clickable-area {
            position: absolute;
            cursor: pointer;
        }
    `;
    doc.head.appendChild(style);
    
    // Set up the body
    const container = document.createElement('div');
    container.className = 'game-container';
    container.id = 'game-container';
    doc.body.appendChild(container);
    
    // Add the script
    const script = document.createElement('script');
    script.textContent = `
        // Game data
        const scenes = ${gameData};
        let currentScene = "1";
        
        // Initialize the game
        document.addEventListener("DOMContentLoaded", function() {
            displayScene(currentScene);
        });
        
        // Display a scene
        function displayScene(sceneName) {
            const container = document.getElementById("game-container");
            container.innerHTML = "";
            
            const scene = scenes[sceneName];
            if (!scene) return;
            
            // Set background
            if (scene.gif) {
                container.style.backgroundImage = "url('" + scene.gif + "')";
                
                // Apply background mode
                const backgroundMode = scene.backgroundMode || 'cover';
                
                // Set appropriate background properties based on mode
                if (backgroundMode === 'cover') {
                    container.style.backgroundSize = 'cover';
                    container.style.backgroundPosition = 'center';
                    container.style.backgroundRepeat = 'no-repeat';
                } else if (backgroundMode === 'repeat') {
                    container.style.backgroundSize = 'auto';
                    container.style.backgroundPosition = '0 0';
                    container.style.backgroundRepeat = 'repeat';
                } else if (backgroundMode === 'auto') {
                    container.style.backgroundSize = 'auto';
                    container.style.backgroundPosition = 'center';
                    container.style.backgroundRepeat = 'no-repeat';
                }
            } else {
                container.style.backgroundImage = "none";
            }
            
            // Create clickable areas
            if (scene.areas && Array.isArray(scene.areas)) {
                scene.areas.forEach(function(area) {
                    const areaElement = document.createElement("div");
                    areaElement.classList.add("clickable-area");
                    areaElement.style.top = area.top;
                    areaElement.style.left = area.left;
                    areaElement.style.width = area.width;
                    areaElement.style.height = area.height;
                    
                    areaElement.addEventListener("click", function() {
                        if (area.targetType === "scene" && area.target) {
                            displayScene(area.target);
                        } else if (area.targetType === "external" && area.target) {
                            const target = area.openInNewTab ? "_blank" : "_self";
                            window.open(area.target, target);
                        }
                    });
                    
                    container.appendChild(areaElement);
                });
            }
        }
    `;
    doc.body.appendChild(script);
    
    // Get the HTML content
    const html = '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;
    
    // Create a download link for the HTML file
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = title.replace(/\s+/g, '-').toLowerCase() + '.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
