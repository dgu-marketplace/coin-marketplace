from flask import Flask, render_template, request, url_for, redirect, jsonify, session
from flask_pymongo import PyMongo
from flask import flash
from flask import Flask, render_template, request, url_for, redirect, jsonify, session, flash

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/myDatabase"  # 데이터베이스 URI
app.secret_key = 'dgusoftwareengineeringverysecretkey'
mongo = PyMongo(app)

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        users = mongo.db.users
        existing_user = users.find_one({'name': request.form['username']})

        if existing_user is None:
            users.insert_one({'name': request.form['username'], 'password': request.form['password'], 'password_hint': request.form['password_hint']})
            return jsonify({'success': True, 'redirect_url': url_for('home')})

        return jsonify({'success': False, 'error_msg': "이미 존재하는 사용자입니다."})

    return render_template('signup.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        users = mongo.db.users
        login_user = users.find_one({'name': request.form['username']})

        if login_user and request.form['password'] == login_user['password']:
            session['username'] = login_user['name']
            return jsonify({'success': True, 'redirect_url': url_for('home')})

        return jsonify({'success': False, 'error_msg': '로그인 실패! 아이디 또는 비밀번호가 잘못되었습니다.'})

    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('home'))

@app.route('/search_password', methods=['GET', 'POST'])
def search_password():
    if request.method == 'POST':
        users = mongo.db.users
        existing_user = users.find_one({'name': request.form['username']})

        if existing_user is None:
            flash('사용자를 찾을 수 없습니다.')
            return redirect(url_for('search_password'))

        flash('비밀번호 힌트: ' + existing_user['password_hint'])
        return redirect(url_for('search_password'))

    return render_template('search_password.html')
