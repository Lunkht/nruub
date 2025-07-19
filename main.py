import eel
import sys
import subprocess
import tkinter as tk
from tkinter import filedialog
import json

_private_mode = '--private' in sys.argv

# Initialize Eel with the 'web' folder
eel.init('web')

@eel.expose
def is_private_mode():
    return _private_mode

@eel.expose
def new_window():
    """Launches a new instance of the application in a separate process."""
    subprocess.Popen([sys.executable, 'main.py'])

@eel.expose
def private_window():
    """Launches a new instance of the application in private browsing mode."""
    subprocess.Popen([sys.executable, 'main.py', '--private'])

@eel.expose
def save_as(content):
    """Opens a native 'Save As' dialog and saves the given content to a file."""
    root = tk.Tk()
    root.withdraw()  # Hide the main tkinter window
    file_path = filedialog.asksaveasfilename(defaultextension=".html", filetypes=([("HTML Document", "*.html"), ("All files", "*.*")]), title="Enregistrer la page sous…")
    if file_path:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
    root.destroy()

@eel.expose
def save_url(url, title):
    """Saves a URL and title to a JSON file."""
    try:
        with open('saved_urls.json', 'r+') as f:
            data = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        data = []
    
    data.append({'url': url, 'title': title})
    
    with open('saved_urls.json', 'w') as f:
        json.dump(data, f, indent=4)

# Start the application
eel.start('html/index.html', size=(1024, 768))