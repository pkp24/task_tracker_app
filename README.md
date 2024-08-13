# task_tracker_app
This is for keeping track of tasks for someone with ADHD
made mostly with ChatGPT4o so far

You must have a postgres database set up elsewhere, modify the docker-compose.yml located in backend to change the ip

run using: DB_PASSWORD=$(cat password.txt) docker-compose up --build
make sure you are in task_tracker_app/backend
make sure you have the db password in task_tracker_app/backend/password.txt



The Database can be made using the below SQL code

<details>
  <summary>Click to view SQL Code</summary>

  ```sql
  -- Recreate the database
  CREATE DATABASE tasktracker WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';

  -- Connect to the new database
  \connect tasktracker

  -- Create the public schema
  CREATE SCHEMA public;

  -- Create the tasks table
  CREATE TABLE public.tasks (
      task_id integer NOT NULL,
      task_name character varying(255) NOT NULL,
      task_description text,
      due_date_only date,
      due_time_only time without time zone
  );

  -- Create the sequence for tasks.task_id
  CREATE SEQUENCE public.tasks_task_id_seq
      AS integer
      START WITH 1
      INCREMENT BY 1
      NO MINVALUE
      NO MAXVALUE
      CACHE 1;

  -- Associate the sequence with tasks.task_id
  ALTER SEQUENCE public.tasks_task_id_seq OWNED BY public.tasks.task_id;

  -- Set default value for tasks.task_id
  ALTER TABLE ONLY public.tasks ALTER COLUMN task_id SET DEFAULT nextval('public.tasks_task_id_seq'::regclass);

  -- Create the primary key constraint on tasks
  ALTER TABLE ONLY public.tasks
      ADD CONSTRAINT tasks_pkey PRIMARY KEY (task_id);

  -- Create the repeating_tasks table
  CREATE TABLE public.repeating_tasks (
      repeat_id integer NOT NULL,
      task_id integer NOT NULL,
      frequency character varying(50) NOT NULL,
      "interval" integer NOT NULL,
      day_of_week character varying(10),
      day_of_month integer,
      time_of_day time without time zone,
      CONSTRAINT repeating_tasks_day_of_month_check CHECK (((day_of_month >= 1) AND (day_of_month <= 31))),
      CONSTRAINT repeating_tasks_interval_check CHECK (("interval" > 0))
  );

  -- Create the sequence for repeating_tasks.repeat_id
  CREATE SEQUENCE public.repeating_tasks_repeat_id_seq
      AS integer
      START WITH 1
      INCREMENT BY 1
      NO MINVALUE
      NO MAXVALUE
      CACHE 1;

  -- Associate the sequence with repeating_tasks.repeat_id
  ALTER SEQUENCE public.repeating_tasks_repeat_id_seq OWNED BY public.repeating_tasks.repeat_id;

  -- Set default value for repeating_tasks.repeat_id
  ALTER TABLE ONLY public.repeating_tasks ALTER COLUMN repeat_id SET DEFAULT nextval('public.repeating_tasks_repeat_id_seq'::regclass);

  -- Create the primary key constraint on repeating_tasks
  ALTER TABLE ONLY public.repeating_tasks
      ADD CONSTRAINT repeating_tasks_pkey PRIMARY KEY (repeat_id);

  -- Create the foreign key constraint on repeating_tasks
  ALTER TABLE ONLY public.repeating_tasks
      ADD CONSTRAINT repeating_tasks_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(task_id) ON DELETE CASCADE;

  -- Create the task_completion table
  CREATE TABLE public.task_completion (
      completion_id integer NOT NULL,
      task_id integer NOT NULL,
      completion_date timestamp without time zone NOT NULL
  );

  -- Create the sequence for task_completion.completion_id
  CREATE SEQUENCE public.task_completion_completion_id_seq
      AS integer
      START WITH 1
      INCREMENT BY 1
      NO MINVALUE
      NO MAXVALUE
      CACHE 1;

  -- Associate the sequence with task_completion.completion_id
  ALTER SEQUENCE public.task_completion_completion_id_seq OWNED BY public.task_completion.completion_id;

  -- Set default value for task_completion.completion_id
  ALTER TABLE ONLY public.task_completion ALTER COLUMN completion_id SET DEFAULT nextval('public.task_completion_completion_id_seq'::regclass);

  -- Create the primary key constraint on task_completion
  ALTER TABLE ONLY public.task_completion
      ADD CONSTRAINT task_completion_pkey PRIMARY KEY (completion_id);

  -- Create the foreign key constraint on task_completion
  ALTER TABLE ONLY public.task_completion
      ADD CONSTRAINT task_completion_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(task_id) ON DELETE CASCADE;

  -- Set the sequence values to start from 1
  SELECT pg_catalog.setval('public.repeating_tasks_repeat_id_seq', 1, false);
  SELECT pg_catalog.setval('public.task_completion_completion_id_seq', 1, false);
  SELECT pg_catalog.setval('public.tasks_task_id_seq', 1, false);
  ```

</details>
