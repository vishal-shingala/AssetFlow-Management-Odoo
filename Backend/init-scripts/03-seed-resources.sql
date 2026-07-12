-- Seed extra resources and booking categories safely
-- Preserves all existing database records

-- 1. Insert Asset Categories for Shared Resources (if they do not exist)
INSERT INTO public.asset_categories (category_id, name, description, status)
VALUES 
  (6, 'Meeting Room', 'Shared meeting rooms', 'ACTIVE'),
  (7, 'Conference Hall', 'Large halls for events', 'ACTIVE'),
  (8, 'Projector', 'Portable screens', 'ACTIVE'),
  (9, 'Company Car', 'Vehicles for corporate travel', 'ACTIVE')
ON CONFLICT (category_id) DO NOTHING;

-- Adjust the sequence for asset_categories
SELECT setval('public.asset_categories_category_id_seq', COALESCE((SELECT MAX(category_id) FROM public.asset_categories), 5));

-- 2. Insert Shared Assets (if they do not exist)
INSERT INTO public.assets (id, asset_tag, asset_name, category_id, serial_number, purchase_date, purchase_cost, condition, location, is_shared, status)
VALUES
  (6, 'AST-101', 'Meeting Room A', 6, 'ROOM-A-101', '2024-01-01', 5000.00, 'EXCELLENT', 'Building A, Floor 3', TRUE, 'AVAILABLE'),
  (7, 'AST-102', 'Meeting Room B', 6, 'ROOM-B-102', '2024-01-01', 5000.00, 'GOOD', 'Building A, Floor 2', TRUE, 'AVAILABLE'),
  (8, 'AST-103', 'Meeting Room C', 6, 'ROOM-C-103', '2024-01-01', 4000.00, 'GOOD', 'Building B, Floor 1', TRUE, 'AVAILABLE'),
  (9, 'AST-104', 'Conference Hall A', 7, 'HALL-A-104', '2024-01-01', 12000.00, 'EXCELLENT', 'Building A, Floor 4', TRUE, 'AVAILABLE'),
  (10, 'AST-105', 'Conference Hall B', 7, 'HALL-B-105', '2024-01-01', 10000.00, 'GOOD', 'Building A, Floor 2', TRUE, 'AVAILABLE'),
  (11, 'AST-106', 'Projector - Epson EB-L200W', 8, 'SN-EP-2024-011', '2024-01-15', 1299.99, 'GOOD', 'Conference Room A', TRUE, 'AVAILABLE'),
  (12, 'AST-107', 'Projector - BenQ TK850i', 8, 'SN-BQ-2024-012', '2024-02-10', 1499.00, 'EXCELLENT', 'Server Room B', TRUE, 'AVAILABLE'),
  (13, 'AST-108', 'Company Car - Toyota Camry', 9, 'VIN-TC-2024-007', '2024-04-01', 28500.00, 'EXCELLENT', 'Parking Lot A', TRUE, 'AVAILABLE'),
  (14, 'AST-109', 'Company Car - Ford Transit', 9, 'VIN-FT-2024-008', '2024-05-15', 32000.00, 'GOOD', 'Parking Lot B', TRUE, 'AVAILABLE')
ON CONFLICT (id) DO NOTHING;

-- Adjust the sequence for assets
SELECT setval('public.assets_id_seq', COALESCE((SELECT MAX(id) FROM public.assets), 6));

-- 3. Insert Test Bookings for these Shared Assets
INSERT INTO public.resource_bookings (booking_id, asset_id, employee_id, start_time, end_time, purpose, status)
VALUES
  (1, 6, 1, CURRENT_TIMESTAMP + interval '1 hour', CURRENT_TIMESTAMP + interval '2 hours 30 minutes', 'Sprint Planning', 'UPCOMING'),
  (2, 10, 2, CURRENT_TIMESTAMP + interval '4 hours', CURRENT_TIMESTAMP + interval '6 hours', 'Product Launch Presentation', 'UPCOMING'),
  (3, 11, 1, CURRENT_TIMESTAMP - interval '1 day', CURRENT_TIMESTAMP - interval '22 hours', 'Client Demo', 'COMPLETED'),
  (4, 13, 2, CURRENT_TIMESTAMP + interval '1 day', CURRENT_TIMESTAMP + interval '1 day 8 hours', 'Client Visit - Downtown', 'UPCOMING')
ON CONFLICT (booking_id) DO NOTHING;

-- Adjust the sequence for resource_bookings
SELECT setval('public.resource_bookings_booking_id_seq', COALESCE((SELECT MAX(booking_id) FROM public.resource_bookings), 1));
