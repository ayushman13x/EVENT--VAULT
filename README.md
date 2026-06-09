# EventVault — Event & Media Management Platform

EventVault is a full-stack Event & Media Management Platform built for clubs, societies, photographers, event organizers, and members. The platform provides a centralized place to create events, upload media, organize event-wise albums, interact with photos and videos, and search media using AI-generated tags.

In many college clubs and societies, photos and videos from events are usually scattered across Google Drive links, personal folders, WhatsApp groups, and different cloud storage accounts. This makes it difficult to find photos later, manage access, give credit to photographers, or interact with media in an organized way. EventVault solves this problem by combining event management, cloud media storage, AI tagging, user roles, and social-media-like interactions into one web application.

---

## Live Project Links

**Frontend:**
https://event-vault-virid.vercel.app/auth

**Backend:**
https://event-vault-dlcl.onrender.com/

**GitHub Repository:**
https://github.com/ayushman13x/EVENT--VAULT

---

## Problem Statement

Clubs and societies frequently organize events such as photoshoots, workshops, trips, competitions, cultural fests, and parties. These events generate a large number of photos and videos. However, the media is usually scattered across multiple Google Drives, personal folders, and cloud storage links.

This creates major issues in organizing, searching, sharing, and managing event media efficiently. EventVault is built as a centralized platform where photographers, organizers, and members can upload, manage, access, and interact with event media seamlessly.

---

## Project Objective

The main objective of EventVault is to provide a scalable and user-friendly platform that allows:

* Clubs to manage events and media from one place
* Photographers to upload event photos and videos
* Members to browse, search, like, comment, tag, and favourite media
* Admins to manage users and platform access
* AI services to automatically generate useful image tags
* Cloud storage to handle uploaded media efficiently

---

## Core Features

## 1. Authentication and User Access

EventVault includes a complete authentication flow where users can register and login securely. The backend uses JWT-based authentication to protect private routes and verify logged-in users.

The platform is designed around role-based access. Different types of users can have different responsibilities and permissions.

Supported role structure:

* **Admin** — manages platform-level access and user requests
* **Photographer** — uploads and manages event media
* **Club Member** — views, interacts with, and accesses event media
* **Viewer** — browses public content

This role-based structure makes the platform suitable for real event teams where not every user should have the same level of access.

---

## 2. Event Management

The platform allows users to create and manage events. Each event can store important metadata such as event name, description, category, date, and other relevant details.

Events act as the main organizational unit of the platform. Instead of uploading all media into one common gallery, photos and videos can be grouped event-wise.

Event management features include:

* Create events
* View events
* Event-wise media organization
* Event descriptions and metadata
* Event category support
* Event-based gallery browsing

This makes it easier for users to find media from a specific workshop, trip, cultural fest, competition, or club activity.

---

## 3. Media Upload and Gallery

EventVault provides media upload functionality for event photos and videos. Uploaded media is stored using AWS S3, while its metadata is stored in MongoDB Atlas.

The gallery allows users to browse uploaded media in an organized way. Each media item can be connected with an event and can contain information such as uploader, tags, likes, comments, and visibility.

Media management features include:

* Upload photos and videos
* Event-wise media grouping
* Gallery view
* Media preview
* Cloud-based media storage
* Download option
* Public/private media support structure

This gives the platform a practical media management workflow instead of just being a simple image upload app.

---

## 4. AWS S3 Cloud Storage

EventVault uses AWS S3 for cloud-based media storage. Instead of storing images and videos directly inside the server or database, media files are uploaded to AWS S3.

This improves the scalability and reliability of the application because:

* Large media files are handled by cloud storage
* Backend server load is reduced
* Media files can be accessed through secure cloud URLs
* The database only stores metadata and file references
* The platform becomes more production-ready

AWS S3 integration makes the project closer to real-world media platforms where files are stored separately from application data.

---

## 5. AI-Powered Image Tagging using AWS Rekognition

