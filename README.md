# Web Development Final Project - Shepe's BookHub

Submitted by: **Quynh Giang Ho**

This web app: **A platform for book lovers to discover, share, and discuss their favorite books. BookBuzz allows users to search for books, create posts about them, and engage with other readers through comments and upvotes.**

Time spent: **8** hours spent in total

## Required Features

The following **required** functionality is completed:

- [x] **Web app includes a create form that allows the user to create posts**
  - Form requires users to add a post title
  - Forms should have the _option_ for users to add:
    - additional textual content
    - an image added as an external image URL
- [x] **Web app includes a home feed displaying previously created posts**
  - Web app must include home feed displaying previously created posts
  - By default, each post on the posts feed should show only the post's:
    - creation time
    - title
    - upvotes count
  - Clicking on a post should direct the user to a new page for the selected post
- [x] **Users can view posts in different ways**
  - Users can sort posts by either:
    - creation time
    - upvotes count
  - Users can search for posts by title
- [x] **Users can interact with each post in different ways**

  - The app includes a separate post page for each created post when clicked, where any additional information is shown, including:
    - content
    - image
    - comments
  - Users can leave comments underneath a post on the post page
  - Each post includes an upvote button on the post page.
    - Each click increases the post's upvotes count by one
    - Users can upvote any post any number of times

- [x] **A post that a user previously created can be edited or deleted from its post pages**
  - After a user creates a new post, they can go back and edit the post
  - A previously created post can be deleted from its post page

The following **optional** features are implemented:

- [x] Web app implements pseudo-authentication
  - Users can only edit and delete posts or delete comments by entering the secret key, which is set by the user during post creation
  - **or** upon launching the web app, the user is assigned a random user ID. It will be associated with all posts and comments that they make and displayed on them
  - For both options, only the original user author of a post can update or delete it
- [x] Users can customize the interface
  - e.g., selecting the color scheme or showing the content and image of each post on the home feed
- [x] Web app displays a loading animation whenever data is being fetched

The following **additional** features are implemented:

- [x] Integration with Open Library API to search for and display book information
- [x] Book Explorer feature that allows users to search for books and view detailed information
- [x] Users can choose the specific book they want to post about while creating a post, and the book info will be displayed briefly in their post
- [x] Users can see their profile and past posts
- [x] Responsive design that works well on both desktop and mobile devices

## Video Walkthrough

Here's a walkthrough of implemented user stories:

<img src='/src/assets/demo.gif' title='Video Walkthrough' width='' alt='Video Walkthrough' />

<!-- Replace this with whatever GIF tool you used! -->

GIF created with [Screen Recorder](https://chromewebstore.google.com/detail/screen-recorder/hniebljpgcogalllopnjokppmgbhaden?hl=en) and [CloudConvert](https://cloudconvert.com/webm-to-gif)

<!-- Recommended tools:
[Kap](https://getkap.co/) for macOS
[ScreenToGif](https://www.screentogif.com/) for Windows
[peek](https://github.com/phw/peek) for Linux. -->

## Notes

Describe any challenges encountered while building the app:

- Learning and using Tailwindcss for a cleaner, more modern look
- Trying to think of all the pages that should be in the website and how to make it professional (like About page)
- Trying to implement authentication (sign in / sign up) with Supabase
- Trying to learn from AI to write cleaner, best-practice code
- Responsive Design with Tailwindcss

## License

    Copyright 2025 Quynh Giang Ho (Shepe1304)

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
