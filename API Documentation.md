# EventVault API Documentation

Backend Base URL:

```txt
https://event-vault-dlcl.onrender.com/
```

## Authentication APIs

### Register User

```http
POST /api/auth/register
```

Example body:

```json
{
  "name": "Rahul Sen",
  "email": "rahul@example.com",
  "password": "password123",
  "role": "member"
}
```

### Login User

```http
POST /api/auth/login
```

Example body:

```json
{
  "email": "rahul@example.com",
  "password": "password123"
}
```

Response includes JWT token and user information.

## Event APIs

### Get All Events

```http
GET /api/events
```

### Create Event

```http
POST /api/events
Authorization: Bearer <token>
```

Example body:

```json
{
  "title": "Cultural Fest 2026",
  "description": "Annual college cultural fest",
  "category": "Cultural",
  "date": "2026-06-10",
  "location": "College Auditorium"
}
```

### Get Single Event

```http
GET /api/events/:id
```

### Update Event

```http
PUT /api/events/:id
Authorization: Bearer <token>
```

### Delete Event

```http
DELETE /api/events/:id
Authorization: Bearer <token>
```

## Media APIs

### Upload Media

```http
POST /api/media/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

Form data:

```txt
file: selected media file
eventId: event id
visibility: public/private
```

### Get Media

```http
GET /api/media
```

### Get Media by Event

```http
GET /api/media/event/:eventId
```

### Like Media

```http
POST /api/media/:id/like
Authorization: Bearer <token>
```

### Comment on Media

```http
POST /api/media/:id/comment
Authorization: Bearer <token>
```

Example body:

```json
{
  "text": "Great photo!"
}
```

### Add to Favourites

```http
POST /api/media/:id/favourite
Authorization: Bearer <token>
```

### Tag User

```http
POST /api/media/:id/tag
Authorization: Bearer <token>
```

Example body:

```json
{
  "username": "Rahul Sen"
}
```

## Notification APIs

### Get User Notifications

```http
GET /api/notifications
Authorization: Bearer <token>
```

### Mark Notification as Read

```http
PUT /api/notifications/:id/read
Authorization: Bearer <token>
```

## User/Admin APIs

### Get Users

```http
GET /api/users
Authorization: Bearer <token>
```

### Approve Photographer/User

```http
PUT /api/users/:id/approve
Authorization: Bearer <token>
```

Note: Exact endpoint names may vary slightly depending on final route implementation. The above documentation represents the intended API structure of EventVault.
