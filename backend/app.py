from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from datetime import datetime
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

posts = []

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                             'favicon.ico', mimetype='image/vnd.microsoft.icon')

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        'message': 'Welcome to the Blog API',
        'endpoints': {
            'GET /posts': 'Get all posts',
            'GET /posts/<id>': 'Get a specific post',
            'POST /posts': 'Create a new post',
            'PUT /posts/<id>': 'Update a post',
            'DELETE /posts/<id>': 'Delete a post'
        }
    })

@app.route('/posts', methods=['GET', 'POST'])
def handle_posts():
    if request.method == 'POST':
        try:
            data = request.get_json()
            if not data:
                return jsonify({'error': 'No data provided'}), 400
            if 'title' not in data or not data['title'].strip():
                return jsonify({'error': 'Title is required'}), 400
            if 'content' not in data or not data['content'].strip():
                return jsonify({'error': 'Content is required'}), 400
                
            new_post = {
                'id': len(posts) + 1,
                'title': data['title'].strip(),
                'content': data['content'].strip(),
                'created_at': datetime.now().isoformat(),
                'updated_at': datetime.now().isoformat()
            }
            posts.append(new_post)
            return jsonify({'message': 'Post created', 'post': new_post}), 201
        except Exception as e:
            return jsonify({'error': str(e)}), 500
            
    # GET all posts
    return jsonify({'posts': posts}), 200

@app.route('/posts/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def handle_post(id):
    try:
        post = next((p for p in posts if p['id'] == id), None)
        if not post:
            return jsonify({'error': f'Post with id {id} not found'}), 404
        
        if request.method == 'GET':
            return jsonify({'post': post}), 200
        
        if request.method == 'PUT':
            data = request.get_json()
            if not data:
                return jsonify({'error': 'No data provided'}), 400
            if 'title' not in data or not data['title'].strip():
                return jsonify({'error': 'Title is required'}), 400
            if 'content' not in data or not data['content'].strip():
                return jsonify({'error': 'Content is required'}), 400
                
            post['title'] = data['title'].strip()
            post['content'] = data['content'].strip()
            post['updated_at'] = datetime.now().isoformat()
            return jsonify({'message': 'Post updated', 'post': post}), 200
        
        if request.method == 'DELETE':
            posts.remove(post)
            return jsonify({'message': f'Post {id} deleted successfully'}), 200
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.errorhandler(404)
def not_found(e):
    return jsonify({'error': 'Resource not found'}), 404

@app.errorhandler(405)
def method_not_allowed(e):
    return jsonify({'error': 'Method not allowed'}), 405

@app.errorhandler(500)
def internal_server_error(e):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    # Create static folder if it doesn't exist
    os.makedirs(os.path.join(app.root_path, 'static'), exist_ok=True)
    app.run(debug=True, host='0.0.0.0', port=5000)

