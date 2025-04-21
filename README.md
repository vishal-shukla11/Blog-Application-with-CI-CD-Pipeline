# Full Stack DevOps Project

This is a modern full-stack application built with React.js frontend and Flask backend, designed with DevOps best practices in mind.

## Tech Stack

### Frontend
- React.js 19.0.0
- React Testing Library
- Modern JavaScript (ES6+)

### Backend
- Python Flask 2.0.1
- Flask-CORS for cross-origin resource sharing
- Gunicorn as WSGI HTTP Server

## Project Structure
```
.
├── frontend/          # React.js frontend application
├── backend/           # Flask backend application
├── .github/           # GitHub Actions workflows
│   └── workflows/
│       └── ci.yml    # CI/CD pipeline configuration
└── docker-compose.yaml # Docker compose configuration
```

## CI/CD Pipeline

The project uses GitHub Actions for continuous integration and deployment. The pipeline includes:

### Continuous Integration (CI)
- Triggered on push to main branch and pull requests
- Runs on Ubuntu latest
- Sets up Python 3.9 and Node.js 14
- Installs backend and frontend dependencies
- Builds the frontend application
- Runs backend tests

### Continuous Deployment (CD)
- Triggered only on push to main branch
- Requires successful completion of CI tests
- Deploys to AWS infrastructure:
  1. Configures AWS credentials
  2. Logs into Amazon ECR
  3. Builds and pushes Docker images to ECR
  4. Deploys to EC2 instance:
     - Sets up Docker Compose configuration
     - Pulls latest images from ECR
     - Deploys containers

### Required Secrets
The following secrets need to be configured in GitHub repository settings:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `EC2_HOST`
- `EC2_USERNAME`
- `EC2_SSH_KEY`

## Deployment Options

### 1. Local Development Setup

#### Frontend Setup
```bash
cd frontend
npm install
npm start
```
The frontend will be available at http://localhost:3000

#### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```
The backend will be available at http://localhost:5000

### 2. Docker Deployment

This project is containerized and can be easily deployed using Docker and Docker Compose.

#### Prerequisites
- Docker
- Docker Compose

#### Steps
1. Clone the repository
2. From the root directory, run:
```bash
docker-compose up --build
```

This will:
- Build and start the frontend container (accessible at http://localhost:3000)
- Build and start the backend container (accessible at http://localhost:5000)
- Set up the necessary networking between containers

To stop the containers:
```bash
docker-compose down
```

### 3. Cloud Deployment

The application can be deployed to various cloud platforms. Here are the steps for some popular options:

#### AWS Deployment
1. **Elastic Beanstalk**
   - Create two separate environments for frontend and backend
   - Use the provided Dockerfiles to build and deploy
   - Configure environment variables in Elastic Beanstalk console
   - Set up AWS RDS if database is needed

2. **ECS (Elastic Container Service)**
   - Push Docker images to ECR (Elastic Container Registry)
   - Create ECS cluster
   - Define task definitions using the Dockerfiles
   - Set up Application Load Balancer
   - Configure auto-scaling as needed

#### Google Cloud Platform
1. **Google Kubernetes Engine (GKE)**
   - Push Docker images to Google Container Registry
   - Create a GKE cluster
   - Apply Kubernetes manifests
   - Configure Cloud Load Balancing

#### Microsoft Azure
1. **Azure Kubernetes Service (AKS)**
   - Push Docker images to Azure Container Registry
   - Create AKS cluster
   - Deploy using Kubernetes manifests
   - Set up Azure Load Balancer

## Environment Variables

### Frontend
Create a `.env` file in the frontend directory:
```
REACT_APP_API_URL=http://localhost:5000  # Backend API URL
```

### Backend
Create a `.env` file in the backend directory:
```
FLASK_ENV=development
FLASK_APP=app.py
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details 