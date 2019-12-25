import tornado.ioloop
import tornado.web
from tornado.escape import json_decode
import webbrowser
import os
import subprocess
from tkinter import *
from tkinter import filedialog
from PIL import Image

class IndexHandler(tornado.web.RequestHandler):
    def get(self):
        self.render('index.html')

class GetPathHandler(tornado.web.RequestHandler):
    def get(self):
        CMD = self.get_argument('cmd')
        print(CMD)
        tkCase = 0
        resultData = {}
        file_path = []
        CMD = CMD.split('_')[0]
        if CMD == 'iMainPath':
            tkCase = 0
        elif CMD == 'iImportPath':
            tkCase = 0
        elif CMD == 'iDataPath':
            tkCase = 1
        elif CMD == 'iFolderPath':
            tkCase = 2
        elif CMD == 'iIcon':
            tkCase = 3

        tk = Tk()
        tk.withdraw()
        tk.lift()
        tk.attributes("-topmost", True)
        if tkCase == 0:
            file_path.append(filedialog.askopenfilename(title='Select python file', filetypes=[('.py', '*.py')]))       # 取得檔案名
        elif tkCase == 1:
            file_path.append(filedialog.askopenfilename(title='Select a file'))                                         # 取得檔案名
        elif tkCase == 2:
            file_path.append(filedialog.askdirectory(title='Select a Folder'))
        elif tkCase == 3:
            file_path.append(filedialog.askopenfilename(title='Select Icon file', filetypes=[('Icon', '*.ico')]))       # 取得檔案名
            im = Image.open(file_path[0])
            iconName = file_path[0].split('/')
            iconName = iconName[len(iconName)-1]
            print(iconName)
            im.save('./static/tmpForPyInstaller/' + iconName)

        tk.destroy()
        print(file_path)
        resultData['path'] = file_path
        self.write(resultData)


class SubmitHandler(tornado.web.RequestHandler):
    def get(self):
        print('----------------------------------------------------------------')
        CMD_List = []
        jsonData = json_decode(self.get_argument('data'))
        print(jsonData)
        fileName = jsonData['fileName']
        folderName = jsonData['folderName']
        optionList = jsonData['optionList']
        mainPath = jsonData['mainPath']
        importPathList = jsonData['importPathList']
        dataPathList = jsonData['dataPathList']
        folderPathList = jsonData['folderPathList']
        iconPath = jsonData['iconPath']

        scriptsPath = sys.executable
        pyinstallerPath = scriptsPath.replace('python.exe', 'scripts\\pyinstaller')
        CMD_List.append(pyinstallerPath)
        print('Pyinstaller >> ', pyinstallerPath)

        CMD_List.append(mainPath)
        print('mainPath >> ', mainPath)

        if folderName == '':
            folderName = 'PyInstaller'
        distPath = mainPath.split('/')
        tmp = ''
        for i in range(0, len(distPath)-1):
            tmp = tmp + distPath[i] + '/'
        distPath = tmp + folderName + '/dist'
        buildPath = tmp + folderName + '/build'
        specPath = tmp + folderName

        for importPath in importPathList:
            CMD_List.append('--hiddenimport=' + importPath)

        for option in optionList:
            if option != '':
                CMD_List.append(option)

        CMD_List.append('--distpath=' + distPath)
        CMD_List.append('--workpath=' + buildPath)
        CMD_List.append('--specpath=' + specPath)

        if fileName != '':
            CMD_List.append('-n ' + fileName)

        if iconPath != '':
            iconPath = iconPath.replace('/', '\\')
            CMD_List.append('--icon=' + iconPath)

        p = subprocess.Popen(CMD_List, shell=True, creationflags=0x08, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        _stdoutput, _erroutput = p.communicate()
        _stdoutput = _stdoutput.decode("Big5")
        _erroutput = _erroutput.decode("Big5")
        print('_stdoutput: ', _stdoutput)
        print('_erroutput: ', _erroutput)

        for userFolderPath in folderPathList:
            userFolderName = userFolderPath.split('/')
            userFolderName = userFolderName[len(userFolderName)-1]
            newFolder = tmp + folderName + '/dist/' + userFolderName
            subprocess.Popen(['md', newFolder], shell=True, creationflags=0x08, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            subprocess.Popen(['xcopy', userFolderPath, newFolder, '/e', '/s'], shell=True, creationflags=0x08, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

        for dataPath in dataPathList:
            dataPath = dataPath.replace('/', '\\')
            distPath = distPath.replace('/', '\\')
            subprocess.Popen(['copy', dataPath, distPath], shell=True, creationflags=0x08, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

        tmpPath = sys.path[0]
        tmpPath = tmpPath.replace(r'\\', '\\')
        tmpPath = tmpPath + '\\static\\tmpForPyInstaller\\*.*'
        print('tmpPath >> ', tmpPath)
        p = subprocess.Popen(['del', '/Q', tmpPath], shell=True, creationflags=0x08, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        _stdoutput, _erroutput = p.communicate()
        _stdoutput = _stdoutput.decode("Big5")
        _erroutput = _erroutput.decode("Big5")
        print('_stdoutput: ', _stdoutput)
        print('_erroutput: ', _erroutput)

if __name__ == "__main__":
    try:
        handlers = [[r'/', IndexHandler],
                    [r'/getPath', GetPathHandler],
                    [r'/submit', SubmitHandler],
                    [r'/favicon.ico', tornado.web.StaticFileHandler, {'path': './static/favicon.ico'}]]

        webApp = tornado.web.Application(
            handlers,
            template_path=os.path.join(os.path.dirname(__file__), 'templates'),
            static_path=os.path.join(os.path.dirname(__file__), "static"),
            debug=True
        )
        webApp.listen(8888)
        url = 'http://localhost:8888'
        webbrowser.open(url=url, new=0)

        print('Server open in: ' + url)
        tornado.ioloop.IOLoop.instance().start()

    except KeyboardInterrupt:
        print('再見！')
