# -*- coding: utf-8 -*-
from flask import Blueprint, request
import json
import os


files = Blueprint('files', __name__)


# 获取某文件夹下所有文件的名称列表
def get_pro_list(file_dir):
    try:
        for i, j, k in os.walk(file_dir):
            return k
    except:
        return


@files.route('/getCFile.html')
def get_c_file():
    uid = request.args.get('uid')
    sub_dirs = get_pro_list('directories/' + uid + '/c')
    return json.dumps([file for file in sub_dirs if file.split('.')[1] == 'c'])


# 获取用户工作空间java项目
@files.route('/getJavaPro.html')
def get_java_pro():
    uid = request.args.get('uid')
    for i, j, k in os.walk('directories/{}/java'.format(uid)):
        return json.dumps(j)


# 获取用户某java项目下的所有java文件
@files.route('/getJavaFile.html')
def get_java_file():
    uid = request.args.get('uid')
    proName = request.args.get('proName').strip()
    sub_dirs = get_pro_list('directories/{}/java/{}'.format(uid, proName))
    return json.dumps([file for file in sub_dirs if file.split('.')[1] == 'java'])


@files.route('/getPythonFile.html')
def get_python_file():
    uid = request.args.get('uid')
    sub_dirs = get_pro_list('directories/' + uid + '/python')
    return json.dumps([file for file in sub_dirs if file.split('.')[1] == 'py'])
