let pyodideReady = false;
let pyodide;

async function loadPyodideAndPackages() {
  pyodide = await loadPyodide();
  pyodideReady = true;
  console.log("Pyodide loaded.");
}
loadPyodideAndPackages();

async function runCode() {
  if (!pyodideReady) {
    alert("Python is still loading...");
    return;
  }

  const code = document.getElementById("code").value;
  let outputArea = document.getElementById("output");
  
  try {
    // Redirect stdout to capture print statements
    pyodide.runPython(`
      import sys
      import io
      sys.stdout = io.StringIO()
      sys.stderr = sys.stdout
    `);

    await pyodide.runPythonAsync(code);

    const result = pyodide.runPython("sys.stdout.getvalue()");
    outputArea.textContent = result || "Code executed.";
  } catch (err) {
    outputArea.textContent = String(err);
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

function switchToHtmlcssjs() {
  window.open('../HTMLCSSJS Editor/index.html', '_blank');
}

function switchToJS() {
  window.open('../Javascript Editor/index.html', '_blank');
}

function switchToSql() {
  window.open('../SQL Editor/index.html', '_blank');
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
});

// Watch for system theme changes
prefersDarkScheme.addListener(e => {
  const newTheme = e.matches ? 'dark' : 'light';
  document.body.classList.toggle('light-mode', !e.matches);
  localStorage.setItem('theme', newTheme);
  toggle.src = e.matches ? "/TryCode Editor/Attachments/sun.png" 
                        : "/TryCode Editor/Attachments/moon.png";
});