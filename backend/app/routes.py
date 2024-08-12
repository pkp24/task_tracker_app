from flask import render_template, redirect, url_for, flash, request, jsonify
from app import db
from app.models import Task, RepeatingTask, TaskCompletion
from flask import Blueprint
from sqlalchemy import text, and_
from sqlalchemy.orm import aliased
from datetime import datetime, timedelta
import logging
import calendar


bp = Blueprint('main', __name__)

@bp.route('/api/tasks/without-end-date', methods=['GET'])
def get_tasks_without_end_date():
    RepeatingTaskAlias = aliased(RepeatingTask)

    tasks_without_end_date = Task.query.outerjoin(TaskCompletion, Task.task_id == TaskCompletion.task_id).filter(
        TaskCompletion.completion_id == None,  # Exclude tasks that are completed
        Task.due_date_only.is_(None)
    ).filter(
        ~Task.task_id.in_(
            db.session.query(RepeatingTaskAlias.task_id)
        )
    ).all()

    return jsonify([task.to_dict() for task in tasks_without_end_date])



@bp.route('/api/tasks/with-end-date', methods=['GET'])
def get_tasks_with_end_date():
    RepeatingTaskAlias = aliased(RepeatingTask)

    tasks_with_end_date = Task.query.outerjoin(TaskCompletion, Task.task_id == TaskCompletion.task_id).filter(
        TaskCompletion.completion_id == None,  # Exclude tasks that are completed
        Task.due_date_only.isnot(None)
    ).filter(
        ~Task.task_id.in_(
            db.session.query(RepeatingTaskAlias.task_id)
        )
    ).order_by(Task.due_date_only).all()

    return jsonify([task.to_dict() for task in tasks_with_end_date])



@bp.route('/api/tasks/repeating', methods=['GET'])
def get_repeating_tasks():
    repeating_tasks = RepeatingTask.query.all()

    # Convert repeating tasks to dictionaries and return as JSON
    return jsonify([task.to_dict() for task in repeating_tasks])

@bp.route('/api/tasks/create', methods=['POST'])
def create_task():
    data = request.json

    # Extract data from the request
    task_name = data.get('task_name')
    task_description = data.get('task_description')
    due_date = data.get('due_date_only')
    time_of_day = data.get('due_time_only')
    frequency = data.get('frequency')

    # Parse the due_date and time_of_day into their respective fields
    due_date_only = datetime.strptime(due_date, '%Y-%m-%d').date() if due_date else None
    due_time_only = datetime.strptime(time_of_day, '%H:%M').time() if time_of_day else None


    # Create the new task
    new_task = Task(
        task_name=task_name,
        task_description=task_description,
        due_date_only=due_date_only,
        due_time_only=due_time_only
    )
    db.session.add(new_task)
    db.session.commit()

    # If the task has a frequency, create a repeating task
    if frequency != 'none':
        repeating_task = RepeatingTask(
            task_id=new_task.task_id,
            frequency=frequency,
            interval=1,  # or any default interval value
            day_of_week=datetime.strptime(due_date, '%Y-%m-%d').strftime('%A').lower() if frequency == 'weekly' else None,
            day_of_month=int(due_date.split('-')[2]) if frequency == 'monthly' else None,
            time_of_day=datetime.strptime(time_of_day, '%H:%M').time() if time_of_day else None
        )
        db.session.add(repeating_task)
        db.session.commit()

    return jsonify(new_task.to_dict()), 201

@bp.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    task = Task.query.get_or_404(task_id)
    db.session.delete(task)
    db.session.commit()
    return '', 204

@bp.route('/api/tasks/mark-complete/<int:task_id>', methods=['POST'])
def complete_task(task_id):
    task = Task.query.get_or_404(task_id)
    completion = TaskCompletion(task_id=task.task_id, completion_date=datetime.now())
    db.session.add(completion)
    db.session.commit()
    return '', 204

@bp.route('/api/tasks/completed', methods=['GET'])
def get_completed_tasks():
    completed_tasks = TaskCompletion.query.order_by(TaskCompletion.completion_date.desc()).all()
    return jsonify([task.to_dict() for task in completed_tasks])

def calculate_week_number(date):
    # Adjust the date so that Sunday becomes the start of the week
    adjusted_date = date - timedelta(days=(date.weekday() + 1) % 7)
    return adjusted_date.isocalendar()[1]
