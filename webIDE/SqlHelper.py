import pymysql


class SqlHelper(object):
    def __init__(self):
        self.conn = pymysql.connect(host='localhost', user='root', password='123321',
                                    port=3306, db='webide', charset='utf8')
        self.cursor = self.conn.cursor(cursor=pymysql.cursors.DictCursor)

    def get_one(self, sql):
        self.cursor.execute(sql)
        return self.cursor.fetchone()

    def get_list(self, sql):
        self.cursor.execute(sql)
        return self.cursor.fetchall()

    def modify(self, sql):
        self.cursor.execute(sql)
        self.conn.commit()

    def get_last_row_id(self, sql):
        self.cursor.execute(sql)
        self.conn.commit()
        return self.cursor.lastrowid

    def close(self):
        self.conn.close()
        self.cursor.close()
