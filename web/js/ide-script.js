// Initialisation de l'éditeur ACE
const editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/python"); // Langage par défaut
editor.setFontSize(14);

// Références des éléments DOM
const languageSelector = document.getElementById("languageSelector");
const outputHeader = document.getElementById("output-header-text");
const settingsMenu = document.getElementById("settingsMenu");
const themeSelector = document.getElementById("themeSelector");
const fontSizeSelector = document.getElementById("fontSizeSelector");

// --- LOGIQUE DE L'ÉDITEUR ET DES LANGAGES ---

const languageModes = {
    python: "python",
    javascript: "javascript",
    java: "java",
    csharp: "csharp",
    php: "php"
};

const languageTemplates = {
    python: `print('Hello, Python!')`,
    javascript: `console.log('Hello, JavaScript!');`,
    java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
    }
}`,
    csharp: `using System;

public class Program {
    public static void Main() {
        Console.WriteLine("Hello, C#!");
    }
}`,
    php: `<?php

echo 'Hello, PHP!';`
};

languageSelector.addEventListener("change", () => {
    const selectedLanguage = languageSelector.value;
    editor.session.setMode(`ace/mode/${languageModes[selectedLanguage]}`);
    editor.setValue(languageTemplates[selectedLanguage]);
    outputHeader.textContent = `Console ${selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)}`;
});

function clearEditor() {
    const selectedLanguage = languageSelector.value;
    editor.setValue(languageTemplates[selectedLanguage]);
}

// --- LOGIQUE D'EXÉCUTION DU CODE (API PISTON) ---

async function runCode() {
    const code = editor.getValue();
    const outputPre = document.getElementById("drawerOutput");
    const selectedLanguage = languageSelector.value;

    outputPre.textContent = "⏳ Exécution en cours...";
    openDrawer();

    const pistonApiUrl = "https://emkc.org/api/v2/piston/execute";

    const payload = {
        language: selectedLanguage,
        version: "*", // Piston sélectionne la dernière version stable
        files: [
            {
                content: code
            }
        ]
    };

    try {
        const res = await fetch(pistonApiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (data.run && data.run.stdout) {
            outputPre.textContent = data.run.stdout;
        } else if (data.run && data.run.stderr) {
            outputPre.textContent = `❌ Erreur: ${data.run.stderr}`;
        } else {
            outputPre.textContent = "Aucune sortie ou erreur inconnue.";
        }

    } catch (err) {
        outputPre.textContent = "❌ Erreur de connexion à l'API Piston.";
        console.error(err);
    }
}

// --- LOGIQUE DE SAUVEGARDE ET DE L'INTERFACE ---

function saveCode(extension) {
    const code = editor.getValue();
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `code.${extension}`;
    a.click();
}

function clearOutput() {
    document.getElementById("drawerOutput").textContent = "";
}

function openDrawer() {
    document.getElementById("outputDrawer").classList.add("open");
}

function closeDrawer() {
    document.getElementById("outputDrawer").classList.remove("open");
}

// --- LOGIQUE DU MENU DES PARAMÈTRES ---

function toggleMenu() {
    settingsMenu.classList.toggle("open");
}

// Appliquer les préférences sauvegardées au chargement
function applySavedSettings() {
    const savedTheme = localStorage.getItem('editorTheme') || 'ace/theme/monokai';
    const savedFontSize = localStorage.getItem('editorFontSize') || 14;

    editor.setTheme(savedTheme);
    themeSelector.value = savedTheme;

    editor.setFontSize(parseInt(savedFontSize, 10));
    fontSizeSelector.value = savedFontSize;
}

// Gérer les changements de thème
themeSelector.addEventListener('change', (e) => {
    const selectedTheme = e.target.value;
    editor.setTheme(selectedTheme);
    localStorage.setItem('editorTheme', selectedTheme);
});

// Gérer les changements de taille de police
fontSizeSelector.addEventListener('input', (e) => {
    const newSize = e.target.value;
    editor.setFontSize(parseInt(newSize, 10));
    localStorage.setItem('editorFontSize', newSize);
});

// --- INITIALISATION ---

// Initialiser avec le langage par défaut et les paramètres sauvegardés
clearEditor();
outputHeader.textContent = `Console ${languageSelector.value.charAt(0).toUpperCase() + languageSelector.value.slice(1)}`;
applySavedSettings();