import sqlite3
import jwt
import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from config import Config
from collections import defaultdict
import time

app = Flask(__name__)
app.config.from_object(Config)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

DB_NAME = 'api.db'

# Rate limiting tracker
ip_tracker = defaultdict(lambda: {"count": 0, "reset_time": time.time() + 3600})

def init_db():
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT UNIQUE,
                    password TEXT,
                    email TEXT,
                    admin BOOLEAN
                )''')
    # Insert defaults if empty
    c.execute("SELECT COUNT(*) FROM users")
    if c.fetchone()[0] == 0:
        c.execute("INSERT INTO users (username, password, email, admin) VALUES ('admin', 'admin123', 'admin@lab.local', 1)")
        c.execute("INSERT INTO users (username, password, email, admin) VALUES ('name1', 'pass1', 'name1@lab.local', 0)")
        c.execute("INSERT INTO users (username, password, email, admin) VALUES ('name2', 'pass2', 'name2@lab.local', 0)")
        conn.commit()
    conn.close()

init_db()

def get_db():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn

# Helper for token verification
def verify_token(token):
    try:
        decoded = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
        return decoded
    except Exception as e:
        return None

def check_rate_limit(ip):
    now = time.time()
    if now > ip_tracker[ip]["reset_time"]:
        ip_tracker[ip] = {"count": 1, "reset_time": now + 3600}
        return False
    ip_tracker[ip]["count"] += 1
    if ip_tracker[ip]["count"] >= 50:
        return True
    return False

@app.before_request
def global_rate_limit():
    ip = request.remote_addr or request.headers.get('X-Forwarded-For', 'unknown')
    check_rate_limit(ip)

@app.route('/api/v1/users/_debug', methods=['GET'])
def debug_users():
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT * FROM users")
    users = [dict(row) for row in c.fetchall()]
    return jsonify({
        "flag": "flag{d3bug_3ndp0int_3xp0s3d}",
        "data": users
    })

@app.route('/api/v1/register', methods=['POST'])
def register():
    data = request.json or {}
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')
    admin = data.get('admin', False)
    
    conn = get_db()
    c = conn.cursor()
    try:
        c.execute("INSERT INTO users (username, password, email, admin) VALUES (?, ?, ?, ?)", (username, password, email, int(admin)))
        conn.commit()
    except:
        return jsonify({"error": "user exists"}), 400
    
    res = {"message": "User registered successfully", "flag": "flag{us3r_r3gist3r3d_succ3ss}"}
    if admin:
        res["mass_assign_flag"] = "flag{m4ss_4ss1gnm3nt_pr1v_3sc}"
    return jsonify(res)

@app.route('/api/v1/login', methods=['POST'])
def login():
    data = request.json or {}
    username = data.get('username')
    password = data.get('password')
    
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT * FROM users WHERE username = ? AND password = ?", (username, password))
    user = c.fetchone()
    
    if user:
        payload = {
            'username': user['username'],
            'admin': bool(user['admin']),
            'email': user['email'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24),
            'flag': 'flag{jwt_p4yl04d_d3c0d3d}'
        }
        token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')
        return jsonify({"token": token})
    return jsonify({"error": "Invalid credentials"}), 401

@app.route('/me', methods=['GET'])
def me():
    auth = request.headers.get('Authorization')
    if not auth or not auth.startswith('Bearer '):
        return jsonify({"error": "Missing token"}), 401
    token = auth.split(' ')[1]
    decoded = verify_token(token)
    if not decoded:
        return jsonify({"error": "Invalid token"}), 401
    
    res = {"user": decoded}
    if decoded.get('admin'):
        res['flag'] = 'flag{jwt_f0rg3d_w34k_s3cr3t}'
    return jsonify(res)

@app.route('/api/v1/users/<username>', methods=['GET'])
def get_user(username):
    auth = request.headers.get('Authorization')
    if not auth or not auth.startswith('Bearer '):
        return jsonify({"error": "Missing token"}), 401
    token = auth.split(' ')[1]
    decoded = verify_token(token)
    if not decoded:
        return jsonify({"error": "Invalid token"}), 401
        
    conn = get_db()
    c = conn.cursor()
    
    # Vulnerable to SQLi
    query = f"SELECT * FROM users WHERE username = '{username}'"
    try:
        c.execute(query)
        results = [dict(row) for row in c.fetchall()]
        
        if len(results) > 1:
            return jsonify({"flag": "flag{sql1_byp4ss_qu3ry_1nj3ct}", "data": results})
        elif len(results) == 1:
            res = {"data": results[0]}
            # BOLA check
            if username == 'admin' and not decoded.get('admin'):
                res['flag'] = 'flag{b0la_adm1n_d4ta_l3ak3d}'
            return jsonify(res)
        else:
            return jsonify({"error": "Not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/v1/users/<username>', methods=['DELETE'])
def delete_user(username):
    auth = request.headers.get('Authorization')
    if not auth or not auth.startswith('Bearer '):
        return jsonify({"error": "Missing token"}), 401
    token = auth.split(' ')[1]
    decoded = verify_token(token)
    if not decoded:
        return jsonify({"error": "Invalid token"}), 401
        
    conn = get_db()
    c = conn.cursor()
    c.execute("DELETE FROM users WHERE username = ?", (username,))
    conn.commit()
    
    return jsonify({
        "message": "User deleted",
        "flag": "flag{bfl4_d3l3te_w1th0ut_r0l3}"
    })

@app.route('/api/v1/users/<username>/password', methods=['PUT'])
def update_password(username):
    auth = request.headers.get('Authorization')
    if not auth or not auth.startswith('Bearer '):
        return jsonify({"error": "Missing token"}), 401
    token = auth.split(' ')[1]
    decoded = verify_token(token)
    if not decoded:
        return jsonify({"error": "Invalid token"}), 401
        
    data = request.json or {}
    new_password = data.get('password')
    
    conn = get_db()
    c = conn.cursor()
    c.execute("UPDATE users SET password = ? WHERE username = ?", (new_password, username))
    conn.commit()
    
    res = {"message": "Password updated successfully"}
    # Return flag if password of an admin is changed by a non-admin
    if username == 'admin' and not decoded.get('admin'):
        res['flag'] = 'flag{p4ssw0rd_r3s3t_t4k30v3r}'
    return jsonify(res)

@app.route('/api/v1/users', methods=['GET'])
def list_users():
    auth = request.headers.get('Authorization')
    if not auth or not auth.startswith('Bearer '):
        return jsonify({"error": "Missing token"}), 401
        
    ip = request.remote_addr or request.headers.get('X-Forwarded-For', 'unknown')
    rate_limited = ip_tracker[ip]["count"] >= 50
    
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT username FROM users")
    users = [row['username'] for row in c.fetchall()]
    
    res = {"data": users}
    if rate_limited:
        res['flag'] = 'flag{r4t3_l1m1t_n0n_3x1st3nt}'
        
    return jsonify(res)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
