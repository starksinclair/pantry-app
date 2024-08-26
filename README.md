# Pantry Management App

## Overview

The Pantry Management App is a comprehensive tool designed to help users keep track of their food items and efficiently manage their pantry. With features like barcode scanning, image-based food item recognition, AI-powered food analysis, and recipe generation, this app makes it easier to reduce food waste and organize your pantry.

## Features

- **Barcode Scanning**: Quickly add items to your pantry by scanning their barcodes.
- **Image Recognition**: Use the camera to capture images of food items, and the app will analyze and categorize them using AI.
- **AI-Powered Analysis**: The app provides detailed information about food items, including their name, category, and estimated expiration date.
- **Recipe Generation**: Automatically generate random recipes based on the food items available in your pantry.
- **User Authentication**: Secure login using Google Authentication or email and password.
- **Firebase Integration**: Real-time data synchronization using Firebase for a seamless experience.

## Installation

### Prerequisites

- Node.js: Ensure that you have Node.js installed on your machine.
- Firebase Account: Set up a Firebase project and obtain your configuration details.
- Google Gemini API Key: Obtain an API key from Google to enable AI features.

### Steps

1. Clone the Repository:
   ```bash
   git clone https://github.com/yourusername/pantry-management-app.git
   cd pantry-management-app
   ```

2. Install Dependencies:
   ```bash
   npm install
   ```

3. Configure Firebase:
   Create a `.env.local` file in the root directory and add your Firebase configuration:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. Configure Google Gemini API:
   Add your Google Gemini API key to the `.env.local` file:
   ```env
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
   ```

5. Run the Application:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

## Usage

### Logging In
- **Google Authentication**: Click on the "Login with Google" button.
- **Email and Password**: Enter your credentials to log in.

### Adding Items
- **Barcode Scanning**: Tap the barcode icon and scan the barcode of the item.
- **Image Recognition**: Tap the camera icon, take a picture of the food item, and let the AI analyze it.
- **Manual Entry**: Click "Add New Item" and manually enter the details.

### Viewing the Pantry
Go to the Pantry List to view all your stored items, their categories, and expiration dates.

### Generating a Recipe
Click the "Get Cookin'" button at the bottom of the screen to generate a random recipe using the items in your pantry.

### Logging Out
Click the logout button to securely end your session.

## AI Integration
The app utilizes Google's Gemini API for image recognition and AI-powered analysis. The AI provides a full analysis of a food item, including its name, category, and estimated expiration date. Additionally, the AI generates random recipes based on the available items in your pantry.

## Testing

### Testing the App
To test the app:
- **Login**: Ensure that the authentication process works as expected.
- **Add Items**: Test barcode scanning, image recognition, and manual entry.
- **Generate Recipes**: Verify that the AI generates relevant recipes using pantry items.
- **Logout**: Confirm that the logout functionality works correctly.

## Contributing
We welcome contributions! Please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Make your changes and commit them (`git commit -m 'Add YourFeature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a Pull Request.

## License
This project is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License. You are free to fork and modify the repository for personal use but not for commercial purposes.

## Contact
If you have any questions or feedback, feel free to reach out:
- **Email**: nzenwatasinclair@gmail.com
