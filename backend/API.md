# SafetyNet HER - Backend API

## Base URL
http://localhost:3001

## Endpoints

### Health Check
GET /api/health

### Get All Incidents
GET /api/incidents
GET /api/incidents?status=pending

### Get Incident Stats
GET /api/incidents/stats
Response: { total, resolved, pending, policeInvolvedPercentage }

### Get All Volunteers
GET /api/volunteers

### Simulate Crisis
POST /api/sms/incoming
Body: From=+15555551234&Body=Your%20crisis%20message

## Demo Data Loaded
- 50 incidents (spread over 30 days)
- 3 volunteers (all on duty)
- 96% community resolution (only 4% police!)
