let db = null;
let sqlReady = false;

// Initialize SQL.js
function initSQL() {
  const config = {
    locateFile: filename => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${filename}`
  };
  
  initSqlJs(config).then(function(SQL) {
    // Create a new database
    db = new SQL.Database();
    sqlReady = true;
    console.log("SQL.js initialized");
    
    // Initialize with a sample database
    initSampleDatabase();
  }).catch(function(err) {
    console.error("Error loading SQL.js:", err);
    document.getElementById("output").innerHTML = "Error loading SQL engine: " + err.message;
  });
}

// Initialize with a sample database
function initSampleDatabase() {
  if (!sqlReady) {
    alert("SQL engine is still loading...");
    return;
  }
  
  try {
    // Clear existing database
    db.close();
    const config = {
      locateFile: filename => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${filename}`
    };
    
    initSqlJs(config).then(function(SQL) {
      db = new SQL.Database();
      
      // Create sample tables
      db.run(`
        CREATE TABLE employees (
          id INTEGER PRIMARY KEY,
          name TEXT,
          department TEXT,
          salary REAL,
          hire_date TEXT
        );
        
        CREATE TABLE departments (
          id INTEGER PRIMARY KEY,
          name TEXT,
          location TEXT,
          budget REAL
        );
        
        INSERT INTO departments VALUES 
          (1, 'Engineering', 'Floor 1', 1000000),
          (2, 'Marketing', 'Floor 2', 500000),
          (3, 'Sales', 'Floor 3', 750000),
          (4, 'HR', 'Floor 4', 300000);
          
        INSERT INTO employees VALUES 
          (1, 'John Doe', 'Engineering', 85000, '2020-01-15'),
          (2, 'Jane Smith', 'Marketing', 75000, '2019-05-22'),
          (3, 'Mike Johnson', 'Engineering', 92000, '2018-11-03'),
          (4, 'Sarah Williams', 'Sales', 68000, '2021-02-14'),
          (5, 'David Brown', 'HR', 65000, '2020-07-30'),
          (6, 'Emily Davis', 'Engineering', 88000, '2019-09-10'),
          (7, 'Robert Wilson', 'Marketing', 72000, '2021-01-05'),
          (8, 'Lisa Taylor', 'Sales', 70000, '2018-03-18');
      `);
      
      document.getElementById("output").innerHTML = "✓ Sample database loaded with:<br>" +
        "- employees table (8 records)<br>" +
        "- departments table (4 records)";
    });
  } catch (err) {
    document.getElementById("output").innerHTML = "Error initializing sample database: " + err.message;
  }
}

// Execute SQL queries
function runSQL() {
  if (!sqlReady) {
    alert("SQL engine is still loading...");
    return;
  }
  
  const sql = document.getElementById("code").value;
  
  try {
    let output = "";
    const results = db.exec(sql); // returns an array of results
    
    if (results.length === 0) {
      output = "✓ Query executed successfully (no results to display)";
    } else {
      results.forEach(result => {
        if (result.columns && result.values) {
          // Create a table for the results
          output += "<table><thead><tr>";
          
          // Add column headers
          result.columns.forEach(col => {
            output += `<th>${col}</th>`;
          });
          
          output += "</tr></thead><tbody>";
          
          // Add rows
          result.values.forEach(row => {
            output += "<tr>";
            row.forEach(cell => {
              output += `<td>${cell !== null ? cell : "NULL"}</td>`;
            });
            output += "</tr>";
          });
          
          output += "</tbody></table>";
        }
      });
    }
    
    document.getElementById("output").innerHTML = output || "✓ Query executed successfully";
  } catch (err) {
    document.getElementById("output").innerHTML = "SQL Error: " + err.message;
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
      document.getElementById("output").innerHTML = ">";
    }


    function switchToHtmlcssjs() {
      window.open('../HTMLCSSJS Editor/index.html', '_blank');
    }

    function switchToJS() {
      window.open('../Javascript Editor/index.html', '_blank');
    }

    function switchToPython() {
      window.open('../Python Editor/index.html', '_blank');
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
    
    // Initialize SQL.js when page loads
    window.onload = initSQL;