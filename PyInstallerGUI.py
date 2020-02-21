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

class GetLanguagePackHandler(tornado.web.RequestHandler):
    def get(self):
        lang = self.get_argument('lang')
        with open('./static/language/' + lang + '.lang', 'r', encoding='utf8') as f:
            langPack = f.read()
        self.write(langPack)

class GetPathHandler(tornado.web.RequestHandler):
    def get(self):
        CMD = self.get_argument('cmd')
        tkCase = 0
        resultData = {}
        file_path = []
        CMD = CMD.split('_')[0]
        if CMD == 'iMainPath' or CMD == 'iImportPath':
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
            iconPic = Image.open(file_path[0])
            iconName = file_path[0].split('/')
            iconName = iconName[len(iconName)-1]
            iconPic.save('./static/tmp/' + iconName)

        tk.destroy()
        resultData['path'] = file_path
        self.write(resultData)

class SubmitHandler(tornado.web.RequestHandler):
    def get(self):
        print('**--**')
        CMDlist = []
        jsonData = json_decode(self.get_argument('data'))
        print("* JSON Data from Web: ", jsonData)

        fileName = jsonData['fileName']
        folderName = jsonData['folderName']
        optionList = jsonData['optionList']
        mainPath = jsonData['mainPath']
        importPathList = jsonData['importPathList']
        dataPathList = jsonData['dataPathList']
        folderPathList = jsonData['folderPathList']
        iconPath = jsonData['iconPath']

        self._addPyinstallerPath(CMDlist)
        self._addMainPath(CMDlist, mainPath)

        if folderName == '':
            folderName = 'PyInstaller'
        userAPPfolder = os.path.split(mainPath)[0] + '/'
        distPath = userAPPfolder + folderName + '/dist'
        buildPath = userAPPfolder + folderName + '/build'
        specPath = userAPPfolder + folderName

        self._addImportPath(CMDlist, importPathList)
        self._addOption(CMDlist, optionList)
        self._addFixPath(CMDlist, [distPath, buildPath, specPath])
        self._addFileName(CMDlist, fileName)
        self._addIconPath(CMDlist, iconPath)
        self._exePyinstaller(CMDlist)
        self._copyFolder(folderPathList, distPath)
        self._copyData(dataPathList, distPath)
        self._deleteTmpData()
        print('**--**')

    def _addPyinstallerPath(self, CMDlist):
        pyinstallerPath = os.path.split(os.path.realpath(__file__))[0] + '\\static\\pyinstaller'
        CMDlist.append(pyinstallerPath)
        print('* PyinstallerPath >>', pyinstallerPath)

    def _addMainPath(self, CMDlist, mainPath):
        CMDlist.append(mainPath)
        print('* mainPath >>', mainPath)

    def _addImportPath(self, CMDlist, importPathList):
        for importPath in importPathList:
            CMDlist.append('--hiddenimport=' + importPath)

    def _addOption(self, CMDlist, optionList):
        for option in optionList:
            if option != '':
                CMDlist.append(option)

    def _addFixPath(self, CMDlist, fixPath):
        CMDlist.append('--distpath=' + fixPath[0])
        CMDlist.append('--workpath=' + fixPath[1])
        CMDlist.append('--specpath=' + fixPath[2])

    def _addFileName(self, CMDlist, fileName):
        if fileName != '':
            CMDlist.append('--name=' + fileName)

    def _addIconPath(self, CMDlist, iconPath):
        if iconPath != '':
            iconPath = iconPath.replace('/', '\\')
            CMDlist.append('--icon=' + iconPath)

    def _deleteTmpData(self):
        tmpPath = os.path.split(os.path.realpath(__file__))[0] + '\\static\\tmp\\*.*'
        print('* tmpPath >>', tmpPath)
        p = subprocess.Popen(['del', '/Q', tmpPath], shell=True, creationflags=0x08, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        _stdoutput, _erroutput = p.communicate()
        _stdoutput = _stdoutput.decode("Big5")
        _erroutput = _erroutput.decode("Big5")
        if _stdoutput != "" or _erroutput != "":
            print('_stdoutput:', _stdoutput)
            print('_erroutput:', _erroutput)

    def _copyFolder(self, folderPathList, distPath):
        for userFolderPath in folderPathList:
            userFolderName = userFolderPath.split('/')
            userFolderName = userFolderName[len(userFolderName)-1]
            newFolder = distPath + '/' + userFolderName
            subprocess.Popen(['md', newFolder], shell=True, creationflags=0x08, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            subprocess.Popen(['xcopy', userFolderPath, newFolder, '/e', '/s'], shell=True, creationflags=0x08, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    def _copyData(self, dataPathList, distPath):
        for dataPath in dataPathList:
            dataPath = dataPath.replace('/', '\\')
            distPath = distPath.replace('/', '\\')
            subprocess.Popen(['copy', dataPath, distPath], shell=True, creationflags=0x08, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    def _exePyinstaller(self, CMDlist):
        print('* CMDlist >>', CMDlist)
        p = subprocess.Popen(CMDlist, shell=True, creationflags=0x08, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        _stdoutput, _erroutput = p.communicate()
        _stdoutput = _stdoutput.decode("Big5")
        _erroutput = _erroutput.decode("Big5")
        if _stdoutput != "" or _erroutput != "":
            print('_stdoutput:', _stdoutput)
            print('_erroutput:', _erroutput)

if __name__ == "__main__":
    try:
        handlers = [[r'/', IndexHandler],
                    [r'/getPath', GetPathHandler],
                    [r'/submit', SubmitHandler],
                    [r'/getLanguagePack', GetLanguagePackHandler],
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
