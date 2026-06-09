# EventVault Architecture

## High-Level Architecture

```txt
User Browser
    |
    v
React Frontend - Vercel
    |
    | REST API Calls using Axios
    v
Node.js + Express Backend - Render
    |
    | Authentication
    v
JWT Auth Middleware
    |
    | Data Operations
    v
MongoDB Atlas
    |
    | Media Upload
    v
AWS S3
    |
    | AI Image Tagging
    v
AWS Rekognition
```

## Deployment Architecture

```txt
Frontend:
https://event-vault-virid.vercel.app/auth
Hosted on Vercel

Backend:
https://event-vault-dlcl.onrender.com/
Hosted on Render

Database:
MongoDB Atlas

Cloud Storage:
AWS S3

AI Service:
AWS Rekognition
```

## Request Flow

### User Login Flow

```txt
User enters email/password
        |
        v
React frontend sends login request
        |
        v
Express backend validates user
        |
        v
JWT token is generated
        |
        v
Frontend stores token and uses it for protected API calls
```

### Media Upload Flow

```txt
User selects media file
        |
        v
React frontend sends file to backend
        |
        v
Backend receives file through upload middleware
        |
        v
File is uploaded to AWS S3
        |
        v
AWS Rekognition analyzes image and returns labels/tags
        |
        v
Media document is saved in MongoDB Atlas
        |
        v
Gallery displays uploaded media with AI tags
```

### Social Interaction Flow

```txt
User likes/comments/tags media
        |
        v
Frontend sends action request
        |
        v
Backend updates Media document
        |
        v
Notification document is created
        |
        v
Target user can view notification
```

##  speciality in this Architecture :-

- Frontend and backend are deployed separately.
- Media files are not stored directly in the database.
- AWS S3 handles scalable file storage.
- AWS Rekognition handles AI image analysis externally.
- MongoDB Atlas provides managed cloud database hosting.
- REST APIs keep frontend and backend loosely coupled.
