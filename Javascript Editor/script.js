// Language switching functionality
function switchToPython() {
    window.open('../Python Editor/index.html', '_blank');
}

function switchToHTML() {
  alert("HTML/CSS/JS editor coming soon!");
}

function switchToJS() {
  // Already in JS mode
  document.getElementById('filename').textContent = 'script.js';
  document.getElementById('code').placeholder = '// Write JavaScript code here...';
  updateActiveButton('JavaScript');
}

function updateActiveButton(lang) {
  const buttons = document.querySelectorAll('.lang-buttons button');
  buttons.forEach(btn => {
    if (btn.textContent.includes(lang)) {
      btn.classList.add('active-lang');
    } else {
      btn.classList.remove('active-lang');
    }
  });
}

// Initialize with JS as active
updateActiveButton('JavaScript');

// JavaScript execution
function runCode() {
  const code = document.getElementById("code").value;
  const outputArea = document.getElementById("output");
  
  try {
    // Backup original console.log
    const originalConsoleLog = console.log;
    let output = "";
    
    // Override console.log to capture output
    console.log = function() {
      for (let i = 0; i < arguments.length; i++) {
        output += arguments[i] + ' ';
      }
      output += '\n';
      originalConsoleLog.apply(console, arguments);
    };
    
    // Execute the code
    const result = new Function(code)();
    
    // If the code returns something (not just console.log)
    if (result !== undefined) {
      output += result;
    }
    
    // Restore original console.log
    console.log = originalConsoleLog;
    
    outputArea.textContent = output || "Code executed with no output";
  } catch (err) {
    outputArea.textContent = err.stack || String(err);
  }
}

function copyCode() {
  const code = document.getElementById("code");
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(code.value)
    .then(() => alert("Code copied!"))
    .catch(err => alert("Failed to copy code: " + err));
  } else {
    code.select();
    try {
      const successful = document.execCommand('copy');
      alert(successful ? "Code copied!" : "Copy failed");
    } catch (err) {
      alert("Copy not supported: " + err);
    }
  }
}

function clearOutput() {
  document.getElementById("output").textContent = ">";
}

// Resizer Functionality
const dragbar = document.getElementById("dragbar");
const leftPanel = document.getElementById("codePanel");
const rightPanel = document.getElementById("outputPanel");
let dragging = false;

dragbar.addEventListener("mousedown", function (e) {
  e.preventDefault();
  dragging = true;
  document.body.style.cursor = "col-resize";
});

window.addEventListener("mousemove", function (e) {
  if (!dragging) return;
  const containerWidth = document.querySelector(".container").offsetWidth;
  const leftWidth = e.clientX;
  const rightWidth = containerWidth - leftWidth - dragbar.offsetWidth;

  if (leftWidth < 100 || rightWidth < 100) return;

  leftPanel.style.width = `${leftWidth}px`;
  rightPanel.style.width = `${rightWidth}px`;
});

window.addEventListener("mouseup", function () {
  dragging = false;
  document.body.style.cursor = "default";
});

// Dark/Light Mode Toggle
const toggle = document.getElementById('darkModeToggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Set initial theme
const currentTheme = localStorage.getItem('theme') || 
                   (prefersDarkScheme.matches ? 'dark' : 'light');

if (currentTheme === 'light') {
  document.body.classList.add('light-mode');
  toggle.src = "/TryCode Editor/Attachments/moon.png";
}

// Toggle functionality
toggle.addEventListener('click', () => {
  const isLight = document.body.classList.toggle('light-mode');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
  toggle.src = isLight ? "/TryCode Editor/Attachments/moon.png" 
                      : "/TryCode Editor/Attachments/sun.png";
  // Update active button colors
  updateActiveButton('JavaScript');
});

// Watch for system theme changes
prefersDarkScheme.addListener(e => {
  const newTheme = e.matches ? 'dark' : 'light';
  document.body.classList.toggle('light-mode', !e.matches);
  localStorage.setItem('theme', newTheme);
  toggle.src = e.matches ? "/TryCode Editor/Attachments/sun.png" 
                        : "/TryCode Editor/Attachments/moon.png";
  // Update active button colors
  updateActiveButton('JavaScript');
});