from flask import Flask, jsonify, request, session, redirect, url_for, flash, render_template
from flask_cors import CORS
from werkzeug.security import check_password_hash

from db import (
    create_user,
    get_user_by_username,
    insert_article,
    get_all_articles,
    get_articles_by_user,
    get_articles_by_type,
    increase_like,
    count_articles_by_type,
    delete_article,
)

app = Flask(__name__)
CORS(app)

# ---------------- THÊM GHI CHÚ (WEB FORM) ----------------
@app.route("/notes/new", methods=["GET", "POST"])
def add():
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


#----------------------- Xóa ghi chú (WEB) ---------------------------------

@app.route("/api/articles/<int:code>", methods=["DELETE"])
def api_delete_article(code):
    # với web bạn có thể dùng session
    if "user_id" not in session:
        return jsonify({"error": "Chua dang nhap"}), 401

    user_id = session["user_id"]
    affected = delete_article(code, user_id)
    if affected == 0:
        return jsonify({"error": "Khong co quyen xoa"}), 403
    return jsonify({"message": "Da xoa"}), 200


# ---------------- CÁC TRANG DANH MỤC (WEB) ----------------
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


# ---- API ghi chú của user dựa trên session (dùng cho web trước) ----
@app.route("/api/my_note", methods=["GET"])
def api_my_note():
    if "user_id" not in session:
        return jsonify({"error": "Chua dang nhap"}), 401

    user_id = session["user_id"]
    articles = get_articles_by_user(user_id)
    counts = count_articles_by_type()
    return jsonify({"articles": articles, "counts": counts}), 200


# ---- API thêm bài ----
@app.route("/api/notes", methods=["POST"])
def api_add_note():
    """
    Body JSON:
    {
      "code": "...",
      "title": "...",
      "content": "...",
      "type_article": "hoctap" | "congviec" | "canhan" | "khac"
    }
    """
    if "user_id" not in session:
        return jsonify({"error": "Bạn cần đăng nhập để đăng bài"}), 401

    data = request.get_json() or {}
    code = data.get("code")
    title = data.get("title")
    content = data.get("content")
    note_type = data.get("type_article")
    user_id = session["user_id"]

    if not all([code, title, content, note_type]):
        return jsonify({"error": "Thiếu dữ liệu"}), 400

    insert_article(code, title, content, note_type, user_id)
    return jsonify({"message": "Đăng bài thành công"}), 201


# ================== CÁC API MỚI CHO MOBILE ==================

# --- Signup cho mobile ---
@app.route("/api/signup", methods=["POST"])
def api_signup():
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


# --- Login cho mobile ---
@app.route("/api/login", methods=["POST"])
def api_login():
    data = request.get_json() or {}
    username = data.get("username")
    password = data.get("password")

    if not all([username, password]):
        return jsonify({"message": "Vui lòng nhập đầy đủ thông tin"}), 400

    user = get_user_by_username(username)
    if not user or not check_password_hash(user["password_hash"], password):
        return jsonify({"message": "Sai tài khoản hoặc mật khẩu"}), 401

    return jsonify(
        {
            "message": "Đăng nhập thành công",
            "user": {
                "user_id": user["id"],
                "username": user["username"],
                "email": user["email"],
                "gender": user["gender"],
            },
        }
    ), 200


# --- API ghi chú cho mobile: truyền user_id từ app ---
@app.route("/api/my_note_mobile", methods=["GET"])
def api_my_note_mobile():
    user_id = request.args.get("user_id", type=int)
    if not user_id:
        return jsonify({"message": "Thiếu user_id"}), 400

    articles = get_articles_by_user(user_id)
    counts = count_articles_by_type()
    return jsonify({"articles": articles, "counts": counts}), 200


# --- API xóa ghi chú cho mobile (dùng user_id param) ---
@app.route("/api/mobile/articles/<int:code>", methods=["DELETE"])
def api_delete_article_mobile(code):
    user_id = request.args.get("user_id", type=int)
    if not user_id:
        return jsonify({"message": "Thiếu user_id"}), 400

    affected = delete_article(code, user_id)
    if affected == 0:
        return jsonify({"message": "Không có quyền xóa hoặc không tìm thấy"}), 403

    return jsonify({"message": "Đã xóa"}), 200


if __name__ == "__main__":
    app.run(debug=True)