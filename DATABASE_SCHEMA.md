# EventVault Database Schema

EventVault uses MongoDB Atlas as the database. The main collections are User, Event, Media, and Notification.

## 1. User Collection

Stores user account details and role information.

```js
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String, // hashed password
  role: String, // admin, photographer, member, viewer
  isApproved: Boolean,
  favourites: [ObjectId], // references Media
  createdAt: Date,
  updatedAt: Date
}
```

## 2. Event Collection

Stores event details and metadata.

```js
{
  _id: ObjectId,
  title: String,
  description: String,
  category: String,
  date: Date,
  location: String,
  createdBy: ObjectId, // references User
  isPrivate: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 3. Media Collection

Stores uploaded media details, AWS S3 URL, AI tags, and social interactions.

```js
{
  _id: ObjectId,
  event: ObjectId, // references Event
  uploadedBy: ObjectId, // references User
  fileUrl: String, // AWS S3 media URL
  fileType: String, // image or video
  fileName: String,
  tags: [String], // AI-generated tags from AWS Rekognition
  taggedUsers: [
    {
      user: ObjectId, // references User
      name: String
    }
  ],
  likes: [ObjectId], // references User
  comments: [
    {
      user: ObjectId,
      text: String,
      createdAt: Date
    }
  ],
  favourites: [ObjectId], // references User
  visibility: String, // public or private
  createdAt: Date,
  updatedAt: Date
}
```

## 4. Notification Collection

Stores notifications generated from social interactions.

```js
{
  _id: ObjectId,
  recipient: ObjectId, // references User
  sender: ObjectId, // references User
  type: String, // like, comment, tag, upload
  message: String,
  media: ObjectId, // references Media
  isRead: Boolean,
  createdAt: Date
}
```
