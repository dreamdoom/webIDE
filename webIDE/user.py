# -*- coding: utf-8 -*-
from flask import Blueprint, request, render_template
from webIDE.SqlHelper import SqlHelper
import os


user = Blueprint('user', __name__)


# 用户登录
@user.route('/login.html', methods=['POST', 'GET'])
def login():
    if request.method == 'GET':
        return render_template('login.html')
    else:
        username = request.form.get('username')
        pwd = request.form.get('password')
        obj = SqlHelper()
        sql = 'select id from user where username = "{}" and password = "{}"'.format(username, pwd)
        res = obj.get_one(sql)
        obj.close()
        if res:
            return str(res['id'])
        else:
            return ''


# 用户注册
@user.route('/register.html', methods=['POST', 'GET'])
def register():
    username = request.form.get('username')
    pwd = request.form.get('password')
    obj = SqlHelper()
    sql = 'select id from user where username = "{}"'.format(username)
    if obj.get_one(sql):       # 注册的账号已经存在，不可重复注册
        return ''
    else:               # 账号有效，将新的用户插入用户表
        sql = 'insert into user(username, password) values("{}", "{}")'.format(username, pwd)
        uid = obj.get_last_row_id(sql)
        if not os.path.exists('directories'):
            os.mkdir('directories')
        os.mkdir('directories/{}'.format(uid))
        os.mkdir('directories/{}/python'.format(uid))
        os.mkdir('directories/{}/java'.format(uid))
        os.mkdir('directories/{}/c'.format(uid))
        return str(uid)



