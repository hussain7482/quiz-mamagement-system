### Technical Approach

The system is built using a **monorepo architecture** with a clear separation between backend and frontend:

- The **Backend** is developed using **Ruby on Rails in API-only mode**.
- The **Frontend** is developed using **Next.js** to provide a fast and interactive user interface.

The backend data design is based on five core models: `Quiz`, `Question`, `Option`, `Attempt`, and `Answer`.

- The **Quiz** model represents a quiz created by the admin.
- Each quiz can have multiple **Questions**.
- Each question can have multiple **Options**.
- Each option contains a **boolean `correct` flag**, which is used later to validate answers and calculate the score.
- When a user attempts a quiz, an **Attempt** record is created.
- The user’s submitted responses are stored in the **Answer** model.

The **admin flow** allows the creation of quizzes along with their questions and options through the frontend interface.  
The **public user flow** allows any user to attempt a quiz without authentication.  

The **score is calculated on the backend** by comparing the submitted answers with the correct options using the boolean flag.  
This keeps the business logic secure and ensures consistency between different clients.

The frontend built with **Next.js** consumes the Rails APIs using `fetch` calls and handles:
- Quiz listing
- Quiz attempt UI
- Form validations
- Result display after submission

This architecture ensures:
- Clear separation of concerns between frontend and backend
- Scalability for future features
- Easy deployment using Render (backend) and Vercel (frontend)

## Reflection (What I Would Do With More Time)

If I had more time to continue working on this project, the first major improvement I would implement is **authentication and authorization**. This would allow secure access for admins and registered users, enabling proper role-based access control between quiz creators and quiz participants.

I would also focus on **code quality and maintainability** by introducing tools like **RuboCop** to enforce consistent coding standards and improve overall code cleanliness. Along with this, I would refactor parts of the backend and frontend to make the code more modular, reusable, and optimized for long-term scalability.

From a feature perspective, I would extend support for **additional question types** such as True/False and Text-based questions on both the backend and frontend. I would also add **detailed result analytics**, including per-question performance, attempt history, and possibly a leaderboard system.

On the frontend, I would improve the **UI/UX design**, add better validations, loading states, and accessibility improvements. I would also add **automated testing** using tools like RSpec for Rails and Jest for Next.js to ensure better reliability.

Overall, with more time, this project could evolve from a basic quiz system into a fully production-ready platform with enhanced security, performance, and user experience.
