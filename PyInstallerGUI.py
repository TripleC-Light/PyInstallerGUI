import subprocess
import tkinter as tk
from tkinter import filedialog

scriptsPath = tk.__path__[0]
scriptsPath = scriptsPath.split('\\')
tmp = ''
for i in range(0, len(scriptsPath)-2):
    tmp = tmp + scriptsPath[i] + '\\'
pyinstallerPath = tmp + 'scripts\\pyinstaller'
print(pyinstallerPath)

tkCase = 0
tk = tk.Tk()
tk.withdraw()
if tkCase == 0:
    file_path = filedialog.askopenfilename()    # 取得檔案名
elif tkCase == 1:
    file_path = filedialog.askdirectory()       # 取得路徑
elif tkCase == 2:
    file_path = filedialog.askopenfilenames()   # 取得多檔案路徑
    for f in file_path:
        print(f)
tk.destroy()
print(file_path)

dirPath = file_path.split('/')
tmp = ''
for i in range(0, len(dirPath)-1):
    tmp = tmp + dirPath[i] + '/'
dirPath = tmp + 'PyInstaller/dist'
buildPath = tmp + 'PyInstaller/build'
specPath = tmp + 'PyInstaller'
print(dirPath)

p = subprocess.Popen([pyinstallerPath, file_path, '-F', '--clean', '--distpath=' + dirPath, '--workpath=' + buildPath, '--specpath=' + specPath], shell=True, creationflags=0x08, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
_stdoutput, _erroutput = p.communicate()
_stdoutput = _stdoutput.decode("Big5")
_erroutput = _erroutput.decode("Big5")
print('_stdoutput: ', _stdoutput)
print('_erroutput: ', _erroutput)
