FORMAT: 1A
HOST: http://localhost:3033/api/v1

# Stackreflow

Stackreflow is an API providing a platform like Stackoverflow(lite). 
Users can create account, login to ask questions and give answers to questions.
Users can also upvote or downvote an answer. 
And view profile to see summary of activities on the platform.

## Authentication - Signup [/auth/signup]

### Registers a user [POST]

You may register using this action. It takes a JSON
object containing a user details.

+ Request (application/json)

        {
            name: "KENZiE",
            email: "KenzDozz@gmail.com",
            password: "secret123",
        }

+ Response 200 (application/json)
    
        {
            status: true,
            user: [
                {
                    id: 1,
                    name: "KENZiE",
                    email: "KenzDozz@gmail.com",
                    created_at: "2018-09-01T12:37:05.510Z",
                    updated_at: "2018-09-01T12:37:05.510Z",
                },
            ]
        }

## Authentication - Login [/auth/login]

### Login a user [POST]

You may login using this action. It takes a JSON
object containing a user credentials and returns a JWT.

+ Request (application/json)

        {
            email: "KenzDozz@gmail.com",
            password: "secret123",
        }

+ Response 200 (application/json)
    
        {
            status: true,
            token: "uvtvcy73r8893y20fgf9vcyvcvg78gc7gbvy8g9vc9vc7g",
            user: [
                {
                    id: 1,
                    name: "KENZiE",
                    email: "KenzDozz@gmail.com",
                    created_at: "2018-09-01T12:37:05.510Z",
                    updated_at: "2018-09-01T12:37:05.510Z",
                },
            ]
        }

## Questions Collection [/questions]

### List All Questions [GET]

You may list all question using this action.

+ Response 200 (application/json)
    
        {
            status: true,
            authCheck: true
            questions: [
                {
                    id: 1,
                    title: 'How can I write API documentation?',
                    body: 'How can I write proper documentation with API Blueprint',
                    tags: 'api, documentation',
                    user_id: 1,
                    username: 'KENZiE',
                    answered: false,
                    answer_count: 2,
                    view_count: 4,
                    created_at: 2018-09-01T12:37:05.510Z,
                    updated_at: 2018-09-01T12:37:05.510Z,
                    created: '2 hours ago',
                    manage: false,
                },
            ]
        }

### Create a New Question [POST]

You may create your own question using this action. It takes a JSON
object containing a question.

+ Request (application/json)

        {
            title: "How to test a test code",
            body: "How can I test a test code, and can I test a chai code with jasmine?",
            tags: "test, code",
            token: "yuguyg37883899ufubbsdyg8fh9u0fbbeg87e980329rnfbu43984h4upb4984",
        }

+ Response 200 (application/json)

            {
                status: true,
                authCheck: true
                question: {
                        id: 2,
                        title: "How to test a test code",
                        body: "How can I test a test code, and can I test a chai code with jasmine?",
                        tags: "test, code",
                        user_id: 1,
                        username: "KENZiE",
                        answered: false,
                        answer_count: 2,
                        view_count: 4,
                        created_at: 2018-09-01T12:37:05.510Z,
                        updated_at: 2018-09-01T12:37:05.510Z,
                        created: "1 second ago",
                        manage: false,
                    }
            }

## Question Collection [/questions/{questionId}]

### Get a Question [GET]

You can get a question by passing the questionId parameter while calling this action.

+ Response 200 (application/json)

        {
            status: true,
            authCheck: true,
            question: {
                    id: 2,
                    title: "How to test a test code",
                    body: "How can I test a test code, and can I test a chai code with jasmine?",
                    tags: "test, code",
                    user_id: 1,
                    username: "KENZiE",
                    answered: false,
                    answer_count: 2,
                    view_count: 4,
                    created_at: 2018-09-01T12:37:05.510Z,
                    updated_at: 2018-09-01T12:37:05.510Z,
                    created: "1 second ago",
                    manage: false,
                },
            answers: [
                {
                    id: 1,
                    question_id: 2,
                    body: "A test code is meant to test a code and cannot be tested",
                    user_id: 2,
                    username: "Kenneth",
                    vote_count: 4,
                    accepted: false
                    created_at: 2018-09-01T12:37:05.510Z,
                    updated_at: 2018-09-01T12:37:05.510Z,
                },
            ]
        }

### Delete a Question [DELETE]

You can delete a question if you are the author by passing the questionId parameter while calling this action.

+ Response 200 (application/json)

        {
            status: true,
            authCheck: true
            question: {}
        }

## Answers Collection I [/questions/{questionId}/answers]

### Post an answer [POST]

You can post an answer to a question by passing the questionId parameter while calling this action.

+ Request (application/json)

        {
            body: "How can I test a test code, and can I test a chai code with jasmine?",
            token: "yuguyg37883899ufubbsdyg8fh9u0fbbeg87e980329rnfbu43984h4upb4984",
        }

+ Response 200 (application/json)

        {
            status: true,
            authCheck: true,
            answer: {
                    id: 1,
                    question_id: 2,
                    body: "A test code is meant to test a code and cannot be tested",
                    user_id: 2,
                    username: "Kenneth",
                    vote_count: 4,
                    accepted: false
                    created_at: 2018-09-01T12:37:05.510Z,
                    updated_at: 2018-09-01T12:37:05.510Z,
                },
        }

## Answers Collection II [/questions/{questionId}/answers/{answerId}]

### Accept an answer [PUT]

You can accept an answer to a question if you are the author of the question by passing the questionId and answerId parameters while calling this action.

+ Response 200 (application/json)

        {
            status: true,
            authCheck: true,
            message: "Answer accepted",
        }

### Delete an Answer [DELETE]

You can delete an answer if you are the author by passing the questionId and answerId parameters while calling this action.

+ Response 200 (application/json)

        {
            status: true,
            authCheck: true
            answer: {}
        }


<!-- 
# Data Structures

## Question (object)
    - id: `1` (number) - The id of the question.
    - title: `How can I write API documentation?` (string) - The title of the question.
    - body: `How can I write proper documentation with API Blueprint` (string) - The description of the question.
    - tags: `api, documentation` (string) - Tags associated with the question.
    - user_id: `1` (number) - The ID of the question author.
    - username: `KENZiE` (string) - The name of the author.
    - answered: `false` (boolean) - Indicates if an answer has been accepted for the question.
    - answer_count: `2` (number) - The count of answers given.
    - view_count: `4` (number) - The count of views of the question.
    - created_at: `2018-09-01T12:37:05.510Z` (timestamp) - The time of question creation.
    - updated_at: `2018-09-01T12:37:05.510Z` (timestamp) - The time question was last updated.
    - created: `2 hours ago` (string) - Time ago of question creation.
    - manage: `false` (boolean) - Indicates if viewer authored the question.
    
    {
        id: 1,
        title: 'How can I write API documentation?',
        body: 'How can I write proper documentation with API Blueprint',
        tags: 'api, documentation',
        user_id: 1,
        username: 'KENZiE',
        answered: false,
        answer_count: 2,
        view_count: 4,
        created_at: 2018-09-01T12:37:05.510Z,
        updated_at: 2018-09-01T12:37:05.510Z,
        created: '2 hours ago',
        manage: false,
    } -->