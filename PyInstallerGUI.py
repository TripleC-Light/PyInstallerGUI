import tornado.ioloop
import tornado.web
import os
import subprocess
from tkinter import *
from tkinter import filedialog

class IndexHandler(tornado.web.RequestHandler):
    def get(self):
        # scriptsPath = sys.executable
        # pyinstallerPath = scriptsPath.replace('python.exe', 'scripts\\pyinstaller')
        # print(pyinstallerPath)
        #
        # tkCase = 0
        # tk = Tk()
        # tk.withdraw()
        # tk.lift()
        # tk.attributes("-topmost", True)
        # if tkCase == 0:
        #     file_path = filedialog.askopenfilename()    # 取得檔案名
        # elif tkCase == 1:
        #     file_path = filedialog.askdirectory()       # 取得路徑
        # elif tkCase == 2:
        #     file_path = filedialog.askopenfilenames()   # 取得多檔案路徑
        #     for f in file_path:
        #         print(f)
        # tk.destroy()
        # print(file_path)
        #
        # dirPath = file_path.split('/')
        # tmp = ''
        # for i in range(0, len(dirPath)-1):
        #     tmp = tmp + dirPath[i] + '/'
        # dirPath = tmp + 'PyInstaller/dist'
        # buildPath = tmp + 'PyInstaller/build'
        # specPath = tmp + 'PyInstaller'
        # print(dirPath)
        #
        # p = subprocess.Popen([pyinstallerPath, file_path, '-F', '--clean', '--distpath=' + dirPath, '--workpath=' + buildPath, '--specpath=' + specPath], shell=True, creationflags=0x08, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        #
        # _stdoutput, _erroutput = p.communicate()
        # _stdoutput = _stdoutput.decode("Big5")
        # _erroutput = _erroutput.decode("Big5")
        # print('_stdoutput: ', _stdoutput)
        # print('_erroutput: ', _erroutput)
        self.render('index.html')

class GetPathHandler(tornado.web.RequestHandler):
    def get(self):
        CMD = self.get_argument('cmd')
        print(CMD)
        tkCase = 0
        resultData = {}
        file_path = []
        if CMD == 'getMainPath':
            tkCase = 0
        elif CMD == 'getDataPath':
            tkCase = 2
        elif CMD == 'getMainPath':
            tkCase = 2

        tk = Tk()
        tk.withdraw()
        tk.lift()
        tk.attributes("-topmost", True)
        if tkCase == 0:
            file_path.append(filedialog.askopenfilename(title='Select python file', filetypes=[('.py', '*.py')]))    # 取得檔案名
        elif tkCase == 1:
            file_path.append(filedialog.askdirectory())     # 取得路徑
        elif tkCase == 2:
            file_path = filedialog.askopenfilenames()   # 取得多檔案路徑

        tk.destroy()
        print(file_path)
        resultData['path'] = file_path
        self.write(resultData)

if __name__ == "__main__":
    try:
        handlers = [[r'/', IndexHandler],
                    [r'/getPath', GetPathHandler],
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
