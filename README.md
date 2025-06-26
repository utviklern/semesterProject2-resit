# Petlify pet adoption platform

A responsive SPA for pet adoption, built using vanilla JavaScript and Tailwind CSS. Created as part of a resit for Semester Project 2 at Noroff.

## Overview

A pet adoption organization needed a modern platform where:

- Users can browse, search and view available pets  
- Admins can log in, add, edit and delete pet listings  
- The application is accessible, responsive and easy to navigate

## Tech

### Vanilla JavaScript
- No frameworks, everything built from scratch
- Full control over application logic and structure
- Clear and maintainable code

### Hash-Based Routing (SPA)
- Enables seamless single-page navigation with same paths as described in the brief
- Routes are handled client-side using a simple hash router
- No need for multiple `index.html` files

### Tailwind CSS
- Utility-first CSS framework for fast styling
- Built-in responsiveness for mobile, tablet and desktop
- Design remains clean and consistent across the app

## Getting Started

1. Install dependencies  
   ```bash
   npm install
   ```

2. Start the development server  
   ```bash
   npm run dev
   ```

3. Open the application in your browser  
   http://localhost:5173

## Features

- Pet Listings: Browse all available pets with optional search  
- Pet Search: Filter by name, species, breed  
- Pet Details: View pet's info: name, breed, age, size, color, description  
- Admin: Add Pets: Form to add new pets (only when logged in)  
- Admin: Edit/Delete Pets: Update or remove pet listings  
- User Authentication: Register and log in as admin  
- Responsive Design: Looks great on all screen sizes  
- Sharable URLs: Pet detail pages have unique, copyable URLs

## Routes (Hash-based)

| Page               | Route                  |
|--------------------|------------------------|
| Pet List           | `#/pets`               |
| Pet Detail         | `#/pet/:id`            |
| Add Pet (Admin)    | `#/pet/create`         |
| Edit Pet (Admin)   | `#/pet/edit/:id`       |
| Login              | `#/account/login`      |
| Register           | `#/account/register`   |
| Admin Profile      | `#/profile`            |

## Testing and Tools

- HTML validated with W3C Validator
- Tested with Lighthouse and WAVE
- Deployed on Netlify: *https://bejewelled-flan-8f7d7b.netlify.app*

## Requirements Checklist

- All user stories implemented  
- Hash routing matches the project brief
- Responsive design using Tailwind  
- Admin features protected behind authentication  
- Full deployment and working links provided