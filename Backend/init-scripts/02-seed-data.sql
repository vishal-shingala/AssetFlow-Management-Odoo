SET session_replication_role = 'replica';

--
-- PostgreSQL database dump
--

\restrict vyLMSrY1iyRYeNy0CtASglnYsy8cQnf7iDJEYtGRcszfPkckJeYquNZyUtKf020

-- Dumped from database version 15.18
-- Dumped by pg_dump version 15.18

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users VALUES (1, 'sarah.johnson@example.com', 'hashed_pw', 'Sarah Johnson', 1, 'EMPLOYEE', 'ACTIVE', true, '2026-07-12 07:12:59.7282');
INSERT INTO public.users VALUES (2, 'alex.rivera@example.com', 'hashed_pw', 'Alex Rivera', 2, 'EMPLOYEE', 'ACTIVE', true, '2026-07-12 07:12:59.7282');
INSERT INTO public.users VALUES (3, 'admin@assetflow.com', '$2b$10$tkg6CzdM8Gcxow2AZL7Tbel4fPcRvuLmmF4vr6zRyyu8Axk2QJB0S', 'System Admin', NULL, 'ADMIN', 'ACTIVE', true, '2026-07-12 07:12:59.7282');


--
-- Data for Name: activity_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: asset_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.asset_categories VALUES (1, 'Laptop', 'Work laptops and notebooks', 'ACTIVE');
INSERT INTO public.asset_categories VALUES (2, 'Monitor', 'External displays and screens', 'ACTIVE');
INSERT INTO public.asset_categories VALUES (3, 'Tablet', 'Tablets and mobile devices', 'ACTIVE');
INSERT INTO public.asset_categories VALUES (4, 'Peripheral', 'Keyboards, mice, and accessories', 'ACTIVE');
INSERT INTO public.asset_categories VALUES (5, 'Networking', 'Routers, switches, and access points', 'ACTIVE');


--
-- Data for Name: assets; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.assets VALUES (3, 'AST-003', 'iPad Pro 12.9 inch', 3, 'SN-IP-2024-003', '2024-02-10', 1099.00, 'EXCELLENT', 'Building B, Floor 1', true, 'AVAILABLE', NULL, '2026-07-12 06:56:31.845523', '2026-07-12 06:56:31.845523');
INSERT INTO public.assets VALUES (4, 'AST-004', 'Logitech MX Master 3S', 4, 'SN-LG-2024-004', '2024-03-01', 99.99, 'GOOD', 'Building A, Floor 3', false, 'AVAILABLE', NULL, '2026-07-12 06:56:31.845523', '2026-07-12 06:56:31.845523');
INSERT INTO public.assets VALUES (5, 'AST-005', 'Cisco Meraki MR56', 5, 'SN-CS-2024-005', '2024-03-15', 899.50, 'EXCELLENT', 'Server Room 1', true, 'AVAILABLE', NULL, '2026-07-12 06:56:31.845523', '2026-07-12 06:56:31.845523');
INSERT INTO public.assets VALUES (1, 'AST-001', 'MacBook Pro 16 inch', 1, 'SN-MB-2024-001', '2024-01-15', 2499.99, 'EXCELLENT', 'Building A, Floor 3', false, 'ALLOCATED', NULL, '2026-07-12 06:56:31.845523', '2026-07-12 07:12:59.766679');
INSERT INTO public.assets VALUES (2, 'AST-002', 'Dell UltraSharp 27 Monitor', 2, 'SN-DM-2024-002', '2024-01-20', 499.99, 'GOOD', 'Building A, Floor 2', false, 'ALLOCATED', NULL, '2026-07-12 06:56:31.845523', '2026-07-12 07:12:59.792477');


--
-- Data for Name: departments; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.departments VALUES (1, 'Engineering', NULL, NULL, 'ACTIVE');
INSERT INTO public.departments VALUES (2, 'Operations', NULL, NULL, 'ACTIVE');


--
-- Data for Name: asset_allocations; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.asset_allocations VALUES (2, 2, 1, 1, '2026-07-12', NULL, NULL, 'ACTIVE', NULL, 'Assigned desktop monitor');
INSERT INTO public.asset_allocations VALUES (1, 1, 2, 1, '2026-07-12', NULL, NULL, 'ACTIVE', NULL, 'Assigned for Engineering tasks');


--
-- Data for Name: audit_cycles; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: audit_findings; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: maintenance_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: resource_bookings; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: transfer_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.transfer_history VALUES (1, 1, 'ALLOCATED', 1, 'Asset allocated to employee ID 1 in department ID 1', '2026-07-12 07:12:59.766679');
INSERT INTO public.transfer_history VALUES (2, 2, 'ALLOCATED', 1, 'Asset allocated to employee ID 1 in department ID 1', '2026-07-12 07:12:59.792477');
INSERT INTO public.transfer_history VALUES (3, 1, 'TRANSFER_APPROVED', 2, 'Transfer approved from employee 1 to 2', '2026-07-12 07:12:59.816524');


--
-- Data for Name: transfer_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.transfer_requests VALUES (1, 1, 1, 2, 1, 2, 'APPROVED', '2026-07-12 07:12:59.807316', '2026-07-12 07:12:59.816524');
INSERT INTO public.transfer_requests VALUES (2, 2, 1, 2, 1, 2, 'REJECTED', '2026-07-12 07:12:59.835626', '2026-07-12 07:13:15.65056');


--
-- Name: activity_logs_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.activity_logs_log_id_seq', 1, false);


--
-- Name: asset_allocations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.asset_allocations_id_seq', 2, true);


--
-- Name: asset_categories_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.asset_categories_category_id_seq', 5, true);


--
-- Name: assets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.assets_id_seq', 6, true);


--
-- Name: audit_cycles_audit_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.audit_cycles_audit_id_seq', 1, false);


--
-- Name: audit_findings_finding_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.audit_findings_finding_id_seq', 1, false);


--
-- Name: departments_department_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.departments_department_id_seq', 1, false);


--
-- Name: maintenance_requests_request_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.maintenance_requests_request_id_seq', 1, false);


--
-- Name: notifications_notification_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notifications_notification_id_seq', 1, false);


--
-- Name: resource_bookings_booking_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.resource_bookings_booking_id_seq', 1, false);


--
-- Name: transfer_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transfer_history_id_seq', 3, true);


--
-- Name: transfer_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transfer_requests_id_seq', 2, true);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_id_seq', 3, true);


--
-- PostgreSQL database dump complete
--

\unrestrict vyLMSrY1iyRYeNy0CtASglnYsy8cQnf7iDJEYtGRcszfPkckJeYquNZyUtKf020



SET session_replication_role = 'origin';
