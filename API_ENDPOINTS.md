# API Endpoints Documentation

## Authentication Module
### `POST /auth/login` - User login
**Request Body** (LoginDto):
```typescript
{
  email: string; // @IsEmail()
  password: string; // @IsString() @MinLength(8)
}
```
**Response**:
```typescript
{
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
    role: Role;
  }
}
```

### `POST /auth/register` - User registration
**Request Body** (RegisterDto):
```typescript
{
  email: string; // @IsEmail()
  password: string; // @IsString() @MinLength(8)
  name: string; // @IsString() @IsNotEmpty()
  role?: Role; // @IsOptional() @IsEnum(Role)
}
```
### `POST /auth/forgot-password` - Request password reset (sends email with token)
`POST /auth/reset-password` - Reset password using token

## User Management
`GET /users` - Get all users (ADMIN)
`GET /users/:id` - Get user by ID
`PATCH /users/:id` - Update user
`DELETE /users/:id` - Delete user (ADMIN)

## Career Management
`POST /carriers` - Create career (ADMIN/EMPLOYEE)
`GET /carriers` - List all careers (ADMIN/EMPLOYEE)
`GET /carriers/active` - List active careers
`GET /carriers/:id` - Get career by ID (ADMIN/EMPLOYEE)
`PATCH /carriers/:id` - Update career (ADMIN/EMPLOYEE)
`DELETE /carriers/:id` - Delete career (ADMIN)

## Dish Management
`POST /dishes` - Create dish
`GET /dishes` - List all dishes with pagination
`GET /dishes/:id` - Get dish by ID
`PATCH /dishes/:id` - Update dish
`DELETE /dishes/:id` - Delete dish

## Menu Management
`POST /menus` - Create menu
`GET /menus` - List all menus
`GET /menus/:id` - Get menu by ID
`PATCH /menus/:id` - Update menu
`DELETE /menus/:id` - Delete menu

## Attendance Tracking
`POST /attendances` - Create attendance record
`GET /attendances` - List all attendances
`GET /attendances/:id` - Get attendance by ID

## Feedback System
### Comments
`POST /comments` - Create comment
`GET /comments/dish/:id` - Get comments for dish

### Ratings
`POST /ratings` - Create rating
`GET /ratings/dish/:id` - Get ratings for dish

## Statistics Module
`POST /stats` - Generate statistics (ADMIN/EMPLOYEE)
`POST /stats/all` - List all stats with pagination (ADMIN/EMPLOYEE)
`GET /stats/daily/:date` - Get real-time stats (ADMIN/EMPLOYEE)
`GET /stats/:id` - Get stat by ID (ADMIN/EMPLOYEE)
`DELETE /stats/:id` - Delete stat (ADMIN only)

## File Uploads
`POST /files/image` - Upload image file

## Notes:
- JWT authentication required for all endpoints
- Role-based access control (ADMIN, EMPLOYEE, STUDENT)
- Pagination available on list endpoints (offset, limit)
- Error responses follow standardized format
- All dates in ISO 8601 format
- Documentation available at `/api/docs` via Swagger UI
