# -*- coding: utf-8 -*-
import os
from datetime import timedelta
from flask import Flask, render_template, request
from webIDE.SqlHelper import SqlHelper
from webIDE.user import user
from webIDE.save_and_run import codes
from webIDE.search_file import files
from webIDE.delete_file import delete


app = Flask(__name__)
app.register_blueprint(user)
app.register_blueprint(files)
app.register_blueprint(delete)
app.register_blueprint(codes)


app.send_file_max_age_default = timedelta(seconds=1)


# 获取某文件夹下所有文件的名称列表
def get_pro_list(file_dir):
    try:
        for i, j, k in os.walk(file_dir):
            return k
    except:
        return


@app.route('/')
def default():
    return render_template('login.html')


@app.route('/index.html', methods=['POST', 'GET'])
def index():
    uid = request.args.get('uid', '')
    obj = SqlHelper()
    sql = "select * from user where id = " + uid
    res = obj.get_one(sql)
    if res:
        return render_template('index.html')
    else:
        return render_template('error.html')


# 新建文件
@app.route('/addFile.html')
def add_file():
    uid = request.args.get('uid')
    filename = request.args.get('fileName')
    file_dir = filename.split('.')[1]
    if file_dir == 'py':
        file_dir = 'python'
    if os.path.exists('directories/{}/{}/{}'.format(uid, file_dir, filename)):
        return '0'
    else:
        f = open('directories/{}/{}/{}'.format(uid, file_dir, filename), 'w', encoding='utf-8')
        f.close()
        return '1'


# 创建java文件
@app.route('/addJavaFile.html')
def add_java_file():
    uid = request.args.get('uid')
    pro_path = request.args.get('proPath')
    filename = request.args.get('javaFileName')
    filepath = 'directories/{}/java/{}/{}'.format(uid, pro_path, filename)
    if os.path.exists(filepath):
        return ''
    else:
        f = open(filepath, 'w', encoding='utf-8')
        f.close()
        return '1'


# 新建项目
@app.route('/addJavaPro.html')
def add_java_pro():
    uid = request.args.get('uid')
    proName = request.args.get('proName')
    try:
        os.mkdir('directories/{}/java/{}'.format(uid, proName))
        return '1'
    except FileExistsError:
        return ''


# 获取文件代码渲染到页面(python or c)
@app.route('/getFileCode.html')
def get_file_code():
    uid = request.args.get('uid')
    filename = request.args.get('filename').strip()
    file_dir = filename.split('.')[1]
    if file_dir == 'py':
        file_dir = 'python'
    filepath = 'directories/{}/{}/{}'.format(uid, file_dir, filename)
    if not os.path.exists(filepath):
        f = open(filepath, 'w', encoding='utf-8')
        f.close()
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()
        return text


# 获取java文件代码渲染到页面
@app.route('/getJavaFileCode.html')
def get_java_file_code():
    uid = request.args.get('uid')
    filename = request.args.get('filename')
    filepath = 'directories/{}/java/{}'.format(uid, filename)
    if not os.path.exists(filepath):
        f = open(filepath, 'w', encoding='utf-8')
        f.close()
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()
        return text


if __name__ == '__main__':
    app.run(debug=True)
