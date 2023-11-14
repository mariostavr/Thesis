# Thesis

Note: Docker must be running.
https://docs.docker.com/desktop/install/windows-install/
>
>
Backend Initialization:
1. Go to *"backend"* directory
2. Run the **command "python"** and then the following commands
	1. **import services_coinrep**
	2. **services_coinrep.create_database()**
4. Go back to *"backend"* directory
5. Run the **command "uvicorn main:app --reload"**
>
>
Frontend Initialization:
1. Go to *"frontend"* directory
2. Run the following **commands**:
	1. **npm install**
	2. **npm start**

