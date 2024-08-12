import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'your_secret_key_here'
    SQLALCHEMY_DATABASE_URI = (
        f"postgresql://{os.environ.get('DB_USERNAME', 'your_default_username')}:"
        f"{os.environ.get('DB_PASSWORD', 'your_default_password')}@"
        f"{os.environ.get('DB_HOST', '192.168.86.133')}:"
        f"{os.environ.get('DB_PORT', '5432')}/"
        f"{os.environ.get('DB_NAME', 'tasktracker')}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
