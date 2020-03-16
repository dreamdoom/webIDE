# -*- coding: utf-8 -*-
from flask import Blueprint, request
from shutil import copyfile
import subprocess
import time
import os


codes = Blueprint('codes', __name__)


# 获取某文件夹下所有文件的名称列表
def get_pro_list(file_dir):
    try:
        for i, j, k in os.walk(file_dir):
            return k
    except:
        return


def save_code_to_file(filename, code, uid, pro_name=None):
    temp = filename.split('.')
    if temp[1] == 'py':
        temp[1] = 'python'
    if temp[1] == 'java':
        filepath = 'directories/{}/java/{}/{}'.format(uid, pro_name, filename)
    else:
        filepath = 'directories/{}/{}/{}'.format(uid, temp[1], filename)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(code)


# 保存代码
@codes.route('/saveCode.html', methods=['POST', 'GET'])
def saveCode():
    uid = request.form.get('uid')
    time.sleep(0.3)
    code = request.form.get('code')
    pro_name = request.form.get('proName')
    filename = request.form.get('filename').strip()
    if pro_name:
        save_code_to_file(filename, code, uid, pro_name)
    else:
        save_code_to_file(filename, code, uid)
    return ''


# 运行代码
@codes.route('/runCode.html', methods=['POST', 'GET'])
def run():
    uid = request.form.get('uid')
    code = request.form.get('code')
    filename = request.form.get('filename').strip()
    pro_name = request.form.get('proName')
    temp = filename.split('.')
    if temp[1] == 'py':
        temp[1] = 'python'
    if pro_name:
        save_code_to_file(filename, code, uid, pro_name)
    else:
        save_code_to_file(filename, code, uid)
    filepath = 'directories/{}/{}/{}'.format(uid, temp[1], filename)

    if temp[1] == 'python':      # Python文件
        p = subprocess.Popen('python ' + filepath, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
        res = p.stdout.read().decode('utf-8')
    elif temp[1] == 'java':     # Java文件
        # 1.将目标java文件所属的项目下所有的文件全部拷贝到项目根目录，以便对java文件的编译运行
        path = 'directories/{}/java/{}'.format(uid, pro_name)
        java_file = get_pro_list(path)
        for file in java_file:
            copyfile(path + '/' + file, file)
        command = 'javac ' + filename
        os.system(command)
        p = subprocess.Popen('java ' + temp[0], stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
        res = p.stdout.read().decode('utf-8')
        try:
            copy_files = get_pro_list('./')
            for each in copy_files:
                if each.split('.')[1] == 'java' or each.split('.')[1] == 'class':
                    os.remove(each)
        except:
            return ''
    else:       # C文件
        time.sleep(0.2)
        try:
            os.system('gcc ' + filepath + ' -o ' + 'directories/' + uid + '/c/' + temp[0] + '.exe')
            p = subprocess.Popen('./directories/' + uid + '/c/' + temp[0] + '.exe', stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
            res = p.stdout.read().decode('utf-8')
        except:
            res = ''
    return res


