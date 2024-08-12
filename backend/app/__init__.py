import logging
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from config import Config

db = SQLAlchemy()
migrate = Migrate()


def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config.from_object(Config)
    app.config['TEMPLATES_AUTO_RELOAD'] = True


    # Configure logging
    logging.basicConfig(level=logging.INFO)
    app.logger.setLevel(logging.INFO)

    db.init_app(app)
    migrate.init_app(app, db)

    from app import routes, models
    app.register_blueprint(routes.bp)

    return app
