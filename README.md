# MyPharma / OmniumAI Platform

## Overview
This project was developed in the scope of the **Master in Computer Engineering (2024/25)** in collaboration with **MyPharma** and **OmniumAI**.  
It provides a complete solution to **automate, simplify, and optimize the management of pharmaceutical sales data**.  

The system integrates:
- A **web platform** with intuitive and user-friendly interfaces.  
- A **database** for storing and managing pharmaceutical information.  
- A **backend** for processing, cleaning, and transforming sales data.  
- An **AI-powered chatbot** that provides information about MyPharma’s nutritional supplements.  

---

## Main Features
- **Data import & processing** from Excel files.  
- **Pharmacy, doctor, and delegate management** (register, edit, consult).  
- **Sales and visits management** with reporting and visualization.  
- **Scheduling of visits** between delegates and medical professionals.  
- **Chatbot assistant** to answer questions about supplements (Condotril, Neurofil, Duobiotic).  

---

## System Architecture
The project is divided into five main components:

- **Frontend** (`frontend/`):  
  Developed with **React**, **Ant Design**, and **Zustand** for state management.  
  Provides a clean and intuitive user interface for all stakeholders.

- **Backend** (`backend/`):  
  Built with **Python** and **Node.js**.  
  Responsible for data transformation, business logic, and API communication with the frontend. 

- **Database** (`database/`):
  Implemented in **PostgreSQL**.  
  Includes tables, indexes, and **materialized views** for optimized queries on sales, doctors, pharmacies, and delegates.

- **API** (`api/`):
  Node.js service handling routes and queries, bridging frontend and backend logic.

- **Chatbot** (`chatbot/`):
  Built with **LangChain**, **Python**, and **LLMs** (Llama 3.1 and GPT-4o-mini).
  Uses **FAISS** vector storage and embeddings to retrieve information from product documentation.  

---

## Use Cases
The platform supports the following main use cases:
1. User authentication  
2. Register and edit pharmacies, doctors, and delegates  
3. Import and visualize sales data  
4. Schedule and consult visits  
5. Interact with the chatbot for supplement information  

---

## Future Improvements
- Support for additional file formats (beyond Excel).  
- Automated validation and correction of imported files.  
- Chatbot improvements: user-specific history and continuous response evaluation.  
- Frontend enhancements: file upload progress indicators and notifications.

---

## Project Structure

```
project/
│── api/ # Node.js API service
│── backend/ # Data processing, logic, and integration
│── chatbot/ # Chatbot implementation with LLMs
│── database/ # PostgreSQL scripts (tables, views, population)
│── frontend/ # React-based user interface
```

---

## Team
Developed by the **Master in Computer Engineering 2024/25** students in collaboration with **MyPharma** and **OmniumAI**.  

