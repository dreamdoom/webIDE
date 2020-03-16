# -*- coding: utf-8 -*-
from flask import Blueprint, request
import os


delete = Blueprint('delete', __name__)


# 删除python和c文件
@delete.route('/delFile.html')
def del_file():
    filename = request.args.get('filename')
    file_dir = filename.split('.')[1]
    uid = request.args.get('uid')
    if file_dir == 'py':
        file_dir = 'python'
    filepath = 'directories/{}/{}/{}'.format(uid, file_dir, filename)
    os.remove(filepath)
    return ''

# 删除java文件
@delete.route('/delJavaFile.html')
def del_java_file():
    filepath = request.args.get('filePath')
    uid = request.args.get('uid')
    os.remove('directories/{}/java/{}'.format(uid, filepath))
    return ''

# 删除java项目
@delete.route('/delJavaPro.html')
def del_java_pro():
    uid = request.args.get('uid')
    pro_name = request.args.get('proName')
    os.removedirs('directories/{}/java/{}'.format(uid, pro_name))
    return ''
