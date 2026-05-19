export interface UserProfile {
  id?: number
  user_id: string
  email: string
  full_name?: string
  phone?: string
  car_model?: string
  avatar_url?: string
  role?: 'user' | 'member' | 'admin' | 'owner'
  created_at?: string
  updated_at?: string
}

export interface Service {
  id: number
  name: string
  description: string
  price: number
  category: string
  image_url?: string
  created_at?: string
}

export interface Employee {
  id: number
  first_name: string
  last_name: string
  position: string
  description: string
  photo_url?: string
  created_at?: string
}

export interface Booking {
  id?: number
  user_id?: string
  client_name: string
  phone: string
  email?: string
  service_id: number
  preferred_date: string
  preferred_time?: string
  car_model?: string
  comment?: string
  status: string
  admin_notes?: string
  created_at?: string
  updated_at?: string
}

export interface PartOrder {
  id?: number
  user_id?: string
  client_name: string
  phone: string
  email?: string
  part_name: string
  car_model: string
  quantity?: number
  comment?: string
  status: string
  price?: number
  admin_notes?: string
  created_at?: string
  updated_at?: string
}

export interface GalleryItem {
  id: number
  title: string
  image_url: string
  category: string
  description?: string
  created_at?: string
}

export interface Review {
  id?: number
  user_id?: string
  author_name: string
  text: string
  rating: number
  is_published: boolean
  created_at?: string
}

export interface Vacancy {
  id: number
  title: string
  description: string
  requirements: string
  salary?: string
  active: boolean
  created_at?: string
}

export interface JobApplication {
  id?: number
  vacancy_id: number
  applicant_name: string
  phone: string
  email?: string
  message?: string
  resume_url?: string
  status?: string
  created_at?: string
}

export interface ContactInfo {
  id: number
  discord?: string
  telegram?: string
  phone?: string
  email?: string
  address?: string
  working_hours?: string
  gps?: string
}

export interface Notification {
  id?: number
  user_id: string
  message: string
  type: string
  is_read: boolean
  created_at?: string
}
