# HerAfya

HerAfya is a health and wellness application focused on providing women and girls with essential resources for healthcare access, education, and support. The app offers a range of features including health tips, educational content, period and fertility tracker, pregnancy journey tracker, emergency contacts, and a support request system, all tailored to improve health and well-being for African communities.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Setup](#setup)
- [Configuration](#configuration)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## Features

- *Health Tips*: Regularly updated health and wellness tips curated for women and girls.
- *Educational Content*: Informative articles and videos covering various health topics.
- *Health Chatbot*: Gemini AI-powered chatbot to help users assess symptoms and receive guidance.
- *Pregnancy Journey Tracker*: Track appointments, and receive pregnancy-related tips and reminders.
- *Emergency Contacts*: Access local hotlines for rape reporting, domestic abuse, and general emergencies.
- *Support Requests*: Request help and chat with verified helpers for emotional support, resources, guidance, or companionship.
- *Notifications*: Push notifications for support responses, health tips, and emergency alerts.

## Installation

Follow these steps to set up the project locally:

1. *Clone the repository*:
   bash
   git clone https://github.com/Johnsoncindy/her-afya.git
   cd her-afya (expo app)
   cd backend/functions (cloud firebase function)

2. *Install dependencies*:
   For the frontend (Expo/React Native app):
   bash
   cd frontend/HerAyfa
   npm install
   

   For the backend (Firebase Functions):
   bash
   cd backend/functions
   npm install
   

## Setup

### Firebase Setup

1. *Firebase Project*: Set up a Firebase project on [Firebase Console](https://console.firebase.google.com).
2. *Enable Firebase Services*:
   - Firestore
   - Firebase Authentication (for Google Sign-In)
   - Firebase Cloud Functions
   - Firebase Cloud Messaging (for push notifications)
3. *Add Firebase Config*:
   Add your Firebase config to the frontend under frontend/config/firebaseConfig.js.

### Google API Setup

1. *Google Cloud*: Set up a Google Cloud project and enable:
   - Google Maps API
2. *Service Account*:
   - Create a service account with necessary permissions.
   - Save the service account key JSON file securely and avoid committing it to the repository. With firebase cloud function, the project id is sufficient.
3. *Push Notifications*: Configure expo push notification or Firebase Cloud Messaging for push notifications.

## Configuration

### Environment Variables

Create .env files in both frontend and backend/functions to store sensitive information:

#### Frontend (frontend/.env)
plaintext
EXPO_PUBLIC_GOOGLE_API_KEY=
EXPO_PUBLIC_WEB_CLIENT=

create expo secrets


#### Backend (backend/functions/.env)
plaintext
GOOGLE_APPLICATION_CREDENTIALS=path/to/serviceAccountKey.json
FIREBASE_PROJECT_ID=your_project_id


### .gitignore

Ensure that .gitignore is configured to ignore sensitive files like .env and service account JSON files:
plaintext
# Ignore Firebase and Google Cloud credentials
frontend/.env
backend/functions/.env
backend/functions/path/to/serviceAccountKey.json


## Usage

1. *Run the Frontend*:
   bash
   cd frontend
   npm start
   
   This will start the Expo server. Open the Expo app on your phone or emulator to view the app.

2. *Deploy Firebase Functions*:
   bash
   cd backend/functions
   firebase deploy --only functions
   

3. *Testing*: Use the Expo app on your mobile device or an emulator to test the app.

## Technologies Used

- *Frontend*:
  - React Native (Expo)
  - Zustand (for state management)
  - Firebase Authentication (Google Sign-In)
  - Google Maps API (for location-based features)

- *Backend*:
  - Firebase Cloud Functions
  - Firestore (for real-time database)
  - Firebase Cloud Messaging (for push notifications)
  - Google Cloud (Maps API)

- *Development Tools*:
  - GitHub Actions (CI/CD for automatic deployments)
  - VS Code

## Contributing

We welcome contributions! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch for your feature:
   bash
   git checkout -b feature/your-feature-name
   
3. Commit your changes:
   bash
   git commit -m "Add your feature description"
   
4. Push your branch:
   bash
   git push origin feature/your-feature-name
   
5. Create a pull request.

## License

This project is licensed under the MIT License.

