import mysql.connector
from werkzeug.security import generate_password_hash, check_password_hash

# =========================================================
# 1. KẾT NỐI CƠ SỞ DỮ LIỆU
# =========================================================
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="maigiabao2208",
        database="mxh"
    )

# =========================================================
# 2. HÀM LIÊN QUAN TỚI USER
# =========================================================
def create_user(email, username, password, gender):
    """
    Tạo user mới, password được hash, role mặc định là 'user'.
    """
    conn = get_db_connection()
    cur = conn.cursor()
    sql = """
        INSERT INTO users (email, username, password, gender, role)
        VALUES (%s, %s, %s, %s, %s)
    """
    cur.execute(sql, (email, username, generate_password_hash(password), gender, "user"))
    conn.commit()
    user_id = cur.lastrowid
    cur.close()
    conn.close()
    return user_id


def get_user_by_username(username):
    """
    Lấy user theo username, trả về dict hoặc None.
    """
    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)
    sql = "SELECT * FROM users WHERE username = %s"
    cur.execute(sql, (username,))
    row = cur.fetchone()
    cur.close()
    conn.close()
    return row


def get_user_by_id(user_id):
    """
    Lấy user theo user_id, trả về dict hoặc None.
    """
    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)
    sql = "SELECT * FROM users WHERE user_id = %s"
    cur.execute(sql, (user_id,))
    row = cur.fetchone()
    cur.close()
    conn.close()
    return row

# =========================================================
# 3. HÀM LIÊN QUAN TỚI ARTICLE / BÀI VIẾT
# =========================================================
def insert_article(title, content, type_article, user_id):
    """
    Thêm bài viết mới, để MySQL tự tăng code (INT AUTO_INCREMENT).
    """
    conn = get_db_connection()
    cur = conn.cursor()
    sql = """
        INSERT INTO article (title, content, time, type_article, luot_thich, user_id)
        VALUES (%s, %s, NOW(), %s, 0, %s)
    """
    cur.execute(sql, (title, content, type_article, user_id))
    conn.commit()
    cur.close()
    conn.close()


def get_all_articles():
    """
    Lấy tất cả bài viết (hiển thị ở trang chủ).
    """
    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)
    sql = """
        SELECT code, title, content, time, type_article, luot_thich
        FROM article
        ORDER BY time DESC
    """
    cur.execute(sql)
    articles = cur.fetchall()
    cur.close()
    conn.close()
    return articles


def get_articles_by_user(user_id):
    """
    Lấy tất cả bài viết của một user (dùng cho trang my_note).
    """
    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)
    sql = """
        SELECT code, title, content, time, type_article, luot_thich
        FROM article
        WHERE user_id = %s
        ORDER BY time DESC
    """
    cur.execute(sql, (user_id,))
    articles = cur.fetchall()
    cur.close()
    conn.close()
    return articles


def get_articles_by_type(type_article):
    """
    Lấy tất cả bài viết theo type_article (hoctap, congviec, canhan, khac).
    """
    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)
    sql = """
        SELECT code, title, content, time, type_article, luot_thich
        FROM article
        WHERE type_article = %s
        ORDER BY time DESC
    """
    cur.execute(sql, (type_article,))
    articles = cur.fetchall()
    cur.close()
    conn.close()
    return articles


def increase_like(article_code):
    """
    Tăng lượt thích cho một bài viết.
    """
    conn = get_db_connection()
    cur = conn.cursor()
    sql = "UPDATE article SET luot_thich = luot_thich + 1 WHERE code = %s"
    cur.execute(sql, (article_code,))
    conn.commit()
    cur.close()
    conn.close()

def decrease_like(article_code):
    conn = get_db_connection()
    cur = conn.cursor()
    sql = """
        UPDATE article
        SET luot_thich = GREATEST(luot_thich - 1, 0)
        WHERE code = %s
    """
    cur.execute(sql, (article_code,))
    conn.commit()
    cur.close()
    conn.close()


def count_articles_by_type():
    """
    Trả về dict: { 'hoctap': n1, 'congviec': n2, 'canhan': n3, 'khac': n4 }.
    """
    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)
    sql = """
        SELECT type_article, COUNT(*) AS total
        FROM article
        WHERE type_article IN ('hoctap', 'congviec', 'canhan', 'khac')
        GROUP BY type_article
    """
    cur.execute(sql)
    rows = cur.fetchall()
    cur.close()
    conn.close()

    counts = {'hoctap': 0, 'congviec': 0, 'canhan': 0, 'khac': 0}
    for r in rows:
        t = r['type_article']
        counts[t] = r['total']

    return counts


def delete_article(code, user_id):
    """
    Xóa bài viết theo code và user_id (chỉ xóa bài của chính user đó).
    Trả về số dòng bị ảnh hưởng.
    """
    conn = get_db_connection()
    cur = conn.cursor()
    sql = "DELETE FROM article WHERE code = %s AND user_id = %s"
    cur.execute(sql, (code, user_id))
    affected = cur.rowcount
    conn.commit()
    cur.close()
    conn.close()
    return affected