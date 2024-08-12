from app import db
from datetime import datetime

class Task(db.Model):
    __tablename__ = 'tasks'
    task_id = db.Column(db.Integer, primary_key=True)
    task_name = db.Column(db.String(255), nullable=False)
    task_description = db.Column(db.Text)
    due_date_only = db.Column(db.Date)  # New date-only field
    due_time_only = db.Column(db.Time)  # New time-only field

    def __repr__(self):
        return f'<Task {self.task_name}>'

    def to_dict(self):
        return {
            'task_id': self.task_id,
            'task_name': self.task_name,
            'task_description': self.task_description,
            'due_date_only': self.due_date_only.strftime('%Y-%m-%d') if self.due_date_only else None,
            'due_time_only': self.due_time_only.strftime('%H:%M:%S') if self.due_time_only else None
        }


class RepeatingTask(db.Model):
    __tablename__ = 'repeating_tasks'
    repeat_id = db.Column(db.Integer, primary_key=True)
    task_id = db.Column(db.Integer, db.ForeignKey('tasks.task_id'))
    frequency = db.Column(db.String(50), nullable=False)
    interval = db.Column(db.Integer, nullable=False)
    day_of_week = db.Column(db.String(10))
    day_of_month = db.Column(db.Integer)
    time_of_day = db.Column(db.Time)

    task = db.relationship('Task', backref=db.backref('repeating_tasks', lazy=True))

    def __repr__(self):
        return f'<RepeatingTask {self.repeat_id}>'

    def to_dict(self):
        return {
            'repeat_id': self.repeat_id,
            'task_id': self.task_id,
            'task_name': self.task.task_name,
            'task_description': self.task.task_description,
            'frequency': self.frequency,
            'interval': self.interval,
            'day_of_week': self.day_of_week,
            'day_of_month': self.day_of_month,
            'time_of_day': self.time_of_day.strftime('%H:%M:%S') if self.time_of_day else None
        }

class TaskCompletion(db.Model):
    __tablename__ = 'task_completion'
    completion_id = db.Column(db.Integer, primary_key=True)
    task_id = db.Column(db.Integer, db.ForeignKey('tasks.task_id'))
    completion_date = db.Column(db.DateTime, nullable=False)

    task = db.relationship('Task', backref=db.backref('task_completion', lazy=True))

    def __repr__(self):
        return f'<TaskCompletion {self.completion_id}>'

    def to_dict(self):
        return {
            'completion_id': self.completion_id,
            'task_id': self.task_id,
            'task_name': self.task.task_name,
            'task_description': self.task.task_description,
            'completion_date': self.completion_date.strftime('%Y-%m-%d %H:%M:%S  %p')
        }
