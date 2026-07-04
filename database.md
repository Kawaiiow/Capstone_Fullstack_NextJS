## Table `rooms`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `name` | `text` |  |
| `capacity` | `int4` |  |
| `status` | `text` |  |
| `image_url` | `text` |  Nullable |
| `created_at` | `timestamptz` |  Nullable |
| `room_type` | `text` |  |
| `price_per_hour` | `numeric` |  Nullable |

## Table `amenities`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `name` | `text` |  Unique |

## Table `room_amenities`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `room_id` | `uuid` | Primary |
| `amenity_id` | `uuid` | Primary |

## Table `bookings`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `room_id` | `uuid` |  Nullable |
| `user_id` | `uuid` |  |
| `start_time` | `timestamptz` |  |
| `end_time` | `timestamptz` |  |
| `status` | `text` |  |
| `created_at` | `timestamptz` |  Nullable |

## Table `payments`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `booking_id` | `uuid` |  Nullable |
| `amount` | `numeric` |  |
| `status` | `text` |  |
| `slip_url` | `text` |  Nullable |
| `paid_at` | `timestamptz` |  Nullable |
| `created_at` | `timestamptz` |  Nullable |

## Table `profiles`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `role` | `text` |  |
| `created_at` | `timestamptz` |  |
| `updated_at` | `timestamptz` |  |

