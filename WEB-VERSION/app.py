from flask import Flask, jsonify, request, session, redirect, url_for, flash, render_template
from flask_cors import CORS
from werkzeug.security import check_password_hash
from functools import wraps
import jwt
import datetime
from db import (
    create_user,
    get_user_by_username,
    insert_article,
    get_all_articles,
    get_articles_by_user,
    get_articles_by_type,
    increase_like,          # hiện chưa dùng nhưng giữ lại
    count_articles_by_type,
    delete_article,
    get_user_by_id,
    decrease_like,
    get_article_by_code,
    update_article,
    search_articles,
)

# =========================================================
# 1. CẤU HÌNH APP & CORS
# =========================================================
app = Flask(__name__)
CORS(
    app,
    resources={r"/api/*": {"origins": "*"}},  # CORS áp dụng cho tất cả route /api/*
    origins=["http://localhost:8081", "http://127.0.0.1:8081"],
    supports_credentials=True,
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"]
)
app.config["SECRET_KEY"] = "maigiabao_bi_mat2026"
app.secret_key = "maigiabao_bi_mat2026"

# =========================================================
# 2. MIDDLEWARE / TIỆN ÍCH CHUNG
# =========================================================
def token_required(f):
    """Middleware kiểm tra JWT cho các API mobile."""
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.headers.get("Authorization")
        if not auth or not auth.startswith("Bearer "):
            return jsonify({"message": "No token"}), 401
        token = auth.split(" ")[1]
        try:
            data = jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])
        except Exception:
            return jsonify({"message": "Token không hợp lệ"}), 401
        # Gắn user_id vào request để dùng trong route
        request.user_id = data["user_id"]
        return f(*args, **kwargs)
    return decorated

# =========================================================
# 3. ROUTES WEB: GHI CHÚ (FORM, TRANG HTML)
# =========================================================
@app.route("/notes/new", methods=["GET", "POST"])
def add():
    """Thêm ghi chú qua web form."""
    if request.method == "POST":
        code = request.form.get("code")
        title = request.form.get("title")
        content = request.form.get("content")
        note_type = request.form.get("type_article")
        user_id = session.get("user_id")

        if not user_id:
            flash("Bạn cần đăng nhập để đăng bài")
            return redirect(url_for("login"))

        if not all([code, title, content, note_type]):
            flash("Vui lòng nhập đầy đủ thông tin")
            return redirect(url_for("add"))

        insert_article(code, title, content, note_type, user_id)
        flash("Đăng bài thành công")
        return redirect(url_for("home"))

    return render_template("add.html")



# =========================================================
# 4. ROUTES WEB: CÁC TRANG DANH MỤC (HTML)
# =========================================================
@app.route("/hoctap")
def hoctap():
    articles = get_articles_by_type("hoctap")
    counts = count_articles_by_type()
    return render_template("hoctap.html", articles=articles, counts=counts)


@app.route("/congviec")
def congviec():
    articles = get_articles_by_type("congviec")
    counts = count_articles_by_type()
    return render_template("congviec.html", articles=articles, counts=counts)


@app.route("/canhan")
def canhan():
    articles = get_articles_by_type("canhan")
    counts = count_articles_by_type()
    return render_template("canhan.html", articles=articles, counts=counts)


@app.route("/khac")
def khac():
    articles = get_articles_by_type("khac")
    counts = count_articles_by_type()
    return render_template("khac.html", articles=articles, counts=counts)

# =========================================================
# 5. API CHUNG (WEB + MOBILE): HOME & DANH MỤC
# =========================================================
@app.route("/api/home", methods=["GET"])
def api_home():
    articles = get_all_articles()
    counts = count_articles_by_type()
    return jsonify({"articles": articles, "counts": counts}), 200


@app.route("/api/hoctap")
def hoctap_api():
    articles = get_articles_by_type("hoctap")
    counts = count_articles_by_type()
    return jsonify({"articles": articles, "counts": counts})


@app.route("/api/congviec")
def congviec_api():
    articles = get_articles_by_type("congviec")
    counts = count_articles_by_type()
    return jsonify({"articles": articles, "counts": counts})


@app.route("/api/canhan")
def canhan_api():
    articles = get_articles_by_type("canhan")
    counts = count_articles_by_type()
    return jsonify({"articles": articles, "counts": counts})


@app.route("/api/khac")
def khac_api():
    articles = get_articles_by_type("khac")
    counts = count_articles_by_type()
    return jsonify({"articles": articles, "counts": counts})

# =========================================================
# 6. API MOBILE: GHI CHÚ (CẦN TOKEN)
# =========================================================
@app.route("/api/my_note_mobile", methods=["GET"])
@token_required
def api_my_note_mobile():
    """Lấy ghi chú của chính user (mobile, dùng token)."""
    user_id = request.user_id
    articles = get_articles_by_user(user_id)
    counts = count_articles_by_type()
    return jsonify({"articles": articles, "counts": counts}), 200


