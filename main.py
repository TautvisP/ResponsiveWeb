from flask import Flask, render_template
from flask_scss import Scss

app = Flask(__name__)
Scss(app, static_dir='static', asset_dir='css')

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)