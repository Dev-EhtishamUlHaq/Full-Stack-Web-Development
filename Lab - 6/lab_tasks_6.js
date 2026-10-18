// Task 1: Get a user from the API
async function getValidUser(userId) {
    const response = await fetch(
        `https://jsonplaceholder.typicode.com/users/${userId}`
    );

    if (!response.ok) {
        throw new Error("Could not get the user");
    }

    const user = await response.json();

    if (!user || !user.id || !user.name || !user.email) {
        throw new Error("The user data is invalid");
    }

    return user;
}

// Get a user's posts from the API
async function getValidPosts(userId) {
    const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts?userId=${userId}`
    );

    if (!response.ok) {
        throw new Error("Could not get the posts");
    }

    const posts = await response.json();

    if (
        !Array.isArray(posts) ||
        posts.some((post) => !post.id || !post.title || !post.body)
    ) {
        throw new Error("The posts data is invalid");
    }

    return posts;
}

// Task 2: Get the user and posts at the same time
async function getUserAndPosts(userId) {
    const results = await Promise.all([
        getValidUser(userId),
        getValidPosts(userId),
    ]);

    return {
        user: results[0],
        posts: results[1],
    };
}

async function main() {
    const userId = 1;

    try {
        const user = await getValidUser(userId);
        console.log("Task 1 - User:", user);
    } catch (error) {
        console.log("Task 1 - Error:", error.message);
    }

    try {
        const result = await getUserAndPosts(userId);
        console.log("Task 2 - User and posts:", result);
    } catch (error) {
        console.log("Task 2 - Error:", error.message);
    }
}

main();
