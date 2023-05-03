   ┌──────────┐        ┌──────────┐\
   │  CLIENT  │───(1)─▶│    API   │\
   └──────────┘        └────┬─────┘\
                            │\
                ┌──────────▼──────────┐\
                │                     │\
        ┌───────▼─────┐       ┌───────▼─────┐\
        │ Code Agent  │◀──(6)─│ Test Engine │\
        └───────┬─────┘       └───────┬─────┘\
                └─────(2)─────────────┘\
                                │\
                        ┌───────▼──────┐\
                        │ genTestFiles │\
                        └───────┬──────┘\
                                │\
                               (3)\
                                │\
                        ┌───────▼──────┐\
                        │ runTestFiles │\
                        └───────┬──────┘\
                               (4)\
                                │\
                                └─────┐\
                                      │\
                                      ├──────────(5)──────────┐\
                                      │                       │\
                                      └──────────(5)──────────┘\
1. Client sends a prompt to the API.
2. API sends the prompt to Code Agent and Test Engine.
3. Test Engine generates test files based on the prompt and potential solution attempts received from Code Agent.
4. Test Engine runs the test files and generates test results.
5. Test Engine sends the test results back to the Code Agent. If no successful solution is found, steps 3-5 will repeat in a loop.
6. Once a successful solution is found, the successful solution and test results are sent to the API layer and returned to the client.