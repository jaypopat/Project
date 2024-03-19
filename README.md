# Whisper - A Location-Based Chatroom Application

Welcome to Whisper, a chatroom application designed to connect users based on their geographical location. This application aims to foster local communities by providing a platform for real-time communication.

## Features

- Room Creation and Joining: Create your own chat rooms or join existing ones, fostering a community around shared locations.
- Real-Time Messaging: Enjoy instant messaging with your chat partners, ensuring your conversations are always up-to-date and engaging.
- User-Friendly Interface: Navigate through the application with ease, providing a seamless experience that keeps you connected with your community.

## Getting Started

### Prerequisites

- A Javascript runtime (eg - nodejs/bun/winterjs etc)
- Docker (optional, for running with Docker).

### Installation

### Setup Project

Rename the .env.sample file to .env and fill in the necessary fields with the appropriate values.

#### Running Locally

1. Clone the repository to your local machine.
   ```
   git clone https://github.com/jaypopat/Project.git
   ```
2. Install dependencies:
   ```
   npm i
   ```
3. Start the development server:
   ```
   npm run dev
   ```

#### Running with Docker

1. Build the Docker image:
   ```
   docker build -t whisper .
   ```
2. Run the Docker container:
   ```
   docker run -d --rm -p 5173:5173 whisper
   ```

### Accessing Whisper

Once the server is running, you can access Whisper by navigating to `http://localhost:5173` in your web browser.