const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, 'data.txt');

const itemInput = document.getElementById("itemInput");
const quantityInput = document.getElementById("quantityInput");
const categoryInput = document.getElementById("newCategoryInput");
const categorySelect = document.getElementById("categorySelect");
const categoryDisplay = document.getElementById("categoryDisplay");


let categories = {}; // { categoryName: [ { item, quantity } ] }

function loadData() {
  if (fs.existsSync(dataFilePath)) {
    const lines = fs.readFileSync(dataFilePath, 'utf-8').split('\n');
    categories = {};
    lines.forEach(line => {
      const [cat, item, qty] = line.split('||');
      if (cat && item) {
        if (!categories[cat]) categories[cat] = [];
        categories[cat].push({ item, quantity: parseInt(qty) || 1 });
      }
    });
  } else {
    categories = {};
  }
}

function saveData() {
    console.log("[SAVE] Attempting to save data:", categories);
    const lines = [];
    for (const cat in categories) {
      categories[cat].forEach(entry => {
        lines.push(`${cat}||${entry.item}||${entry.quantity}`);
      });
    }
    fs.writeFileSync(dataFilePath, lines.join('\n'), 'utf-8');
    console.log("[SAVE] Written to data.txt");
  }
  

function updateCategorySelect() {
  categorySelect.innerHTML = "";
  for (const cat in categories) {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  }
}
function renderCategoryDisplay() {
    categoryDisplay.innerHTML = "";
    for (const cat in categories) {
      const block = document.createElement("div");
      block.className = "category-block-new";
  
      // Category title with delete icon
      const titleWrapper = document.createElement("div");
      titleWrapper.className = "category-title";
  
        // Left heart
        const heartLeft = document.createElement("img");
        heartLeft.src = "heart.png";
        heartLeft.alt = "heart";
        heartLeft.style.height = "16px";
        heartLeft.style.verticalAlign = "middle";
        heartLeft.style.marginRight = "6px";

        // Right heart
        const heartRight = document.createElement("img");
        heartRight.src = "heart.png";
        heartRight.alt = "heart";
        heartRight.style.height = "16px";
        heartRight.style.verticalAlign = "middle";
        heartRight.style.marginLeft = "6px";

        // Title text
        const titleText = document.createElement("span");
        titleText.textContent = cat;

        // Append all to title wrapper
        titleWrapper.appendChild(heartLeft);
        titleWrapper.appendChild(titleText);
        titleWrapper.appendChild(heartRight);
  
      const catDel = document.createElement("img");
      catDel.src = "trash.png";
      catDel.alt = "Delete category";
      catDel.className = "delete-icon";
      catDel.style.height = "22px";
      catDel.style.verticalAlign = "middle";
      catDel.style.cursor = "pointer";
      catDel.style.marginLeft = "10px";
      catDel.onclick = () => {
        if (confirm(`Delete entire category "${cat}"?`)) {
          delete categories[cat];
          saveData();
          updateCategorySelect();
          renderCategoryDisplay();
        }
      };
  
      titleWrapper.appendChild(catDel);
      block.appendChild(titleWrapper);
  
      // Item list
      const ul = document.createElement("ul");
      categories[cat].forEach((entry, index) => {
        const li = document.createElement("li");
        li.textContent = `${entry.item} (x${entry.quantity})`;
  
        const del = document.createElement("img");
        del.src = "trash.png";
        del.alt = "Delete item";
        del.className = "delete-icon";
        del.style.height = "18px";
        del.style.verticalAlign = "middle";
        del.style.cursor = "pointer";
        del.style.marginLeft = "10px";
        del.onclick = () => {
          categories[cat].splice(index, 1);
          if (categories[cat].length === 0) delete categories[cat];
          saveData();
          updateCategorySelect();
          renderCategoryDisplay();
        };
  
        li.appendChild(del);
        ul.appendChild(li);
      });
  
      block.appendChild(ul);
      categoryDisplay.appendChild(block);
    }
  }
  

function addCategory() {
  const newCat = categoryInput.value.trim();
  if (newCat && !categories[newCat]) {
    categories[newCat] = [];
    saveData();
    updateCategorySelect();
    renderCategoryDisplay();
    categoryInput.value = "";
  }
}

function addItem() {
  const item = itemInput.value.trim();
  const quantity = parseInt(quantityInput.value.trim()) || 1;
  const category = categorySelect.value;
  if (item && category) {
    categories[category].push({ item, quantity });
    saveData();
    renderCategoryDisplay();
    itemInput.value = "";
    quantityInput.value = "1";
  }
}

// Init
loadData();
updateCategorySelect();
renderCategoryDisplay();
