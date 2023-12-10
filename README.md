Containers:
    - mongodb-1 - this is Database
    - mongo-express-1 - this is admin for my application
    - app-1 - this is my application

I wanted to create something like a news site where participants can register and read news articles, and participants are divided into three types, this is the owner of this application, ordinary users, and admins. Regular users can also make a paid subscription and get some bonuses, and admins can create articles. The Owner stands above them all, he has access to everything and only he has the right to edit user data and give ordinary users admin rights.
In my project there are 4 tables - these are posts, users, receipts (this table stores receipts of users who have made a paid subscription), categories (this table collects data for viewing statistics. Each post has its own category, for example, sports, politics, economics, etc. Only the owner can create statistics and see which categories of posts have how many likes or dislikes and views) and only a user with the owner role can make a request and view all receipts


How to make requests

I. USER'S CRUD
    
1. Registration
POST http://localhost:3000/auth/register

must have
headers: {
    "content-type": "application/json"
}
body: {
    "email": "user's email",
    "fullName": "user's name",
    "password": "user's password"
}

2. Sign in
POST http://localhost:3000/auth/signIN

must have
headers: {
    "content-type": "application/json"
}"
body: {
    "email": "user's email",
    "password": "user's password"
}

Every time a user logs in, a new token is created and returned to him, the ID of this user is in the token, after successful authorization, the data will be returned to user along with the token.

3. Get info about yourself
GET - http://localhost:3000/auth/me

must have
headers: {
    "content-type": "application/json",
    "authorization": "Bearer user's token"
}

4. Patch data about user
PATCH - http://localhost:3000/auth/update_my_data/there should be a user token here

headers: {
    "content-type": "application/json",
    "authorization": "Bearer user's token"
}
body: {
    What you want to change. There are three options that you can change
    "password": "new password",
    "email": "new email",
    "fullName": "new name"
}

5. Delete your account
DELETE - http://localhost:3000/auth/remove_account/there should be a user token here

headers: {
    "content-type": "application/json",
    "authorization": "Bearer user's token"
}

after successfully deleting the account, the user will receive the following message - { "success": true }


II. POST's CRUD
Only registered users have the right to create, delete and edit their posts, but all users can see the posts.

1. Get all articles
GET - http://localhost:3000/posts

2. Creating a post
POST - http://localhost:3000/posts

must have
headers: {
    "content-type": "application/json",
    "authorization": "Bearer user's token"
}
body: {
    What you want to change. There are three options that you can change
	"title": "post title",
	"text": "post text",
	"category": "post category"
}

3. Updating a post
PATCH - http://localhost:3000/posts/posts's id

must have
headers: {
    "content-type": "application/json",
    "authorization": "Bearer user's token"
}
body: {
    What you want to change. There are three options that you can change
	"title": "new title",
	"text": new text",
	"category": "new category"
}

4. Deleting a post
DELETE - http://localhost:3000/posts/posts's id

must have
headers: {
    "content-type": "application/json",
    "authorization": "Bearer user's token"
}

5.Like and Dislike a post
In fact, these APIs have already been created for frontend - app.patch("/posts/:id/:reaction", CheckAuth.checkIsUser, PostController.toggleReaction);

PATCH - http://localhost:3000/posts/6574baa824a51d4c1c10f9fa/like or http://localhost:3000/posts/6574baa824a51d4c1c10f9fa/disLike
must have
headers: {
    "content-type": "application/json",
    "authorization": "Bearer user's token"
}

III. Categories
Only a user with the role: "owner" property has the right to delete, update, receive, create a user in the database and create statistics in the table "categories". There should be only one user in this project with the role "owner"

GET - http://localhost:3000/categories
must have
headers: {
    "content-type": "application/json",
    "authorization": "Bearer only user's role 'owner' token"
}

IV. Receipts
After payment, a receipt is created in the receipt table with the user's ID, the amount of payment and the payment title.We also check whether the payment was successful or not

1. POST - http://localhost:3000/users/subscribe_to_posts - payment 
must have 
headers: {
    "content-type": "application/json",
    "authorization": "Bearer user's token"
}

body: {
    "amount": "200",
	"title": "for subscribe"
}

2. Checking out subscribe is success or not

GET - http://localhost:3000/users/check_subscribe_is_success

must have 
headers: {
    "content-type": "application/json",
    "authorization": "Bearer user's token"
}


V. Owner requests
If you are logged in as the owner, that is - email - khanh@gmail.com and password - khanh20, then you have full access to all information on the site. You can do a full CRUD with the users and posts table, as well as create statistics in the category table and view all receipts.

Requests are made in the same way as from above.

Just don't forget to send owner's token
















