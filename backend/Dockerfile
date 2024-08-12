
# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the current directory contents into the container
COPY . .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Make port 1532 available to the world outside this container
EXPOSE 1532

# Define environment variable
ENV FLASK_APP=app
ENV FLASK_ENV=development

# Run the application
CMD ["flask", "run", "--host=0.0.0.0", "--port=1532"]
