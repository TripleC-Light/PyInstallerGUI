import tornado.ioloop
import tornado.web
from tornado.escape import json_decode
import os
import subprocess
from tkinter import *
from tkinter import filedialog

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

        tk = Tk()
        tk.withdraw()
        tk.lift()
        tk.attributes("-topmost", True)
        if tkCase == 0:
            file_path.append(filedialog.askopenfilename(title='Select python file', filetypes=[('.py', '*.py')]))       # 取得檔案名
        elif tkCase == 1:
            file_path.append(filedialog.askopenfilename(title='Select a file'))                                         # 取得檔案名
        elif tkCase == 2:
            file_path.append(filedialog.askdirectory(title='Select a Folder'))                                          # 取得資料夾路徑

        tk.destroy()
        print(file_path)
        resultData['path'] = file_path
        self.write(resultData)


class SubmitHandler(tornado.web.RequestHandler):
    def get(self):
        print('----------------------------------------------------------------')
        jsonData = json_decode(self.get_argument('data'))
        print(jsonData)
        mainPath = jsonData['mainPath']
        dataPathList = jsonData['dataPathList']
        folderPathList = jsonData['folderPathList']

        scriptsPath = sys.executable
        pyinstallerPath = scriptsPath.replace('python.exe', 'scripts\\pyinstaller')
        print(pyinstallerPath)

        file_path = mainPath
        print(file_path)

        distPath = file_path.split('/')
        tmp = ''
        for i in range(0, len(distPath)-1):
            tmp = tmp + distPath[i] + '/'
        distPath = tmp + 'PyInstaller/dist'
        buildPath = tmp + 'PyInstaller/build'
        specPath = tmp + 'PyInstaller'

        p = subprocess.Popen([pyinstallerPath, file_path, '-F', '--clean', '--distpath=' + distPath, '--workpath=' + buildPath, '--specpath=' + specPath], shell=True, creationflags=0x08, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        _stdoutput, _erroutput = p.communicate()
        _stdoutput = _stdoutput.decode("Big5")
        _erroutput = _erroutput.decode("Big5")
        print('_stdoutput: ', _stdoutput)
        print('_erroutput: ', _erroutput)

        for folderPath in folderPathList:
            folderName = folderPath.split('/')
            folderName = folderName[len(folderName)-1]
            newFolder = tmp + 'PyInstaller/dist/' + folderName
            subprocess.Popen(['md', newFolder], shell=True, creationflags=0x08, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            subprocess.Popen(['xcopy', folderPath, newFolder, '/e', '/s'], shell=True, creationflags=0x08, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

        for dataPath in dataPathList:
            dataPath = dataPath.replace('/', '\\')
            distPath = distPath.replace('/', '\\')
            subprocess.Popen(['copy', dataPath, distPath], shell=True, creationflags=0x08, stdout=subprocess.PIPE, stderr=subprocess.PIPE)


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
        # webbrowser.open(url=url, new=0)
        print('Server open in: ' + url)
        tornado.ioloop.IOLoop.instance().start()

    except KeyboardInterrupt:
        print('再見！')
