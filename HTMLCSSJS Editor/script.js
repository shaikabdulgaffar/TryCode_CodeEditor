const htmlCode = document.getElementById('html-code');
const cssCode = document.getElementById('css-code');
const jsCode = document.getElementById('js-code');
const output = document.getElementById('output');

function runCode() {
  const html = htmlCode.value;
  const css = `<style>${cssCode.value}</style>`;
  const js = `<script>${jsCode.value}<\/script>`;
  const source = html + css + js;
  output.srcdoc = source;
}

[htmlCode, cssCode, jsCode].forEach(editor =>
  editor.addEventListener('keyup', runCode)
);

// Set initial code
htmlCode.value = `<h1>Hey, write your code here.....</h1>`;
cssCode.value = `h1 { color: #e91e63; text-align: center; }`;
jsCode.value = `console.log("Editor Loaded");`;

// Run initial code
runCode();

function switchTab(tab) {
  // Update active tab
  document.querySelectorAll('.code-tab').forEach(t => t.classList.remove('active'));
  document.querySelector(`.code-tab[onclick="switchTab('${tab}')"]`).classList.add('active');
  
  // Update active code block
  document.querySelectorAll('.code-block').forEach(b => b.classList.remove('active'));
  document.getElementById(`${tab}-block`).classList.add('active');
}

function copyCode() {
  let codeToCopy;
  const activeTab = document.querySelector('.code-tab.active').getAttribute('onclick').match(/'([^']+)'/)[1];
  
  if (activeTab === 'html') {
    codeToCopy = htmlCode.value;
  } else if (activeTab === 'css') {
    codeToCopy = cssCode.value;
  } else if (activeTab === 'js') {
    codeToCopy = jsCode.value;
  }
  
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(codeToCopy)
    .then(() => alert("Code copied!"))
    .catch(err => alert("Failed to copy code: " + err));
  } else {
    const textarea = document.createElement('textarea');
    textarea.value = codeToCopy;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      const successful = document.execCommand('copy');
      alert(successful ? "Code copied!" : "Copy failed");
    } catch (err) {
      alert("Copy not supported: " + err);
    }
    document.body.removeChild(textarea);
  }
}

function clearOutput() {
  output.srcdoc = '';
}

function switchToPython() {
  window.open('../Python Editor/index.html', '_blank');
}

function switchToJS() {
  window.open('../Javascript Editor/index.html', '_blank');
}

function switchToSql() {
  window.open('../SQL Editor/index.html', '_blank');
}

// Resizer Functionality
const dragbar = document.getElementById("dragbar");
const leftPanel = document.querySelector(".code-container");
const rightPanel = document.querySelector(".output-panel");
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