@app.route("/api/article/code/<int:code>", methods=["GET"])
def get_article_by_code_api(code):

    try:
        article = get_article_by_code(code)
        print(f"[DEBUG] Kết quả query: {article}")  # Log kết quả

        if not article:
            return jsonify({"error": "Không tìm thấy bài viết", "code": code}), 404

        return jsonify(article), 200

    except Exception as e:
        print(f"[ERROR] Lỗi: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route("/api/notes", methods=["POST"])
@token_required
def api_add_note():
    """Thêm ghi chú qua mobile (dùng token)."""
    data = request.get_json() or {}
    title = data.get("title")
    content = data.get("content")
    note_type = data.get("type_article")
    user_id = request.user_id

    if not all([title, content, note_type]):
        return jsonify({"error": "Thiếu dữ liệu"}), 400

    # Lưu ý: DB insert_article hiện nhận tham số (code/title, content, type, user_id)
    insert_article(title, content, note_type, user_id)
    return jsonify({"message": "Đăng bài thành công"}), 201


@app.route("/api/mobile/articles/<int:code>", methods=["DELETE"])
def api_delete_article_mobile(code):
    print(f"[DELETE] === BẮT ĐẦU ===")
    print(f"[DELETE] Code: {code}")
    
    user_id = request.args.get("user_id", type=int)
    print(f"[DELETE] user_id từ query param: {user_id}")

    if not user_id:
        print("[DELETE] ❌ Thiếu user_id")
        return jsonify({"message": "Thiếu user_id"}), 400

    affected = delete_article(code, user_id)
    print(f"[DELETE] Số dòng bị xóa: {affected}")

    if affected == 0:
        print("[DELETE] ❌ Không xóa được (không tìm thấy hoặc không phải owner)")
        return jsonify({"message": "Không có quyền xóa hoặc bài viết không tồn tại"}), 403

    print("[DELETE] ✅ Xóa thành công")
    return jsonify({"message": "Đã xóa ghi chú thành công"}), 200

# ---------- ROUTE EDIT NOTE CHO MOBILE (đã chuyển vào /api) ----------
@app.route("/api/notes/<int:code>/edit", methods=["GET", "POST"])
def edit_note(code):
    """
    API cho mobile:
    - GET  /api/notes/<code>/edit  : trả về dữ liệu ghi chú
    - POST /api/notes/<code>/edit  : cập nhật ghi chú
    """
    # Lấy note hiện tại
    article = get_article_by_code(code)
    if not article:
        return jsonify({"error": "Không tìm thấy ghi chú"}), 404

    # ----- GET: trả dữ liệu cho màn edit -----
    if request.method == "GET":
        return jsonify({
            "code":         article["code"],
            "title":        article["title"],
            "content":      article["content"],
            "type_article": article["type_article"],
            "time":         article.get("time")
        }), 200

    # ----- POST: nhận dữ liệu cập nhật -----
    title     = request.form.get("title")
    content   = request.form.get("content")
    note_type = request.form.get("type_article")

    if not all([title, content, note_type]):
        return jsonify({"error": "Thiếu dữ liệu"}), 400

    # Cập nhật DB
    update_article(code, title, content, note_type)

    return jsonify({"message": "Cập nhật ghi chú thành công"}), 200

# =========================================================
# 7. API MOBILE: AUTH (SIGNUP, LOGIN, PROFILE)
# =========================================================
@app.route("/api/signup", methods=["POST"])
def api_signup():
    """Đăng ký tài khoản cho mobile."""
    data = request.get_json() or {}
    email = data.get("email")
    username = data.get("username")
    password = data.get("password")
    gender = data.get("gender", "")

    if not all([email, username, password]):
        return jsonify({"message": "Vui lòng nhập đầy đủ thông tin"}), 400

    if get_user_by_username(username):
        return jsonify({"message": "Tên đăng nhập đã tồn tại"}), 409

    user_id = create_user(email, username, password, gender)
    return jsonify({"message": "Đăng ký thành công", "user_id": user_id}), 201


@app.route("/api/login", methods=["POST"])
def api_login():
    """Đăng nhập mobile, trả về JWT token."""
    data = request.get_json() or {}
    username = data.get("username")
    password = data.get("password")

    if not all([username, password]):
        return jsonify({"message": "Vui lòng nhập đầy đủ thông tin"}), 400

    user = get_user_by_username(username)
    if not user or not check_password_hash(user["password"], password):
        return jsonify({"message": "Sai tài khoản hoặc mật khẩu"}), 401

    token = jwt.encode(
        {
            "user_id": user["user_id"],
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=2),
        },
        app.config["SECRET_KEY"],
        algorithm="HS256",
    )

    return jsonify(
        {
            "message": "Đăng nhập thành công",
            "token": token,
            "user": {
                "user_id": user["user_id"],
                "username": user["username"],
                "email": user["email"],
                "gender": user["gender"],
                "role": user["role"],
            },
        }
    ), 200


@app.route("/api/profile", methods=["GET"])
@token_required
def api_profile():
    """Lấy thông tin profile user (mobile, dùng token)."""
    user_id = request.user_id
    user = get_user_by_id(user_id)
    if not user:
        return jsonify({"message": "Không tìm thấy user"}), 404

    return jsonify(
        {
            "user_id": user["user_id"],
            "username": user["username"],
            "email": user["email"],
            "gender": user["gender"],
        }
    ), 200

#==========================================================
# TIM
#==========================================================
@app.route("/api/articles/<int:code>/like", methods=["POST"])
def api_like_article(code):
    increase_like(code)
    return jsonify({"message": "liked"}), 200


@app.route("/api/articles/<int:code>/unlike", methods=["POST"])
def api_unlike_article(code):
    decrease_like(code)
    return jsonify({"message": "unliked"}), 200

# =========================================================
# API SEARCH (WEB + MOBILE)
# =========================================================
@app.route("/api/search", methods=["GET"])
def api_search():
    keyword = request.args.get("q", "").strip()
    if keyword == "":
        articles = get_all_articles()
    else:
        articles = search_articles(keyword)
    counts = count_articles_by_type()
    return jsonify({"articles": articles, "counts": counts}), 200

# =========================================================
# 8. MAIN
# =========================================================
if __name__ == "__main__":
    app.run(debug=True, port=5000)