EventVault integrates AWS Rekognition for AI-powered image tagging. When an image is uploaded, AWS Rekognition can analyze the image and generate labels based on the visual content.

Example generated tags may include:

* Person
* Crowd
* Stage
* Sports
* Nature
* Building
* Face
* Event
* Outdoor
* Performance

These AI-generated tags help improve media discoverability. Instead of manually checking every image, users can search or filter media based on meaningful tags generated by AI.

This feature directly supports the AI/ML requirement of the project and adds real-world intelligence to the media management flow.

---

## 6. Search and Discovery

The platform supports media discovery using event and media-related information. Users can search or filter content based on available fields such as event name, tags, upload details, and user-related data.

Search and discovery features include:

* Search by event-related information
* Search using AI-generated tags
* Find media based on uploaded metadata
* Discover media more easily inside the gallery

The goal is to reduce the time required to find relevant photos from large event albums.

---

## 7. Social Interaction Features

EventVault includes social-media-like interaction features to make the media experience more engaging.

Users can interact with media through:

* Likes
* Comments
* Favourites
* User tagging
* Share option
* Download option

These features make the platform more interactive and useful for club members. Instead of only viewing images, users can engage with the content, tag friends, save favourite photos, and participate around event memories.

---

## 8. Favourites System

Users can add media to their favourites. This allows members to save photos they like and access them later from a dedicated favourites section.

This feature is useful because event galleries may contain many photos, and users may want to keep selected media separately for quick access.

---

## 9. User Tagging

EventVault includes a tagging feature where users can tag friends or members in media. This makes it easier to connect people with photos and improves the social experience of the platform.

Tagging is useful in event media because users often want to identify who appears in a photo or notify someone that they are part of an uploaded image.

---

## 10. Notifications System

The platform includes a notification system for user interactions. Notifications can be generated for actions such as likes, comments, tags, and other media-related interactions.

Notification features improve user engagement by keeping users informed when something relevant happens on the platform.

Example use cases:

* Someone liked a photo
* Someone commented on media
* Someone tagged a user
* A new interaction happened on uploaded content

---

## 11. Find My Photos Feature

EventVault includes a “Find My Photos” section to support personalized photo discovery. The idea behind this feature is that users should be able to find photos related to them without manually scrolling through every event album.

This feature is designed around the problem statement’s requirement of personalized photo discovery. It provides a dedicated flow for users to search for their own photos and creates a foundation for facial-recognition-based matching.

---

## 12. Admin and Photographer Panels

The platform includes admin and photographer-related panels to manage platform access and event media workflows.

These panels help separate normal user actions from management-level actions. Admins can handle user-related controls, while photographers can focus on media uploads and event content.

This makes the application more realistic because actual club media platforms usually need different interfaces for admins, photographers, and members.

---

## Tech Stack

## Frontend

* React.js
* Vite
* CSS
* Axios
* React Router
* Deployed on Vercel

The frontend is built using React with Vite for fast development and optimized builds. It handles the user interface, routing, authentication screens, event pages, gallery, favourites, notifications, and admin-related views.

## Backend

* Node.js
* Express.js
* JWT Authentication
* Multer for file upload handling
* AWS SDK
* REST APIs
* Deployed on Render

The backend handles authentication, event APIs, media APIs, user management, notification logic, AWS S3 uploads, AWS Rekognition integration, and database communication.

## Database and Cloud

* MongoDB Atlas
* AWS S3
* AWS Rekognition

MongoDB Atlas is used to store users, events, media metadata, tags, comments, likes, favourites, and notifications. AWS S3 is used for storing uploaded media files. AWS Rekognition is used for AI-based image analysis and tag generation.

---

## System Architecture

```txt
User Browser
    |
    v
React Frontend - Vercel
    |
    | REST API Calls
    v
Node.js + Express Backend - Render
    |
    | Authentication and Business Logic
    v
MongoDB Atlas
    |
    | Media Storage
    v
AWS S3
    |
    | AI Image Analysis
    v
AWS Rekognition
```

