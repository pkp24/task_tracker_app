# task_tracker_app
This is for keeping track of tasks
made mostly with ChatGPT4o so far

You must have a postgres database set up elsewhere, modify the docker-compose.yml located in backend to change the ip

run using: DB_PASSWORD=$(cat password.txt) docker-compose up --build
make sure you are in task_tracker_app/backend
make sure you have the db password in task_tracker_app/backend/password.txt
