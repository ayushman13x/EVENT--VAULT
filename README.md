# EventVault — Event & Media Management Platform

EventVault is a full-stack web platform built to centralize event-wise media management for clubs, societies, photographers, and members. It helps users upload, organize, search, interact with, and access event media from one place instead of relying on scattered Google Drive links, personal folders, or unmanaged cloud links.

## Live Links

- Frontend: https://event-vault-virid.vercel.app/auth
- Backend: https://event-vault-dlcl.onrender.com/

## Problem Statement

Clubs and societies organize many events such as photoshoots, workshops, trips, competitions, cultural fests, and parties. These events generate a large amount of photos and videos, but the media is usually scattered across multiple drives and personal folders. EventVault solves this by providing a centralized Event & Media Management Platform with cloud storage, event-wise media organization, social interactions, access control, AI tagging, and personalized photo discovery.

## Key Features

### Authentication and Roles
- User registration and login
- JWT-based authentication
- Role-based access structure
- Suggested roles: Admin, Photographer, Club Member, Viewer

### Event Management
- Create and manage events
- Store event metadata such as title, description, date, and category
- Event-wise albums and media grouping
- Sorting/filtering support by event details

### Media Management
- Upload photos and videos
- Cloud-based storage using AWS S3
- Event-wise gallery
- Media preview and gallery browsing
- Download media

### Social Interaction Features
- Like media
- Comment on uploads
- Add media to favourites
- Tag users/friends
- Share/download options

### AI/ML Features
- AWS Rekognition integration for AI-powered image tagging
- Automatically generated tags such as people, crowd, stage, sports, nature, etc.
- Search support using event name, tags, upload information, and user-related fields
- Personalized photo discovery concept through Find My Photos flow

### Notifications
- Notification system for interactions such as likes, comments, and tags

## Tech Stack

### Frontend
- React.js
- Vite
- CSS
- Axios
- Deployed on Vercel

### Backend
- Node.js
- Express.js
- JWT Authentication
- Multer upload handling
- AWS SDK
- Deployed on Render

### Database and Cloud
- MongoDB Atlas
- AWS S3 for cloud media storage
- AWS Rekognition for AI-based image tagging

## Project Structure

```txt
EVENT--VAULT/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── utils/
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── config.js
│   │   └── main.jsx
│   ├── package.json
│   └── index.html
│
└── README.md
```

## Environment Variables

### Backend `.env`

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret

AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_S3_BUCKET_NAME=your_s3_bucket_name
```

### Frontend `.env`

```env
VITE_API_URL=https://event-vault-dlcl.onrender.com
```

Never commit real secret keys or database URLs to GitHub.

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/ayushman13x/EVENT--VAULT
cd EVENT--VAULT
```

### 2. Backend Setup

```bash
cd backend
npm install
npm start
```

Backend runs on:

```txt
http://localhost:5000
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```txt
http://localhost:5173
```

## Deployment

### Backend
The backend is deployed on Render.

Backend live URL:

```txt
https://event-vault-dlcl.onrender.com/
```

### Frontend
The frontend is deployed on Vercel.

Frontend live URL:

```txt
https://event-vault-virid.vercel.app/auth
```

## Demo Flow

1. Open the deployed frontend.
2. Register or login as a user.
3. View events and gallery.
4. Create an event.
5. Upload media to an event.
6. View uploaded media in gallery.
7. Like, comment, favourite, tag, share, or download media.
8. View notifications.
9. Use AI-tag/search related features.
10. Show admin/photographer controls.

## Future Scope

- Full production-ready facial recognition based personalized photo discovery
- Real-time socket-based notifications
- Advanced role permissions
- PWA/offline caching
- Analytics dashboard
- AI-generated captions
- Duplicate image detection
- QR-based album sharing
- Image moderation system

## Conclusion

EventVault provides a practical, scalable, and user-friendly way to manage event media for clubs and societies. It combines MERN stack development with cloud integration using AWS S3 and AI-powered tagging using AWS Rekognition, making it suitable for real-world event media organization.