---

## Project Structure

```txt
EVENT--VAULT/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── eventController.js
│   │   ├── mediaController.js
│   │   ├── notificationController.js
│   │   └── userController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── uploadMiddleware.js
│   │
│   ├── models/
│   │   ├── Event.js
│   │   ├── Media.js
│   │   ├── Notification.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── eventRoutes.js
│   │   ├── healthRoutes.js
│   │   ├── mediaRoutes.js
│   │   ├── notificationRoutes.js
│   │   └── userRoutes.js
│   │
│   ├── uploads/
│   ├── utils/
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── AdminPhotographerPanel.jsx
│   │   │   ├── AdminRequestsPanel.jsx
│   │   │   ├── CreateEventForm.jsx
│   │   │   ├── EventsPreview.jsx
│   │   │   ├── FeaturesSection.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── HeroSection.jsx
│   │   │   ├── LoginSection.jsx
│   │   │   ├── MediaGallery.jsx
│   │   │   ├── MediaUploadSection.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── PendingApprovalNotice.jsx
│   │   │   └── RegisterSection.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── AdminPage.jsx
│   │   │   ├── AuthPage.jsx
│   │   │   ├── EventsPage.jsx
│   │   │   ├── FavouritesPage.jsx
│   │   │   ├── FindMyPhotosPage.jsx
│   │   │   ├── GalleryPage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   └── NotificationsPage.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── config.js
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── index.html
│
└── README.md
```

---

## Database Overview

The platform mainly uses the following MongoDB collections:

## User

Stores user account details, authentication data, role information, approval status, and user-related actions.

## Event

Stores event details such as event name, description, category, date, and creator information.

## Media

Stores uploaded media metadata, AWS S3 file URL, uploader information, event reference, AI-generated tags, likes, comments, favourites, and tagged users.

## Notification

Stores user notifications generated through interactions such as likes, comments, tags, and uploads.

---

## Basic Data Relationship

```txt
User creates Event
Event contains Media
User uploads Media
Media contains AI Tags
User likes Media
User comments on Media
User favourites Media
User tags another User in Media
Notification is generated for User actions
```

---

## Local Setup

## 1. Clone the Repository

```bash
git clone https://github.com/ayushman13x/EVENT--VAULT
cd EVENT--VAULT
```

## 2. Backend Setup

```bash
cd backend
npm install
npm start
```

The backend runs locally on:

```txt
http://localhost:5000
```

## 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs locally on:

```txt
http://localhost:5173
```

---

## Deployment

## Backend Deployment

The backend is deployed on Render.

```txt
https://event-vault-dlcl.onrender.com/
```

Render handles the Node.js and Express backend server.

## Frontend Deployment

The frontend is deployed on Vercel.

```txt
https://event-vault-virid.vercel.app/auth
```

Vercel serves the React frontend and connects with the backend through API calls.

---

## Security Note

Real environment variables, database credentials, JWT secrets, and AWS keys are not included in this repository. These values are configured directly inside the deployment platforms and local environment files.
---

## Why EventVault is Useful

EventVault is useful because it solves a real coordination problem faced by clubs and societies. After large events, media collection and sharing becomes messy. EventVault gives organizers and members a structured platform where every event has its own media space.

Photographers can upload media directly, members can interact with the gallery, admins can manage access, and AI-generated tags make media easier to discover. With AWS S3 and MongoDB Atlas, the platform is designed in a way that can scale beyond a basic local project.

---

## Conclusion

EventVault is a practical and scalable Event & Media Management Platform that centralizes event media for clubs, societies, photographers, and members. It combines event management, media upload, cloud storage, AI tagging, role-based access, social interactions, and personalized discovery into a single web platform.

The project demonstrates real-world full-stack development using the MERN stack along with AWS S3, AWS Rekognition, MongoDB Atlas, Vercel, and Render. It is designed to make event media easier to upload, organize, search, manage, and interact with.